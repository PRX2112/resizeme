'use client';

import { useState } from 'react';
import { useImageCompress } from '@/hooks/useImageCompress';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import FileUpload from '@/components/FileUpload';
import { formatFileSize, downloadFile } from '@/utils/imageUtils';
import {
    Download,
    RotateCcw,
    Loader2,
    ArrowRight,
    CheckCircle,
    Sliders,
    Sparkles,
} from 'lucide-react';
import {
    ReactCompareSlider,
    ReactCompareSliderImage,
} from 'react-compare-slider';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface CompressToolProps {
    defaultFormat?: string;
    title?: string;
}

export default function CompressTool({ defaultFormat, title }: CompressToolProps) {
    const {
        originalFile,
        previewUrl,
        compressedResult,
        isCompressing,
        error,
        quality,
        setQuality,
        targetKb,
        setTargetKb,
        mode,
        setMode,
        loadFile,
        reset,
    } = useImageCompress();

    const { limits, trackDownload } = useUsageTracking();
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleFileSelect = async (file: File) => {
        await loadFile(file);
    };

    const handleDownload = async () => {
        if (!compressedResult) return;
        const ext = compressedResult.format === 'jpeg' ? 'jpg' : compressedResult.format;
        downloadFile(compressedResult.image, `compressed-image.${ext}`);

        if (originalFile) {
            await trackDownload(originalFile.size, 'Compress Tool', originalFile.name);
        }
    };

    const savedPercentage = compressedResult
        ? Math.round(((compressedResult.originalSize - compressedResult.compressedSize) / compressedResult.originalSize) * 100)
        : 0;

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Image Compressor'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Reduce file size up to 90% with target KB controls or adaptive quality quantization.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Live Canvas & Comparison Preview (lg:col-span-8) */}
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
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Comparing:</span>{' '}
                                        Original vs Compressed Output
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-gray-950 min-h-[380px] max-h-[540px] flex items-center justify-center">
                                    {previewUrl && compressedResult ? (
                                        <ReactCompareSlider
                                            itemOne={
                                                <ReactCompareSliderImage
                                                    src={previewUrl}
                                                    alt="Original"
                                                />
                                            }
                                            itemTwo={
                                                <ReactCompareSliderImage
                                                    src={compressedResult.image}
                                                    alt="Compressed"
                                                    style={{ opacity: isCompressing ? 0.5 : 1, transition: 'opacity 0.2s' }}
                                                />
                                            }
                                            className="h-[500px] w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center text-white py-20">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        </div>
                                    )}

                                    <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                                        <span className="bg-black/75 text-white text-[11px] px-3 py-1 rounded-full backdrop-blur-sm">
                                            Drag slider to inspect visual fidelity
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!originalFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Section 1: Compression Mode */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Optimization Method
                                </span>
                                <div className="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => setMode('quality')}
                                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                            mode === 'quality'
                                                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                        }`}
                                    >
                                        Quality (%)
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMode('targetSize');
                                            if (!targetKb) setTargetKb(100);
                                        }}
                                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                            mode === 'targetSize'
                                                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                        }`}
                                    >
                                        Target KB
                                    </button>
                                </div>
                            </div>

                            {/* Section 2: Mode Specific Controls */}
                            {mode === 'quality' ? (
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            Perceptual Quality
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                                            {quality}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="95"
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                        <span>Max Compression (10%)</span>
                                        <span>High Fidelity (95%)</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            Target File Size
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                                            {targetKb || 100} KB
                                        </span>
                                    </div>

                                    {/* KB Presets */}
                                    <div className="grid grid-cols-5 gap-1">
                                        {[20, 50, 100, 200, 500].map((kb) => (
                                            <button
                                                key={kb}
                                                onClick={() => setTargetKb(kb)}
                                                className={`py-1 text-xs font-semibold rounded-md border transition-all ${
                                                    targetKb === kb
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                                                }`}
                                            >
                                                {kb}k
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="10"
                                            max="5000"
                                            value={targetKb || ''}
                                            onChange={(e) => setTargetKb(Number(e.target.value) || null)}
                                            placeholder="Custom KB (e.g. 75)"
                                            className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-gray-400 font-bold">KB</span>
                                    </div>
                                </div>
                            )}

                            {/* Section 3: Compression Stats */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Compression Summary
                                </span>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                                        <div className="text-[10px] text-gray-400">Original</div>
                                        <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                                            {compressedResult ? formatFileSize(compressedResult.originalSize) : '—'}
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">New Size</div>
                                        <div className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                                            {compressedResult ? formatFileSize(compressedResult.compressedSize) : '—'}
                                        </div>
                                    </div>
                                </div>
                                {savedPercentage > 0 && (
                                    <div className="text-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                                        🎉 Reduced file size by {savedPercentage}%
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Action Button */}
                            <button
                                onClick={handleDownload}
                                disabled={isCompressing || !compressedResult}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {isCompressing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Compressing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Download Compressed Image</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="compress" />

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
