'use client';

import { useState } from 'react';
import { useImageEnlarge } from '@/hooks/useImageEnlarge';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import FileUpload from '@/components/FileUpload';
import { formatFileSize, downloadFile } from '@/utils/imageUtils';
import {
    Download,
    RotateCcw,
    Loader2,
    Check,
    Wand2,
    Maximize,
    ArrowRight,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface EnlargeToolProps {
    title?: string;
}

export default function EnlargeTool({ title }: EnlargeToolProps) {
    const {
        originalFile,
        previewUrl,
        result,
        isProcessing,
        error,
        factor,
        setFactor,
        enhance,
        setEnhance,
        loadFile,
        enlargeImage,
        reset,
    } = useImageEnlarge();

    const { limits, trackDownload } = useUsageTracking();
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleFileSelect = async (file: File) => {
        await loadFile(file);
    };

    const handleEnlarge = async () => {
        await enlargeImage();
    };

    const handleDownload = async () => {
        if (!result) return;
        downloadFile(result.image, `enlarged-${factor}x-image.${originalFile?.name.split('.').pop() || 'png'}`);

        if (originalFile) {
            await trackDownload(originalFile.size, 'Enlarge Tool', originalFile.name);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Image Enlarger'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Upscale images 2x or 4x with Lanczos3 sinc interpolation and unsharp masking.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Canvas Preview (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        {!originalFile ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    accept="image/*"
                                    maxSizeMB={limits.maxFileSize === Infinity ? Infinity : limits.maxFileSize / (1024 * 1024)}
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
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Status:</span>{' '}
                                        {result ? `Upscaled to ${result.newWidth} × ${result.newHeight}px` : 'Ready to Upscale'}
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-gray-950 min-h-[380px] max-h-[540px] flex items-center justify-center p-4">
                                    {result ? (
                                        <img
                                            src={result.image}
                                            alt="Enlarged"
                                            className="max-h-[500px] max-w-full object-contain"
                                        />
                                    ) : (
                                        <img
                                            src={previewUrl!}
                                            alt="Original"
                                            className="max-h-[500px] max-w-full object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!originalFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Upscale Factor */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Upscale Multiplier
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                    {[2, 4].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFactor(f as 2 | 4)}
                                            className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                                                factor === f
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-sm'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                                            }`}
                                        >
                                            {f}x Resolution
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Detail Enhancement */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Image Enhancement
                                </span>
                                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 cursor-pointer hover:border-blue-400 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={enhance}
                                        onChange={(e) => setEnhance(e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                            <Wand2 className="w-3.5 h-3.5 text-purple-500" />
                                            <span>Unsharp Mask Kernel</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            Restores micro-contrast and edge clarity
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                {!result ? (
                                    <button
                                        onClick={handleEnlarge}
                                        disabled={isProcessing || !originalFile}
                                        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Upscaling ({factor}x)...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Maximize className="w-4 h-4" />
                                                <span>Enlarge {factor}x</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleDownload}
                                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download {result.newWidth} × {result.newHeight}px</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="enlarge" />

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
