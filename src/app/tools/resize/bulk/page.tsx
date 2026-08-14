'use client';

import { useState } from 'react';
import BulkFileUpload from '@/components/BulkFileUpload';
import { Download, Loader2, Trash2, Archive, FileImage, Cpu, Server, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatFileSize, downloadFile } from '@/utils/imageUtils';
import { prepareBatchImagesForServer } from '@/utils/clientImagePreprocess';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

    const handleFilesSelect = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
        setError(null);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Client-side batch resizing with HTML5 Canvas + JSZip
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

            // Calculate output dimensions
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

    // Server-side batch resizing with Sharp
    const processBatchOnServer = async () => {
        setStatusText('Preparing and uploading batch to server...');
        setProgress(20);

        const images = await prepareBatchImagesForServer(files);

        setStatusText('Processing images with Sharp engine...');
        setProgress(50);

        const response = await fetch('/api/resize/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                images,
                settings: {
                    percentage,
                    width: width || undefined,
                    height: height || undefined,
                    format: targetFormat,
                    quality,
                }
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Batch processing failed on server');
        }

        setStatusText('Downloading ZIP archive...');
        setProgress(85);

        const blob = await response.blob();
        saveAs(blob, `resized_images_batch_${Date.now()}.zip`);
        setProgress(100);
        setStatusText('Batch resize complete!');
    };

    const handleBulkResize = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        try {
            if (engineMode === 'client') {
                await processBatchInBrowser();
            } else {
                await processBatchOnServer();
            }
        } catch (err: any) {
            console.error('Bulk resize error:', err);
            setError(err.message || 'Failed to process bulk resize');
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Bulk Image <span className="gradient-text">Resize</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                        Resize multiple images simultaneously and download as a ZIP — fast, private, and unlimited.
                    </p>

                    <div className="block">
                        <a
                            href="/tools/resize"
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-primary/20 hover:border-primary text-primary font-medium transition-all hover:shadow-lg hover:shadow-primary/10"
                        >
                            <span>← Back to Single Image Resize</span>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: File List & Upload */}
                    <div className="lg:col-span-2 space-y-6">
                        <BulkFileUpload onFilesSelect={handleFilesSelect} maxFiles={30} />

                        {files.length > 0 && (
                            <div className="card animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileImage className="w-5 h-5 text-primary" />
                                        Files Selected ({files.length})
                                    </h3>
                                    <button
                                        onClick={clearAll}
                                        className="text-sm text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                                    {files.map((file, idx) => (
                                        <div key={`${file.name}-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/60">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                                    {file.name.split('.').pop() || 'IMG'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(idx)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove file"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Controls */}
                    <div className="space-y-6 animate-fade-in">
                        <div className="card space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Batch Settings
                            </h3>

                            {/* Engine Mode Toggle */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                    Processing Engine
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setEngineMode('client')}
                                        className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col gap-1 ${
                                            engineMode === 'client'
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 font-bold text-xs">
                                            <Cpu className="w-4 h-4" />
                                            <span>Browser Engine</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500">Fast, 100% private, no timeouts</span>
                                    </button>

                                    <button
                                        onClick={() => setEngineMode('server')}
                                        className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col gap-1 ${
                                            engineMode === 'server'
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 font-bold text-xs">
                                            <Server className="w-4 h-4" />
                                            <span>Sharp Server</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500">Cloud Sharp processing</span>
                                    </button>
                                </div>
                            </div>

                            {/* Percentage Scaling */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Scale Percentage: <span className="font-bold text-primary">{percentage}%</span>
                                </label>
                                <div className="grid grid-cols-5 gap-1.5 mb-2">
                                    {PERCENTAGE_PRESETS.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => {
                                                setPercentage(p.value);
                                                setWidth(0);
                                                setHeight(0);
                                            }}
                                            className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                                percentage === p.value && !width && !height
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Format */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Output Format
                                </label>
                                <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    {FORMATS.map((fmt) => (
                                        <button
                                            key={fmt.value}
                                            onClick={() => setTargetFormat(fmt.value)}
                                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                                targetFormat === fmt.value
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {fmt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Quality: {quality}%
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Action & Progress */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleBulkResize}
                                    disabled={files.length === 0 || isProcessing}
                                    className="w-full btn btn-primary text-base py-4 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing Batch...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Archive className="w-5 h-5" />
                                            <span>Resize & Download ZIP {files.length > 0 ? `(${files.length})` : ''}</span>
                                        </>
                                    )}
                                </button>

                                {isProcessing && (
                                    <div className="space-y-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                                        <div className="flex justify-between text-xs font-medium text-primary">
                                            <span className="truncate">{statusText}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
