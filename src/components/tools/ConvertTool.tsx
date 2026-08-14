'use client';

import { useState } from 'react';
import { useImageConvert } from '@/hooks/useImageConvert';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import BulkFileUpload from '@/components/BulkFileUpload';
import {
    Download,
    RotateCcw,
    Loader2,
    X,
    Plus,
    RefreshCw,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

const FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
    { value: 'avif', label: 'AVIF' },
    { value: 'gif', label: 'GIF' },
];

interface ConvertToolProps {
    defaultInputFormat?: string;
    defaultOutputFormat?: string;
    title?: string;
}

export default function ConvertTool({ defaultInputFormat, defaultOutputFormat = 'jpg', title }: ConvertToolProps) {
    const {
        files,
        isConverting,
        error,
        addFiles,
        removeFile,
        convertImages,
        reset,
    } = useImageConvert();

    const [targetFormat, setTargetFormat] = useState(defaultOutputFormat);
    const [quality, setQuality] = useState(90);

    const { limits, trackDownload } = useUsageTracking();
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleFilesSelect = async (selectedFiles: File[]) => {
        addFiles(selectedFiles);
    };

    const handleConvert = async () => {
        await convertImages(targetFormat, quality);

        for (const fileData of files) {
            await trackDownload(fileData.file.size, 'Convert Tool', fileData.file.name);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Image Format Converter'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Convert images between PNG, JPG, WebP, AVIF, GIF, and HEIC in seconds.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Upload & File Preview Grid (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        {files.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                <BulkFileUpload
                                    onFilesSelect={handleFilesSelect}
                                    accept={defaultInputFormat ? `image/${defaultInputFormat}` : undefined}
                                    maxSizeMB={limits.maxFileSize === Infinity ? Infinity : limits.maxFileSize / (1024 * 1024)}
                                    maxFiles={20}
                                />
                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Uploaded Queue ({files.length} {files.length === 1 ? 'file' : 'files'})
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Clear All</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {files.map((f, i) => (
                                        <div key={i} className="relative group rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-2 overflow-hidden">
                                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 mb-1.5 flex items-center justify-center">
                                                <img
                                                    src={f.preview}
                                                    alt={f.file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {f.file.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500">
                                                {(f.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    ))}

                                    {/* Add More Tile */}
                                    <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-colors aspect-square">
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    addFiles(Array.from(e.target.files));
                                                }
                                            }}
                                        />
                                        <Plus className="w-5 h-5 text-gray-400 mb-1" />
                                        <span className="text-[11px] font-medium text-gray-500">Add More</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Controls Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${files.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Section 1: Target Output Format */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Target Format
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {FORMATS.map((fmt) => (
                                        <button
                                            key={fmt.value}
                                            onClick={() => setTargetFormat(fmt.value)}
                                            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
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

                            {/* Section 2: Quality Slider (for lossy formats) */}
                            {['jpg', 'jpeg', 'webp', 'avif'].includes(targetFormat.toLowerCase()) && (
                                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            Encoding Quality
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">{quality}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            )}

                            {/* Section 3: Action Button */}
                            <button
                                onClick={handleConvert}
                                disabled={isConverting || files.length === 0}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {isConverting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Converting Files...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Convert to {targetFormat.toUpperCase()}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="convert" />

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
