'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, Trash2, Zap, Image as ImageIcon, Loader2, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export default function BackgroundRemoverTool() {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressStage, setProgressStage] = useState<'idle' | 'loading-model' | 'inferencing' | 'completed'>('idle');
    const [progressPercent, setProgressPercent] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Cleanup old URLs
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
        setStatusMessage('Loading AI neural engine in browser...');

        try {
            // Protect LCP/TBT Core Web Vitals: dynamically import the heavy WASM library only when requested
            const { removeBackground } = await import('@imgly/background-removal');

            const blob = await removeBackground(sourceFile, {
                debug: false,
                progress: (key: string, current: number, total: number) => {
                    const pct = total > 0 ? Math.round((current / total) * 100) : 50;

                    if (key.includes('fetch') || key.includes('load')) {
                        setProgressStage('loading-model');
                        setStatusMessage('Downloading AI Model (Cached locally after first use)...');
                        setProgressPercent(Math.min(95, Math.max(15, pct)));
                    } else if (key.includes('compute') || key.includes('inference') || key.includes('segment')) {
                        setProgressStage('inferencing');
                        setStatusMessage('Segmenting foreground & removing background...');
                        setProgressPercent(Math.min(98, Math.max(50, pct)));
                    }
                }
            });

            const outputUrl = URL.createObjectURL(blob);
            setResultUrl(outputUrl);
            setProgressStage('completed');
            setProgressPercent(100);
            setStatusMessage('Background removed with neural precision!');
        } catch (err: any) {
            console.error('BG Removal Error:', err);
            setError('Failed to remove background. Please try a standard PNG/JPG image or use a modern Chromium/Safari browser.');
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sourceUrl) URL.revokeObjectURL(sourceUrl);
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        };
    }, [sourceUrl, resultUrl]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4 shadow-sm border border-purple-200 dark:border-purple-800">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> 100% In-Browser AI • Zero Server Uploads
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        AI <span className="gradient-text">Background Remover</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Extract subjects and remove backgrounds instantly with client-side WebAssembly neural segmentation.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start animate-fade-in">
                    {/* Left side: Upload & Controls */}
                    <div className="card space-y-6">
                        {!sourceUrl ? (
                            <div className="space-y-4">
                                <label className="block w-full cursor-pointer">
                                    <div className="border-2 border-dashed border-purple-300 dark:border-purple-500/50 rounded-2xl p-10 text-center hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-500 transition-all group">
                                        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Upload Photo</h3>
                                        <p className="text-sm text-gray-500">Supports JPG, PNG, WebP, HEIC</p>
                                    </div>
                                    <input type="file" accept="image/*,.heic,.heif" className="hidden" onChange={handleUpload} />
                                </label>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-4 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-purple-500" /> 100% In-Browser WASM
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🔒</span> Zero Data Uploads
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🆓</span> 100% Free & Unlimited
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-500" /> U2-Net Neural Matting
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[220px]">{sourceFile?.name}</h3>
                                        <p className="text-sm text-gray-500">{(sourceFile!.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={reset}
                                        disabled={isProcessing}
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                                        title="Clear Image"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                {!resultUrl && (
                                    <div className="space-y-5">
                                        <button
                                            onClick={processImage}
                                            disabled={isProcessing}
                                            className="w-full btn btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-purple-500/20"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing Image...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-5 h-5" /> Remove Background Now
                                                </>
                                            )}
                                        </button>

                                        {isProcessing && (
                                            <div className="space-y-3 p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-800/40">
                                                <div className="flex justify-between text-sm font-medium text-purple-950 dark:text-purple-200">
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                        {statusMessage}
                                                    </span>
                                                    <span className="font-mono">{progressPercent}%</span>
                                                </div>

                                                <div className="w-full bg-purple-200 dark:bg-purple-900/50 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>

                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                    {progressStage === 'loading-model'
                                                        ? 'Downloading neural model into browser cache. First run takes ~5-10s, subsequent runs are instant.'
                                                        : 'Running neural inference on your device hardware (WASM SIMD).'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {resultUrl && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 font-medium">
                                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                                            <span>Background removed successfully with alpha channel!</span>
                                        </div>

                                        <button
                                            onClick={download}
                                            className="w-full btn btn-primary text-lg py-4 flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25"
                                        >
                                            <Download className="w-5 h-5" /> Download Transparent PNG
                                        </button>
                                        <p className="text-xs text-center text-gray-500">
                                            High resolution • 100% Free • No watermarks
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right side: Previews */}
                    <div className="space-y-6">
                        <div className="card h-[420px] sm:h-[520px] flex flex-col relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl">
                            {(!sourceUrl && !resultUrl) && <div className="absolute inset-0 bg-white dark:bg-gray-900 z-0" />}

                            <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                                {resultUrl ? (
                                    <img
                                        src={resultUrl}
                                        alt="Result"
                                        className="max-w-full max-h-full object-contain filter drop-shadow-2xl animate-fade-in"
                                    />
                                ) : sourceUrl ? (
                                    <img
                                        src={sourceUrl}
                                        alt="Source"
                                        className={`max-w-full max-h-full object-contain transition-all duration-500 ${isProcessing ? 'blur-sm scale-105 opacity-60' : ''}`}
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-30 text-purple-400" />
                                        <p className="text-lg font-medium text-gray-400">Upload an image to preview</p>
                                        <p className="text-xs text-gray-500 mt-1">Automatic subject matting</p>
                                    </div>
                                )}
                            </div>

                            {isProcessing && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <div className="bg-white dark:bg-gray-900 px-6 py-3.5 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 font-semibold text-primary flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>AI Segmentation In Progress...</span>
                                    </div>
                                </div>
                            )}

                            {resultUrl && (
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="px-3.5 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 shadow-lg">
                                        Transparent Alpha PNG
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
