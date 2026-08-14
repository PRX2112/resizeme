'use client';

import { useState } from 'react';
import BulkFileUpload from '@/components/BulkFileUpload';
import { Download, Loader2, Trash2, Archive, FileImage, Cpu, Server, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatFileSize, downloadFile } from '@/utils/imageUtils';
import { prepareBatchImagesForServer } from '@/utils/clientImagePreprocess';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

const PERCENTAGE_PRESETS = [
    { label: '50%', value: 50 },
    { label: '75%', value: 75 },
    { label: '100%', value: 100 },
    { label: '150%', value: 150 },
    { label: '200%', value: 200 },
];

const FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
];

export default function BulkResizePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [percentage, setPercentage] = useState<number>(100);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [targetFormat, setTargetFormat] = useState('png');
    const [quality, setQuality] = useState(90);
    const [engineMode, setEngineMode] = useState<'client' | 'server'>('client');

    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleFilesSelect = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
        setError(null);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const processBatchInBrowser = async () => {
        const zip = new JSZip();
        const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : `image/${targetFormat}`;
        const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setStatusText(`Resizing image ${i + 1} of ${files.length}: ${file.name}...`);
            setProgress(Math.round(((i) / files.length) * 100));

            let sourceBlob: Blob = file;
            const fileNameLower = file.name.toLowerCase();
            const isHeic = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif');

            if (isHeic) {
                try {
                    const heic2any = (await import('heic2any')).default;
                    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.95 });
                    sourceBlob = Array.isArray(converted) ? converted[0] : converted;
                } catch (e) {
                    console.error('HEIC decoding failed on file:', file.name, e);
                }
            }

            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const imageEl = new Image();
                const objUrl = URL.createObjectURL(sourceBlob);
                imageEl.onload = () => {
                    URL.revokeObjectURL(objUrl);
                    resolve(imageEl);
                };
                imageEl.onerror = () => {
                    URL.revokeObjectURL(objUrl);
                    reject(new Error(`Failed to load ${file.name}`));
                };
                imageEl.src = objUrl;
            });

            let targetW: number;
            let targetH: number;

            if (width && height) {
                targetW = width;
                targetH = height;
            } else if (width) {
                targetW = width;
                targetH = Math.round((img.naturalHeight * width) / img.naturalWidth);
            } else if (height) {
                targetH = height;
                targetW = Math.round((img.naturalWidth * height) / img.naturalHeight);
            } else {
                const scale = percentage / 100;
                targetW = Math.round(img.naturalWidth * scale);
                targetH = Math.round(img.naturalHeight * scale);
            }

            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, targetW);
            canvas.height = Math.max(1, targetH);
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                if (targetFormat === 'jpg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, targetW, targetH);
                }

                ctx.drawImage(img, 0, 0, targetW, targetH);

                const blob = await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob((b) => resolve(b), mimeType, quality / 100);
                });

                if (blob) {
                    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    zip.file(`${baseName}_resized_${targetW}x${targetH}.${ext}`, blob);
                }
            }
        }

        setStatusText('Generating compressed ZIP archive...');
        setProgress(95);

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `resized_images_${Date.now()}.zip`);
        setProgress(100);
        setStatusText('Batch resize complete!');
    };

    const processBatchOnServer = async () => {
        setStatusText('Pre-processing images on client before upload...');
        setProgress(15);

        const preparedFiles = await prepareBatchImagesForServer(files);

        setStatusText('Uploading batch to Sharp server engine...');
        setProgress(45);

        const response = await fetch('/api/resize/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                images: preparedFiles.map((file) => ({
                    name: file.name,
                    content: file.content,
                })),
                settings: {
                    percentage: width || height ? undefined : percentage,
                    width: width || undefined,
                    height: height || undefined,
                    format: targetFormat,
                    quality,
                },
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Bulk resize processing failed on server');
        }

        setStatusText('Downloading optimized ZIP archive...');
        setProgress(90);

        const blob = await response.blob();
        saveAs(blob, `resized_images_${Date.now()}.zip`);
        setProgress(100);
        setStatusText('Batch resize complete!');
    };

    const handleBulkResize = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setError(null);
        setProgress(0);

        try {
            if (engineMode === 'client') {
                await processBatchInBrowser();
            } else {
                await processBatchOnServer();
            }
        } catch (err: any) {
            console.error('Bulk resize error:', err);
            setError(err.message || 'An error occurred during bulk resize.');
        } finally {
            setIsProcessing(false);
        }
    };

    const clearAll = () => {
        setFiles([]);
        setError(null);
        setProgress(0);
        setStatusText('');
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Bulk Image Resizer
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Resize multiple images simultaneously and download as a ZIP — fast, private, and unlimited.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Upload & Queue Grid (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                            <BulkFileUpload onFilesSelect={handleFilesSelect} maxFiles={30} />
                        </div>

                        {files.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-3">
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <FileImage className="w-4 h-4 text-blue-600" />
                                        <span>Batch Queue ({files.length} {files.length === 1 ? 'file' : 'files'})</span>
                                    </div>
                                    <button
                                        onClick={clearAll}
                                        className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Clear All</span>
                                    </button>
                                </div>

                                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                                    {files.map((file, idx) => (
                                        <div
                                            key={`${file.name}-${idx}`}
                                            className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 text-xs"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-7 h-7 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-[10px] uppercase flex-shrink-0">
                                                    {file.name.split('.').pop() || 'IMG'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(idx)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${files.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Engine Mode Toggle */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Processing Engine
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                        onClick={() => setEngineMode('client')}
                                        className={`p-2 rounded-xl border text-left transition-all ${
                                            engineMode === 'client'
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1 text-xs font-bold">
                                            <Cpu className="w-3.5 h-3.5" />
                                            <span>Browser</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 block mt-0.5">100% Private, JSZip</span>
                                    </button>

                                    <button
                                        onClick={() => setEngineMode('server')}
                                        className={`p-2 rounded-xl border text-left transition-all ${
                                            engineMode === 'server'
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1 text-xs font-bold">
                                            <Server className="w-3.5 h-3.5" />
                                            <span>Sharp Server</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 block mt-0.5">High-Memory Batch</span>
                                    </button>
                                </div>
                            </div>

                            {/* Percentage Scaling */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        Scale Percentage
                                    </span>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                                        {percentage}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-5 gap-1">
                                    {PERCENTAGE_PRESETS.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => {
                                                setPercentage(p.value);
                                                setWidth(0);
                                                setHeight(0);
                                            }}
                                            className={`py-1 text-xs font-semibold rounded-md border transition-all ${
                                                percentage === p.value && !width && !height
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="200"
                                    value={percentage}
                                    onChange={(e) => {
                                        setPercentage(Number(e.target.value));
                                        setWidth(0);
                                        setHeight(0);
                                    }}
                                    className="w-full h-1.5 accent-blue-600"
                                />
                            </div>

                            {/* Format & Quality */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Target Format
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {FORMATS.map((fmt) => (
                                        <button
                                            key={fmt.value}
                                            onClick={() => setTargetFormat(fmt.value)}
                                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                targetFormat === fmt.value
                                                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                            }`}
                                        >
                                            {fmt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress & Action */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                {isProcessing && (
                                    <div className="space-y-1.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-800/40">
                                        <div className="flex justify-between text-[11px] font-medium text-blue-900 dark:text-blue-200">
                                            <span className="truncate max-w-[170px]">{statusText}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBulkResize}
                                    disabled={files.length === 0 || isProcessing}
                                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Processing Batch...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Archive className="w-4 h-4" />
                                            <span>Resize & Download ZIP ({files.length})</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="bulk-resize" />

                {/* In-Content Ad Placement */}
                {contentAdSlot && (
                    <div className="pt-2">
                        <AdBanner dataAdSlot={contentAdSlot} dataAdFormat="horizontal" />
                    </div>
                )}
            </div>
        </div>
    );
}
