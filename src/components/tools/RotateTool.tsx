'use client';

import { useState } from 'react';
import { useImageTransform } from '@/hooks/useImageTransform';
import FileUpload from '@/components/FileUpload';
import { downloadFile } from '@/utils/imageUtils';
import {
    Download,
    RotateCcw,
    Loader2,
    RotateCw,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface RotateToolProps {
    title?: string;
}

export default function RotateTool({ title }: RotateToolProps) {
    const {
        originalFile,
        previewUrl,
        result,
        isProcessing,
        error,
        rotation,
        setRotation,
        backgroundColor,
        setBackgroundColor,
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
            downloadFile(res.image, `${baseName}_rotated_${rotation}deg.${ext}`);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Rotate Image'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Rotate photos by 90°, 180°, 270°, or fine-tune angles with custom sliders.
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
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Angle:</span>{' '}
                                        {rotation}° degrees
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
                                            alt="Rotated result"
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
                            {/* Preset Buttons */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Quick Rotate
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                        onClick={() => setRotation((r) => r - 90)}
                                        className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-xs font-semibold flex items-center justify-center gap-1.5"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>-90° Left</span>
                                    </button>
                                    <button
                                        onClick={() => setRotation((r) => r + 90)}
                                        className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-xs font-semibold flex items-center justify-center gap-1.5"
                                    >
                                        <RotateCw className="w-3.5 h-3.5" />
                                        <span>+90° Right</span>
                                    </button>
                                    <button
                                        onClick={() => setRotation(180)}
                                        className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-xs font-semibold"
                                    >
                                        180° Flip
                                    </button>
                                    <button
                                        onClick={() => setRotation(0)}
                                        className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-xs font-semibold"
                                    >
                                        0° Normal
                                    </button>
                                </div>
                            </div>

                            {/* Fine Angle Slider */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        Custom Angle
                                    </span>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                                        {rotation}°
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={rotation % 360}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-full h-1.5 accent-blue-600"
                                />
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
                <ToolRecommendations currentTool="rotate" />

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
