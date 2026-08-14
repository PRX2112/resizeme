'use client';

import { useRef, useState } from 'react';
import { useMemeGenerator } from '@/hooks/useMemeGenerator';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import FileUpload from '@/components/FileUpload';
import {
    Download,
    RotateCcw,
    Plus,
    Trash2,
    Palette,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

interface MemeGeneratorToolProps {
    title?: string;
}

export default function MemeGeneratorTool({ title }: MemeGeneratorToolProps) {
    const {
        originalFile,
        canvasRef,
        texts,
        selectedTextId,
        setSelectedTextId,
        error,
        loadFile,
        addText,
        updateText,
        removeText,
        downloadMeme,
        reset,
    } = useMemeGenerator();

    const { limits, trackDownload } = useUsageTracking();
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const clickedText = texts.slice().reverse().find((text) => {
            const estimatedWidth = Math.max(80, text.fontSize * 0.65 * text.content.length);
            const estimatedHeight = text.fontSize * 1.2;

            return (
                x >= text.x - estimatedWidth / 2 &&
                x <= text.x + estimatedWidth / 2 &&
                y >= text.y - estimatedHeight / 2 &&
                y <= text.y + estimatedHeight / 2
            );
        });

        if (clickedText) {
            setSelectedTextId(clickedText.id);
            isDraggingRef.current = true;
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        } else {
            setSelectedTextId(null);
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDraggingRef.current || !selectedTextId || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const dx = (e.clientX - lastMousePosRef.current.x) * scaleX;
        const dy = (e.clientY - lastMousePosRef.current.y) * scaleY;

        const text = texts.find((t) => t.id === selectedTextId);
        if (text) {
            updateText(selectedTextId, {
                x: Math.round(text.x + dx),
                y: Math.round(text.y + dy),
            });
        }

        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = false;
        try {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
        } catch {}
    };

    const handleFileSelect = async (file: File) => {
        await loadFile(file);
    };

    const handleDownload = async () => {
        downloadMeme();
        if (originalFile) {
            await trackDownload(originalFile.size, 'Meme Generator', originalFile.name);
        }
    };

    const selectedText = texts.find((t) => t.id === selectedTextId);

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Meme Generator'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Create memes with high-DPI Retina text rendering and mobile touch drag controls.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Canvas Area (lg:col-span-8) */}
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
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Interactive Canvas:</span>{' '}
                                        Drag text layers to position
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div
                                    className="relative rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center p-4 min-h-[380px] max-h-[540px]"
                                    ref={containerRef}
                                >
                                    <canvas
                                        ref={canvasRef}
                                        onPointerDown={handlePointerDown}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={handlePointerUp}
                                        onPointerCancel={handlePointerUp}
                                        style={{ touchAction: 'none' }}
                                        className="max-w-full max-h-[500px] object-contain cursor-move select-none"
                                    />

                                    <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                                        <span className="bg-black/75 text-white text-[11px] px-3 py-1 rounded-full backdrop-blur-sm">
                                            Touch & drag text to move anywhere
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Controls Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!originalFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Text Layers Manager */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Text Layers
                                    </span>
                                    <button
                                        onClick={addText}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-xs inline-flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Text</span>
                                    </button>
                                </div>

                                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                                    {texts.map((text) => (
                                        <div
                                            key={text.id}
                                            onClick={() => setSelectedTextId(text.id)}
                                            className={`p-2 rounded-lg cursor-pointer border text-xs flex justify-between items-center transition-colors ${
                                                selectedTextId === text.id
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <span className="truncate max-w-[160px]">{text.content || 'Empty layer'}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeText(text.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 p-0.5"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Layer Editor */}
                            {selectedText && (
                                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                            Text Content
                                        </label>
                                        <textarea
                                            value={selectedText.content}
                                            onChange={(e) => updateText(selectedText.id, { content: e.target.value.toUpperCase() })}
                                            className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold uppercase"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                                Font Size ({selectedText.fontSize}px)
                                            </label>
                                            <input
                                                type="number"
                                                value={selectedText.fontSize}
                                                onChange={(e) => updateText(selectedText.id, { fontSize: Number(e.target.value) })}
                                                className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold"
                                                min="12"
                                                max="180"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                                Text & Stroke
                                            </label>
                                            <div className="flex gap-1.5 items-center">
                                                <input
                                                    type="color"
                                                    value={selectedText.color}
                                                    onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                                                    className="w-8 h-7 rounded border border-gray-200 dark:border-gray-700 cursor-pointer p-0"
                                                    title="Fill color"
                                                />
                                                <input
                                                    type="color"
                                                    value={selectedText.strokeColor}
                                                    onChange={(e) => updateText(selectedText.id, { strokeColor: e.target.value })}
                                                    className="w-8 h-7 rounded border border-gray-200 dark:border-gray-700 cursor-pointer p-0"
                                                    title="Stroke outline"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleDownload}
                                disabled={!originalFile}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download High-DPI Meme</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="meme-generator" />

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
