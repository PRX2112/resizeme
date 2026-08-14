'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useColorPicker } from '@/hooks/useColorPicker';
import FileUpload from '@/components/FileUpload';
import {
    RotateCcw,
    Pipette,
    Copy,
    Check,
    Droplets,
    Eye,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface ColorPickerToolProps {
    title?: string;
}

export default function ColorPickerTool({ title }: ColorPickerToolProps) {
    const {
        image,
        canvasRef,
        hoverColor,
        selectedColor,
        colorHistory,
        hasNativeEyeDropper,
        openNativeEyeDropper,
        error,
        loadFile,
        pickColor,
        pickColorFromHex,
        reset,
    } = useColorPicker();

    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const loupeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        setTimeout(() => {
            setCopiedFormat(null);
        }, 2000);
    };

    useEffect(() => {
        const canvas = displayCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && image) {
            canvas.width = image.naturalWidth || image.width;
            canvas.height = image.naturalHeight || image.height;
            ctx.drawImage(image, 0, 0);
        }
    }, [image]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!image || !displayCanvasRef.current) return;

        const rect = displayCanvasRef.current.getBoundingClientRect();
        const scaleX = (image.naturalWidth || image.width) / rect.width;
        const scaleY = (image.naturalHeight || image.height) / rect.height;

        const imgX = (e.clientX - rect.left) * scaleX;
        const imgY = (e.clientY - rect.top) * scaleY;

        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            visible: true,
        });

        pickColor(imgX, imgY, false);

        if (loupeCanvasRef.current && canvasRef.current) {
            const loupe = loupeCanvasRef.current;
            const lCtx = loupe.getContext('2d');
            if (lCtx) {
                lCtx.imageSmoothingEnabled = false;
                loupe.width = 120;
                loupe.height = 120;
                lCtx.clearRect(0, 0, 120, 120);

                const sampleRadius = 6;
                const sx = Math.max(0, imgX - sampleRadius);
                const sy = Math.max(0, imgY - sampleRadius);

                lCtx.drawImage(
                    canvasRef.current,
                    sx, sy, sampleRadius * 2, sampleRadius * 2,
                    0, 0, 120, 120
                );

                lCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                lCtx.lineWidth = 1.5;
                lCtx.strokeRect(55, 55, 10, 10);
                lCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                lCtx.strokeRect(54, 54, 12, 12);
            }
        }
    }, [image, pickColor, canvasRef]);

    const handleMouseLeave = () => {
        setMousePos((prev) => ({ ...prev, visible: false }));
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!image || !displayCanvasRef.current) return;

        const rect = displayCanvasRef.current.getBoundingClientRect();
        const scaleX = (image.naturalWidth || image.width) / rect.width;
        const scaleY = (image.naturalHeight || image.height) / rect.height;

        const imgX = (e.clientX - rect.left) * scaleX;
        const imgY = (e.clientY - rect.top) * scaleY;

        pickColor(imgX, imgY, true);
    };

    const activeColor = selectedColor || hoverColor;

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Color Picker & Inspector'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Extract exact pixel colors in HEX, RGB, HSL, and CMYK with a 10× magnifying loupe.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Interactive Canvas & Loupe Viewport (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        {!image ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
                                <FileUpload
                                    onFileSelect={loadFile}
                                    accept="image/*"
                                />

                                {hasNativeEyeDropper && (
                                    <div className="text-center pt-2">
                                        <button
                                            onClick={openNativeEyeDropper}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold hover:bg-blue-100 transition-colors"
                                        >
                                            <Pipette className="w-4 h-4" />
                                            <span>Pick Color From Anywhere On Screen (Native EyeDropper)</span>
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-4">
                                <canvas ref={canvasRef} className="hidden" />

                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Hover to inspect pixels • Click to lock color</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {hasNativeEyeDropper && (
                                            <button
                                                onClick={openNativeEyeDropper}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg text-gray-700 dark:text-gray-300"
                                            >
                                                <Pipette className="w-3 h-3 text-blue-600" />
                                                <span>Pipette</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={reset}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Reset</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center p-4 min-h-[380px] max-h-[540px]">
                                    <canvas
                                        ref={displayCanvasRef}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={handleClick}
                                        className="max-w-full max-h-[500px] object-contain cursor-crosshair"
                                    />

                                    {/* 10x Magnifying Loupe */}
                                    {mousePos.visible && (
                                        <div
                                            className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-2xl overflow-hidden bg-gray-900 ring-4 ring-black/40"
                                            style={{
                                                left: `${mousePos.x}px`,
                                                top: `${mousePos.y}px`,
                                                width: '120px',
                                                height: '120px',
                                            }}
                                        >
                                            <canvas ref={loupeCanvasRef} width={120} height={120} className="w-full h-full" />
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                                                {hoverColor?.hex || ''}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Controls Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!image ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Color Preview Swatch */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {selectedColor ? 'Locked Pixel' : 'Hover Pixel'}
                                    </span>
                                    {selectedColor && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                            Locked
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="w-full h-20 rounded-xl border border-gray-200 dark:border-gray-700 flex items-end justify-between p-3 shadow-inner"
                                    style={{ backgroundColor: activeColor?.hex || '#ffffff' }}
                                >
                                    <span className="px-2 py-0.5 rounded bg-black/75 text-white font-mono text-xs font-bold">
                                        {activeColor?.hex || '#FFFFFF'}
                                    </span>
                                    <button
                                        onClick={() => activeColor && copyToClipboard(activeColor.hex, 'HEX')}
                                        className="px-2 py-1 rounded bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-semibold shadow hover:scale-105 transition-transform flex items-center gap-1"
                                    >
                                        {copiedFormat === 'HEX' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                        <span>Copy HEX</span>
                                    </button>
                                </div>
                            </div>

                            {/* Color Codes List */}
                            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                {/* HEX */}
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">HEX</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">{activeColor?.hex || '-'}</span>
                                    </div>
                                    <button
                                        onClick={() => activeColor && copyToClipboard(activeColor.hex, 'HEX')}
                                        className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                        {copiedFormat === 'HEX' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                {/* RGB */}
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">RGB</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            {activeColor ? `rgb(${activeColor.rgb.r}, ${activeColor.rgb.g}, ${activeColor.rgb.b})` : '-'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => activeColor && copyToClipboard(`rgb(${activeColor.rgb.r}, ${activeColor.rgb.g}, ${activeColor.rgb.b})`, 'RGB')}
                                        className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                        {copiedFormat === 'RGB' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                {/* HSL */}
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">HSL</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            {activeColor ? `hsl(${activeColor.hsl.h}, ${activeColor.hsl.s}%, ${activeColor.hsl.l}%)` : '-'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => activeColor && copyToClipboard(`hsl(${activeColor.hsl.h}, ${activeColor.hsl.s}%, ${activeColor.hsl.l}%)`, 'HSL')}
                                        className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                        {copiedFormat === 'HSL' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                {/* CMYK */}
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">CMYK</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            {activeColor?.cmyk ? `cmyk(${activeColor.cmyk.c}%, ${activeColor.cmyk.m}%, ${activeColor.cmyk.y}%, ${activeColor.cmyk.k}%)` : '-'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => activeColor?.cmyk && copyToClipboard(`cmyk(${activeColor.cmyk.c}%, ${activeColor.cmyk.m}%, ${activeColor.cmyk.y}%, ${activeColor.cmyk.k}%)`, 'CMYK')}
                                        className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                        {copiedFormat === 'CMYK' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Color History Swatches */}
                            {colorHistory.length > 0 && (
                                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Sampled Swatches</span>
                                    </div>
                                    <div className="grid grid-cols-6 gap-1.5">
                                        {colorHistory.map((hex, i) => (
                                            <button
                                                key={`${hex}-${i}`}
                                                onClick={() => pickColorFromHex(hex)}
                                                className="w-full aspect-square rounded-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: hex }}
                                                title={hex}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="color-picker" />

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
