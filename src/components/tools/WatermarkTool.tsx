'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, Trash2, Type, Image as ImageIcon, Move, Grid, Sparkles } from 'lucide-react';
import { downloadFile } from '@/utils/imageUtils';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

const POSITIONS: { label: string; value: Position }[] = [
    { label: '↖ Top Left', value: 'top-left' },
    { label: '↑ Top Center', value: 'top-center' },
    { label: '↗ Top Right', value: 'top-right' },
    { label: '• Center', value: 'center' },
    { label: '↙ Bottom Left', value: 'bottom-left' },
    { label: '↓ Bottom Center', value: 'bottom-center' },
    { label: '↘ Bottom Right', value: 'bottom-right' },
    { label: '⊞ Tile Grid', value: 'tile' },
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
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
                // Font size computed proportionally relative to shortest image edge
                const baseScale = Math.min(W, H) * 0.05;
                const actualFontSize = Math.max(14, Math.round(baseScale * (fontSize / 50)));

                ctx.font = `bold ${actualFontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                ctx.fillStyle = fontColor;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.shadowBlur = Math.max(2, Math.round(actualFontSize * 0.1));
                ctx.shadowOffsetX = Math.max(1, Math.round(actualFontSize * 0.05));
                ctx.shadowOffsetY = Math.max(1, Math.round(actualFontSize * 0.05));

                if (position === 'tile') {
                    // Tile grid pattern across the canvas at 45 degree angle
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

                ctx.globalAlpha = 1.0;
                ctx.shadowColor = 'transparent';

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setResultBlob(blob);
                        setResultUrl(url);
                    }
                    setIsRendering(false);
                }, 'image/png');

            } else if (watermarkImageSrc) {
                const wm = new Image();
                wm.onload = () => {
                    const wmW = Math.max(20, (watermarkSize / 100) * W);
                    const wmH = (wmW / wm.naturalWidth) * wm.naturalHeight;

                    if (position === 'tile') {
                        const stepX = wmW * 2;
                        const stepY = wmH * 2.2;

                        for (let y = 0; y < H + stepY; y += stepY) {
                            for (let x = 0; x < W + stepX; x += stepX) {
                                ctx.drawImage(wm, x, y, wmW, wmH);
                            }
                        }
                    } else {
                        const { normX, normY, align, baseline } = getNormalizedCoords(position);
                        let px = normX * W;
                        let py = normY * H;

                        if (align === 'right') px -= wmW;
                        else if (align === 'center') px -= wmW / 2;

                        if (baseline === 'bottom') py -= wmH;
                        else if (baseline === 'middle') py -= wmH / 2;

                        ctx.drawImage(wm, Math.round(px), Math.round(py), Math.round(wmW), Math.round(wmH));
                    }

                    ctx.globalAlpha = 1.0;

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            setResultBlob(blob);
                            setResultUrl(url);
                        }
                        setIsRendering(false);
                    }, 'image/png');
                };
                wm.src = watermarkImageSrc;
            } else {
                setIsRendering(false);
            }
        };

        img.src = sourceImage;
    }, [sourceImage, watermarkType, text, fontSize, fontColor, opacity, position, margin, watermarkImageSrc, watermarkSize]);

    useEffect(() => {
        if (sourceImage) {
            renderWatermark();
        }
    }, [sourceImage, renderWatermark]);

    const download = () => {
        if (!resultUrl) return;
        const ext = sourceName ? sourceName.split('.').pop() || 'png' : 'png';
        const baseName = sourceName ? sourceName.substring(0, sourceName.lastIndexOf('.')) || 'image' : 'image';
        const filename = `${baseName}_watermarked.${ext}`;
        downloadFile(resultUrl, filename);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
            <canvas ref={canvasRef} className="hidden" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Add <span className="gradient-text">Watermark</span> to Image
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Protect your photos with customizable text or image watermarks. Zero drift, 100% in-browser.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Upload Main Image */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-primary" /> 1. Upload Source Photo
                            </h3>
                            <label className="block w-full cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary transition-colors">
                                    {sourceName ? (
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">✅ {sourceName}</p>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleMainUpload} />
                            </label>
                        </div>

                        {/* Watermark Type */}
                        <div className="card space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Type className="w-4 h-4 text-primary" /> 2. Watermark Settings
                            </h3>
                            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                {(['text', 'image'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setWatermarkType(t)}
                                        className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                                            watermarkType === t ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {t === 'text' ? '📝 Text Watermark' : '🖼️ Image Logo'}
                                    </button>
                                ))}
                            </div>

                            {watermarkType === 'text' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Watermark Text</label>
                                        <input
                                            value={text}
                                            onChange={e => setText(e.target.value)}
                                            placeholder="e.g. © YourBrand / Photographer"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scale: {fontSize}%</label>
                                            <input
                                                type="range"
                                                min={20}
                                                max={150}
                                                value={fontSize}
                                                onChange={e => setFontSize(+e.target.value)}
                                                className="w-full accent-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={fontColor}
                                                    onChange={e => setFontColor(e.target.value)}
                                                    className="w-10 h-8 rounded border border-gray-200 dark:border-gray-700 cursor-pointer"
                                                />
                                                <span className="text-xs font-mono text-gray-500">{fontColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo / Badge Image</label>
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary transition-colors">
                                            <p className="text-sm text-gray-500">{watermarkImageSrc ? '✅ Logo loaded' : 'Upload PNG with transparency'}</p>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleWatermarkImageUpload} />
                                    </label>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Width: {watermarkSize}%</label>
                                        <input
                                            type="range"
                                            min={5}
                                            max={80}
                                            value={watermarkSize}
                                            onChange={e => setWatermarkSize(+e.target.value)}
                                            className="w-full accent-primary"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opacity: {opacity}%</label>
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        value={opacity}
                                        onChange={e => setOpacity(+e.target.value)}
                                        className="w-full accent-primary"
                                    />
                                </div>
                                {position !== 'tile' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Margin: {margin}%</label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={15}
                                            value={margin}
                                            onChange={e => setMargin(+e.target.value)}
                                            className="w-full accent-primary"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Position Grid */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                    <Move className="w-3 h-3 text-primary" /> Placement Position
                                </label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {POSITIONS.map(p => (
                                        <button
                                            key={p.value}
                                            onClick={() => setPosition(p.value)}
                                            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                                                position === p.value
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-3">
                                <button
                                    onClick={renderWatermark}
                                    disabled={!sourceImage || isRendering}
                                    className="flex-1 btn btn-primary text-sm py-2.5 shadow-md shadow-blue-500/20"
                                >
                                    {isRendering ? 'Applying...' : 'Re-apply Watermark'}
                                </button>
                                {resultUrl && (
                                    <button
                                        onClick={() => {
                                            setSourceImage(null);
                                            setResultUrl(null);
                                            setSourceName('');
                                        }}
                                        className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Clear"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview & Download */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="card min-h-[500px] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 overflow-hidden">
                            {resultUrl ? (
                                <img
                                    src={resultUrl}
                                    alt="Watermarked preview"
                                    className="max-w-full max-h-[600px] rounded-xl shadow-2xl object-contain animate-fade-in"
                                />
                            ) : sourceImage ? (
                                <img
                                    src={sourceImage}
                                    alt="Source preview"
                                    className="max-w-full max-h-[600px] rounded-xl shadow-xl object-contain opacity-60"
                                />
                            ) : (
                                <div className="text-center text-gray-400 py-12">
                                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30 text-primary" />
                                    <p className="text-lg font-medium text-gray-300">Upload a photo to preview watermark</p>
                                    <p className="text-sm text-gray-500 mt-1">High-resolution preview with zero coordinate drift</p>
                                </div>
                            )}
                        </div>

                        {resultUrl && (
                            <button
                                onClick={download}
                                className="w-full btn btn-primary flex items-center justify-center gap-2 py-4 text-base shadow-xl shadow-blue-500/25"
                            >
                                <Download className="w-5 h-5" />
                                <span>Download High-Resolution Watermarked Image</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
