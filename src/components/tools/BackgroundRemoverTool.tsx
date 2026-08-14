'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, Trash2, Zap, Image as ImageIcon, Loader2, Sparkles, CheckCircle2, RotateCcw, Cpu } from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface BackgroundRemoverToolProps {
    title?: string;
}

export default function BackgroundRemoverTool({ title }: BackgroundRemoverToolProps) {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressStage, setProgressStage] = useState<'idle' | 'loading-model' | 'inferencing' | 'completed'>('idle');
    const [progressPercent, setProgressPercent] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (sourceUrl) URL.revokeObjectURL(sourceUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);

        setSourceFile(file);
        setSourceUrl(URL.createObjectURL(file));
        setResultUrl(null);
        setError(null);
        setProgressStage('idle');
        setProgressPercent(0);
        setStatusMessage('');
    };

    const processImage = async () => {
        if (!sourceFile) return;

        setIsProcessing(true);
        setError(null);
        setProgressStage('loading-model');
        setProgressPercent(10);
        setStatusMessage('Loading neural engine...');

        try {
            const { removeBackground } = await import('@imgly/background-removal');

            const blob = await removeBackground(sourceFile, {
                debug: false,
                progress: (key: string, current: number, total: number) => {
                    const pct = total > 0 ? Math.round((current / total) * 100) : 50;

                    if (key.includes('fetch') || key.includes('load')) {
                        setProgressStage('loading-model');
                        setStatusMessage('Downloading AI Model...');
                        setProgressPercent(Math.min(95, Math.max(15, pct)));
                    } else if (key.includes('compute') || key.includes('inference') || key.includes('segment')) {
                        setProgressStage('inferencing');
                        setStatusMessage('Segmenting foreground...');
                        setProgressPercent(Math.min(98, Math.max(50, pct)));
                    }
                },
            });

            const outputUrl = URL.createObjectURL(blob);
            setResultUrl(outputUrl);
            setProgressStage('completed');
            setProgressPercent(100);
            setStatusMessage('Background removed!');
        } catch (err: any) {
            console.error('BG Removal Error:', err);
            setError('Failed to remove background. Please ensure modern WebAssembly support in your browser.');
            setProgressStage('idle');
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setSourceFile(null);
        if (sourceUrl) URL.revokeObjectURL(sourceUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setSourceUrl(null);
        setResultUrl(null);
        setError(null);
        setProgressStage('idle');
        setProgressPercent(0);
        setStatusMessage('');
    };

    const download = () => {
        if (!resultUrl) return;
        const a = document.createElement('a');
        a.href = resultUrl;
        a.download = `transparent_${sourceFile?.name.replace(/\.[^/.]+$/, '') || 'image'}.png`;
        a.click();
    };

    useEffect(() => {
        return () => {
            if (sourceUrl) URL.revokeObjectURL(sourceUrl);
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        };
    }, [sourceUrl, resultUrl]);

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'AI Background Remover'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Extract subjects and remove backgrounds with client-side WebAssembly neural segmentation.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Canvas Preview (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        {!sourceUrl ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                <label className="block w-full cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-colors">
                                        <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Upload Photo to Remove Background
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP, HEIC</p>
                                    </div>
                                    <input type="file" accept="image/*,.heic,.heif" className="hidden" onChange={handleUpload} />
                                </label>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">File:</span>{' '}
                                        {sourceFile?.name}
                                    </div>
                                    <button
                                        onClick={reset}
                                        disabled={isProcessing}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] bg-gray-950 flex items-center justify-center p-4 min-h-[380px] max-h-[540px]">
                                    {resultUrl ? (
                                        <img
                                            src={resultUrl}
                                            alt="Transparent Result"
                                            className="max-h-[500px] max-w-full object-contain filter drop-shadow-2xl"
                                        />
                                    ) : (
                                        <img
                                            src={sourceUrl}
                                            alt="Original"
                                            className={`max-h-[500px] max-w-full object-contain ${isProcessing ? 'blur-sm opacity-60' : ''}`}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!sourceFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Privacy & Engine info */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Privacy-First Engine
                                </span>
                                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs space-y-2">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Cpu className="w-4 h-4 text-blue-500" />
                                        <span>100% Client-Side WebAssembly</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        <span>U2-Net Neural Matting</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {isProcessing && (
                                <div className="space-y-2 p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-800/40">
                                    <div className="flex justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
                                        <span>{statusMessage}</span>
                                        <span>{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-xs">
                                    {error}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2">
                                {!resultUrl ? (
                                    <button
                                        onClick={processImage}
                                        disabled={isProcessing || !sourceFile}
                                        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Processing Image...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4" />
                                                <span>Remove Background Now</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={download}
                                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download Transparent PNG</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="background-remover" />

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
