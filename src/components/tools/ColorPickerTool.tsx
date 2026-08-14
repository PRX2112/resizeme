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
    Sparkles,
    Layers
} from 'lucide-react';

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
        reset
    } = useColorPicker();

    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const loupeCanvasRef = useRef<HTMLCanvasElement>(null);

    // Magnifying Loupe tracking state
    const [mousePos, setMousePos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    // Copy with visual toast feedback
    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        setTimeout(() => {
            setCopiedFormat(null);
        }, 2000);
    };

    // Draw main display canvas
    useEffect(() => {
        const canvas = displayCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && image) {
            canvas.width = image.naturalWidth || image.width;
            canvas.height = image.naturalHeight || image.height;
            ctx.drawImage(image, 0, 0);
        }
    }, [image]);

    // Handle mouse move & draw magnifying loupe
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!image || !displayCanvasRef.current) return;

        const rect = displayCanvasRef.current.getBoundingClientRect();
        const scaleX = (image.naturalWidth || image.width) / rect.width;
        const scaleY = (image.naturalHeight || image.height) / rect.height;

        const imgX = (e.clientX - rect.left) * scaleX;
        const imgY = (e.clientY - rect.top) * scaleY;

        // Container-relative mouse position for loupe positioning
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            visible: true
        });

        // Query color
        pickColor(imgX, imgY, false);

        // Draw 10x magnified loupe
        if (loupeCanvasRef.current && canvasRef.current) {
            const loupe = loupeCanvasRef.current;
            const lCtx = loupe.getContext('2d');
            if (lCtx) {
                lCtx.imageSmoothingEnabled = false;
                loupe.width = 120;
                loupe.height = 120;
                lCtx.clearRect(0, 0, 120, 120);

                // Sample 12x12 source area around mouse
                const sampleRadius = 6;
                const sx = Math.max(0, imgX - sampleRadius);
                const sy = Math.max(0, imgY - sampleRadius);

                lCtx.drawImage(
                    canvasRef.current,
                    sx, sy, sampleRadius * 2, sampleRadius * 2,
                    0, 0, 120, 120
                );

                // Draw center crosshair target
                lCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                lCtx.lineWidth = 1.5;
                lCtx.strokeRect(55, 55, 10, 10);
                lCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                lCtx.strokeRect(54, 54, 12, 12);
            }
        }
    }, [image, pickColor, canvasRef]);

    const handleMouseLeave = () => {
        setMousePos(prev => ({ ...prev, visible: false }));
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
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-cyan-950/20 dark:via-teal-950/20 dark:to-emerald-950/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {title || (
                            <>Color <span className="gradient-text">Picker & Inspector</span></>
                        )}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Extract exact pixel colors in HEX, RGB, HSL, and CMYK with 10× magnifying loupe
                    </p>
                </div>

                {!image ? (
                    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
                        <FileUpload
                            onFileSelect={loadFile}
                            accept="image/*"
                        />

                        {hasNativeEyeDropper && (
                            <div className="text-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">— OR USE SYSTEM PIPETTE —</span>
                                <button
                                    onClick={openNativeEyeDropper}
                                    className="btn btn-secondary inline-flex items-center gap-2 py-3 px-6 shadow-md hover:border-primary"
                                >
                                    <Pipette className="w-5 h-5 text-primary" />
                                    <span>Pick Color From Anywhere On Screen (Native EyeDropper)</span>
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Hidden Source Canvas for Logical Reads */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Left: Interactive Image Area with Magnifying Loupe */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="card relative p-0 bg-gray-900 flex items-center justify-center overflow-hidden min-h-[520px] rounded-2xl border border-gray-800 shadow-2xl">
                                <canvas
                                    ref={displayCanvasRef}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={handleClick}
                                    className="max-w-full max-h-[620px] object-contain cursor-crosshair"
                                />

                                {/* Interactive 10x Magnifying Loupe */}
                                {mousePos.visible && (
                                    <div
                                        className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-2xl overflow-hidden bg-gray-900 ring-4 ring-black/40"
                                        style={{
                                            left: `${mousePos.x}px`,
                                            top: `${mousePos.y}px`,
                                            width: '120px',
                                            height: '120px'
                                        }}
                                    >
                                        <canvas
                                            ref={loupeCanvasRef}
                                            width={120}
                                            height={120}
                                            className="w-full h-full"
                                        />
                                        <div
                                            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold"
                                        >
                                            {hoverColor?.hex || ''}
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    {hasNativeEyeDropper && (
                                        <button
                                            onClick={openNativeEyeDropper}
                                            className="btn btn-secondary shadow-lg py-2 px-3 text-xs flex items-center gap-1.5 bg-gray-800/90 text-white hover:bg-gray-700 border-gray-700"
                                            title="Pick from full screen"
                                        >
                                            <Pipette className="w-3.5 h-3.5 text-primary" />
                                            <span>Screen Eyedropper</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={reset}
                                        className="btn btn-secondary shadow-lg py-2 px-3 text-xs flex items-center gap-1.5 bg-gray-800/90 text-white hover:bg-gray-700 border-gray-700"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="absolute bottom-3 left-4 pointer-events-none bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-gray-300 flex items-center gap-2">
                                    <Eye className="w-3.5 h-3.5 text-primary" />
                                    <span>Hover to inspect • Click to lock color</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Color Inspector Panel */}
                        <div className="space-y-6">
                            {/* Color Preview Swatch Card */}
                            <div className="card space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Pipette className="w-5 h-5 text-primary" />
                                        <span>{selectedColor ? 'Locked Color' : 'Inspected Color'}</span>
                                    </h3>
                                    {selectedColor && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                            Locked
                                        </span>
                                    )}
                                </div>

                                {/* Swatch Box */}
                                <div className="relative group">
                                    <div
                                        className="w-full h-24 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 transition-colors duration-100 flex items-end justify-between p-3"
                                        style={{ backgroundColor: activeColor?.hex || '#ffffff' }}
                                    >
                                        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-white font-mono text-xs font-bold shadow">
                                            {activeColor?.hex || '#FFFFFF'}
                                        </span>
                                        <button
                                            onClick={() => activeColor && copyToClipboard(activeColor.hex, 'HEX')}
                                            className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-medium shadow hover:scale-105 transition-transform flex items-center gap-1"
                                        >
                                            {copiedFormat === 'HEX' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            <span>Copy HEX</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Color Values List */}
                                <div className="space-y-3">
                                    {/* HEX */}
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">HEX Code</span>
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{activeColor?.hex || '-'}</span>
                                        </div>
                                        <button
                                            onClick={() => activeColor && copyToClipboard(activeColor.hex, 'HEX')}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-primary transition-colors"
                                            title="Copy HEX"
                                        >
                                            {copiedFormat === 'HEX' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* RGB */}
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">RGB Values</span>
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                                {activeColor ? `rgb(${activeColor.rgb.r}, ${activeColor.rgb.g}, ${activeColor.rgb.b})` : '-'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => activeColor && copyToClipboard(`rgb(${activeColor.rgb.r}, ${activeColor.rgb.g}, ${activeColor.rgb.b})`, 'RGB')}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-primary transition-colors"
                                            title="Copy RGB"
                                        >
                                            {copiedFormat === 'RGB' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* HSL */}
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">HSL Values</span>
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                                {activeColor ? `hsl(${activeColor.hsl.h}, ${activeColor.hsl.s}%, ${activeColor.hsl.l}%)` : '-'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => activeColor && copyToClipboard(`hsl(${activeColor.hsl.h}, ${activeColor.hsl.s}%, ${activeColor.hsl.l}%)`, 'HSL')}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-primary transition-colors"
                                            title="Copy HSL"
                                        >
                                            {copiedFormat === 'HSL' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* CMYK */}
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">CMYK (Print)</span>
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                                {activeColor?.cmyk ? `cmyk(${activeColor.cmyk.c}%, ${activeColor.cmyk.m}%, ${activeColor.cmyk.y}%, ${activeColor.cmyk.k}%)` : '-'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => activeColor?.cmyk && copyToClipboard(`cmyk(${activeColor.cmyk.c}%, ${activeColor.cmyk.m}%, ${activeColor.cmyk.y}%, ${activeColor.cmyk.k}%)`, 'CMYK')}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-primary transition-colors"
                                            title="Copy CMYK"
                                        >
                                            {copiedFormat === 'CMYK' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Color History Swatches */}
                            {colorHistory.length > 0 && (
                                <div className="card space-y-3">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Droplets className="w-4 h-4 text-primary" />
                                        <span>Color History ({colorHistory.length})</span>
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {colorHistory.map((hex, i) => (
                                            <button
                                                key={`${hex}-${i}`}
                                                onClick={() => pickColorFromHex(hex)}
                                                className="w-full aspect-square rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-110 active:scale-95 transition-transform relative group focus:ring-2 focus:ring-primary"
                                                style={{ backgroundColor: hex }}
                                                title={`Select ${hex}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
