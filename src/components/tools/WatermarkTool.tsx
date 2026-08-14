'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, Trash2, Type, Image as ImageIcon, Move, Grid, Sparkles, RotateCcw } from 'lucide-react';
import { downloadFile } from '@/utils/imageUtils';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

const POSITIONS: { label: string; value: Position }[] = [
    { label: '↖ Top L', value: 'top-left' },
    { label: '↑ Top C', value: 'top-center' },
    { label: '↗ Top R', value: 'top-right' },
    { label: '• Center', value: 'center' },
    { label: '↙ Btm L', value: 'bottom-left' },
    { label: '↓ Btm C', value: 'bottom-center' },
    { label: '↘ Btm R', value: 'bottom-right' },
    { label: '⊞ Tile', value: 'tile' },
];

export default function WatermarkTool() {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [sourceName, setSourceName] = useState('');
    const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
    const [text, setText] = useState('© ResizeMe');
    const [fontSize, setFontSize] = useState(50); // % scale
    const [fontColor, setFontColor] = useState('#ffffff');
    const [opacity, setOpacity] = useState(80);
    const [position, setPosition] = useState<Position>('bottom-right');
    const [margin, setMargin] = useState(4); // % margin from edge
    const [watermarkImageSrc, setWatermarkImageSrc] = useState<string | null>(null);
    const [watermarkSize, setWatermarkSize] = useState(25); // % of image width
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    const handleMainUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSourceName(file.name);
        const reader = new FileReader();
        reader.onload = ev => {
            setSourceImage(ev.target?.result as string);
            setResultUrl(null);
        };
        reader.readAsDataURL(file);
    };

    const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setWatermarkImageSrc(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const renderWatermark = useCallback(() => {
        if (!sourceImage) return;

        setIsRendering(true);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsRendering(false);
                return;
            }

            // Draw base image at 100% full natural resolution
            ctx.drawImage(img, 0, 0);

            const W = img.naturalWidth;
            const H = img.naturalHeight;
            const normMargin = Math.max(0.01, margin / 100);
            const alpha = Math.max(0.05, Math.min(1.0, opacity / 100));

            // Helper to get normalized anchors and alignments
            const getNormalizedCoords = (pos: Position) => {
                switch (pos) {
                    case 'top-left':
                        return { normX: normMargin, normY: normMargin, align: 'left' as CanvasTextAlign, baseline: 'top' as CanvasTextBaseline };
                    case 'top-center':
                        return { normX: 0.5, normY: normMargin, align: 'center' as CanvasTextAlign, baseline: 'top' as CanvasTextBaseline };
                    case 'top-right':
                        return { normX: 1 - normMargin, normY: normMargin, align: 'right' as CanvasTextAlign, baseline: 'top' as CanvasTextBaseline };
                    case 'center':
                        return { normX: 0.5, normY: 0.5, align: 'center' as CanvasTextAlign, baseline: 'middle' as CanvasTextBaseline };
                    case 'bottom-left':
                        return { normX: normMargin, normY: 1 - normMargin, align: 'left' as CanvasTextAlign, baseline: 'bottom' as CanvasTextBaseline };
                    case 'bottom-center':
                        return { normX: 0.5, normY: 1 - normMargin, align: 'center' as CanvasTextAlign, baseline: 'bottom' as CanvasTextBaseline };
                    case 'bottom-right':
                    default:
                        return { normX: 1 - normMargin, normY: 1 - normMargin, align: 'right' as CanvasTextAlign, baseline: 'bottom' as CanvasTextBaseline };
                }
            };

            ctx.globalAlpha = alpha;

            if (watermarkType === 'text') {
                const baseScale = Math.min(W, H) * 0.05;
                const actualFontSize = Math.max(14, Math.round(baseScale * (fontSize / 50)));

                ctx.font = `bold ${actualFontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                ctx.fillStyle = fontColor;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.shadowBlur = Math.max(2, Math.round(actualFontSize * 0.1));
                ctx.shadowOffsetX = Math.max(1, Math.round(actualFontSize * 0.05));
                ctx.shadowOffsetY = Math.max(1, Math.round(actualFontSize * 0.05));

                if (position === 'tile') {
                    const textMetrics = ctx.measureText(text);
                    const stepX = Math.max(200, textMetrics.width + 120);
                    const stepY = Math.max(120, actualFontSize * 4);

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    for (let y = -H; y < H * 2; y += stepY) {
                        for (let x = -W; x < W * 2; x += stepX) {
                            ctx.save();
                            ctx.translate(x, y);
                            ctx.rotate((-30 * Math.PI) / 180);
                            ctx.fillText(text, 0, 0);
                            ctx.restore();
                        }
                    }
                    ctx.restore();
                } else {
                    const { normX, normY, align, baseline } = getNormalizedCoords(position);
                    ctx.textAlign = align;
                    ctx.textBaseline = baseline;
                    const px = normX * W;
                    const py = normY * H;
                    ctx.fillText(text, px, py);
                }

                canvas.toBlob(blob => {
                    if (blob) {
                        if (resultUrl) URL.revokeObjectURL(resultUrl);
                        setResultUrl(URL.createObjectURL(blob));
                    }
                    setIsRendering(false);
                }, 'image/png');
            } else if (watermarkType === 'image' && watermarkImageSrc) {
                const wmImg = new Image();
                wmImg.onload = () => {
                    const targetWidth = Math.round(W * (watermarkSize / 100));
                    const targetHeight = Math.round(targetWidth * (wmImg.naturalHeight / wmImg.naturalWidth));

                    if (position === 'tile') {
                        const stepX = targetWidth + 100;
                        const stepY = targetHeight + 100;

                        ctx.save();
                        for (let y = -H; y < H * 2; y += stepY) {
                            for (let x = -W; x < W * 2; x += stepX) {
                                ctx.save();
                                ctx.translate(x, y);
                                ctx.rotate((-25 * Math.PI) / 180);
                                ctx.drawImage(wmImg, 0, 0, targetWidth, targetHeight);
                                ctx.restore();
                            }
                        }
                        ctx.restore();
                    } else {
                        const { normX, normY } = getNormalizedCoords(position);
                        let px = normX * W;
                        let py = normY * H;

                        if (position.includes('center')) px -= targetWidth / 2;
                        else if (position.includes('right')) px -= targetWidth;

                        if (position.includes('bottom')) py -= targetHeight;
                        else if (position === 'center') py -= targetHeight / 2;

                        ctx.drawImage(wmImg, px, py, targetWidth, targetHeight);
                    }

                    canvas.toBlob(blob => {
                        if (blob) {
                            if (resultUrl) URL.revokeObjectURL(resultUrl);
                            setResultUrl(URL.createObjectURL(blob));
                        }
                        setIsRendering(false);
                    }, 'image/png');
                };
                wmImg.src = watermarkImageSrc;
            } else {
                canvas.toBlob(blob => {
                    if (blob) {
                        if (resultUrl) URL.revokeObjectURL(resultUrl);
                        setResultUrl(URL.createObjectURL(blob));
                    }
                    setIsRendering(false);
                }, 'image/png');
            }
        };

        img.src = sourceImage;
    }, [sourceImage, watermarkType, text, fontSize, fontColor, opacity, position, margin, watermarkImageSrc, watermarkSize, resultUrl]);

    useEffect(() => {
        if (sourceImage) {
            renderWatermark();
        }
    }, [sourceImage, renderWatermark]);

    const download = () => {
        if (!resultUrl) return;
        const ext = sourceName ? sourceName.split('.').pop() || 'png' : 'png';
        const baseName = sourceName ? sourceName.substring(0, sourceName.lastIndexOf('.')) || 'image' : 'image';
        downloadFile(resultUrl, `${baseName}_watermarked.${ext}`);
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <canvas ref={canvasRef} className="hidden" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Watermark Photo
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Add text watermarks or logo PNG overlays with normalized coordinates and 45° tile grids.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Canvas Preview (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        {!sourceImage ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                <label className="block w-full cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-colors">
                                        <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Click or Drag & Drop Photo to Watermark
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP, AVIF up to 50MB</p>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleMainUpload} />
                                </label>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">File:</span>{' '}
                                        {sourceName}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSourceImage(null);
                                            setResultUrl(null);
                                            setSourceName('');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center p-4 min-h-[380px] max-h-[540px]">
                                    {resultUrl ? (
                                        <img
                                            src={resultUrl}
                                            alt="Watermarked preview"
                                            className="max-w-full max-h-[500px] object-contain shadow-2xl rounded-lg"
                                        />
                                    ) : (
                                        <img
                                            src={sourceImage}
                                            alt="Source preview"
                                            className="max-w-full max-h-[500px] object-contain opacity-60 rounded-lg"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Controls Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!sourceImage ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Watermark Type */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Watermark Type
                                </span>
                                <div className="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                    {(['text', 'image'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setWatermarkType(t)}
                                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                watermarkType === t
                                                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                            }`}
                                        >
                                            {t === 'text' ? 'Text Stamp' : 'Logo Overlay'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Text Controls */}
                            {watermarkType === 'text' ? (
                                <div className="space-y-3 pt-2">
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                            Watermark Text
                                        </label>
                                        <input
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="© Your Brand / Photographer"
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <div>
                                            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                                <span>Scale</span>
                                                <span className="font-bold">{fontSize}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={20}
                                                max={150}
                                                value={fontSize}
                                                onChange={(e) => setFontSize(+e.target.value)}
                                                className="w-full h-1.5 accent-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] text-gray-500 mb-1">Color</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={fontColor}
                                                    onChange={(e) => setFontColor(e.target.value)}
                                                    className="w-8 h-7 rounded border border-gray-200 dark:border-gray-700 cursor-pointer p-0"
                                                />
                                                <span className="text-[11px] font-mono text-gray-500">{fontColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-2">
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center hover:border-blue-500">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {watermarkImageSrc ? '✅ Logo Image Loaded' : 'Upload PNG Logo with transparency'}
                                            </p>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleWatermarkImageUpload} />
                                    </label>
                                    <div>
                                        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                            <span>Logo Width</span>
                                            <span className="font-bold">{watermarkSize}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={5}
                                            max={80}
                                            value={watermarkSize}
                                            onChange={(e) => setWatermarkSize(+e.target.value)}
                                            className="w-full h-1.5 accent-blue-600"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Opacity & Placement */}
                            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between text-[11px] text-gray-500">
                                    <span>Opacity</span>
                                    <span className="font-bold">{opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={10}
                                    max={100}
                                    value={opacity}
                                    onChange={(e) => setOpacity(+e.target.value)}
                                    className="w-full h-1.5 accent-blue-600"
                                />

                                <div>
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                                        Placement Anchor
                                    </span>
                                    <div className="grid grid-cols-4 gap-1">
                                        {POSITIONS.map((p) => (
                                            <button
                                                key={p.value}
                                                onClick={() => setPosition(p.value)}
                                                className={`py-1.5 px-1 text-[11px] font-medium rounded-lg border transition-all truncate ${
                                                    position === p.value
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2">
                                <button
                                    onClick={download}
                                    disabled={!resultUrl}
                                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Watermarked Photo</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="watermark" />

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
