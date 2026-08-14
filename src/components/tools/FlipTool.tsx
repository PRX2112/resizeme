'use client';

import { useState } from 'react';
import { useImageTransform } from '@/hooks/useImageTransform';
import FileUpload from '@/components/FileUpload';
import { downloadFile } from '@/utils/imageUtils';
import {
    Download,
    RotateCcw,
    Loader2,
    FlipHorizontal,
    FlipVertical,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface FlipToolProps {
    title?: string;
}

export default function FlipTool({ title }: FlipToolProps) {
    const {
        originalFile,
        previewUrl,
        result,
        isProcessing,
        error,
        flipH,
        setFlipH,
        flipV,
        setFlipV,
        loadFile,
        applyTransform,
        reset,
        getPreviewStyle,
    } = useImageTransform();

    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleApplyAndDownload = async () => {
        const res = await applyTransform();
        if (res?.image) {
            const ext = originalFile?.name.split('.').pop() || 'png';
            const baseName = originalFile?.name.substring(0, originalFile.name.lastIndexOf('.')) || 'image';
            const flipLabel = flipH && flipV ? 'flipped_hv' : flipH ? 'flipped_h' : flipV ? 'flipped_v' : 'flipped';
            downloadFile(res.image, `${baseName}_${flipLabel}.${ext}`);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Flip Image'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Flip photos horizontally or vertically in your browser with zero upload latency.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Canvas Preview (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        {!originalFile ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                <FileUpload
                                    onFileSelect={loadFile}
                                    accept="image/*"
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
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">State:</span>{' '}
                                        {flipH && flipV ? 'Horizontal & Vertical Mirror' : flipH ? 'Horizontal Mirror' : flipV ? 'Vertical Mirror' : 'Original Orientation'}
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center p-8 min-h-[380px] max-h-[540px]">
                                    {result ? (
                                        <img
                                            src={result.image}
                                            alt="Flipped result"
                                            className="max-h-[500px] max-w-full object-contain"
                                        />
                                    ) : (
                                        previewUrl && (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={getPreviewStyle()}
                                                className="max-h-[460px] max-w-full object-contain transition-transform duration-300"
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!originalFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Flip Options */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Mirror Axes
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setFlipH(!flipH)}
                                        className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            flipH
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                                        }`}
                                    >
                                        <FlipHorizontal className="w-5 h-5" />
                                        <span className="text-xs">Flip Horizontal</span>
                                    </button>
                                    <button
                                        onClick={() => setFlipV(!flipV)}
                                        className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            flipV
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                                        }`}
                                    >
                                        <FlipVertical className="w-5 h-5" />
                                        <span className="text-xs">Flip Vertical</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleApplyAndDownload}
                                disabled={isProcessing || !originalFile}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Apply & Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="flip" />

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
