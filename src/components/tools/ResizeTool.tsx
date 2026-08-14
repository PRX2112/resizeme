'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import { useImageResize } from '@/hooks/useImageResize';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import {
    Download,
    RotateCcw,
    Lock,
    Unlock,
    Instagram,
    Facebook,
    Twitter,
    Smartphone,
    Monitor,
    X,
    Sparkles,
    Check,
} from 'lucide-react';
import { formatFileSize, calculatePercentageSize, downloadFile } from '@/utils/imageUtils';
import { trackImageUpload, trackImageDownload, trackTimeOnTool } from '@/lib/analytics';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

const PRESET_SIZES = [
    { name: 'IG Post', width: 1080, height: 1080, icon: Instagram },
    { name: 'IG Story', width: 1080, height: 1920, icon: Instagram },
    { name: 'FB Cover', width: 820, height: 312, icon: Facebook },
    { name: 'X Header', width: 1500, height: 500, icon: Twitter },
    { name: '1080p HD', width: 1920, height: 1080, icon: Monitor },
    { name: 'Mobile', width: 750, height: 1334, icon: Smartphone },
];

const FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
];

const PERCENTAGE_PRESETS = [
    { label: '25%', value: 25 },
    { label: '50%', value: 50 },
    { label: '75%', value: 75 },
    { label: '100%', value: 100 },
    { label: '150%', value: 150 },
    { label: '200%', value: 200 },
];

interface ResizeToolProps {
    defaultFormat?: string;
    title?: string;
}

export default function ResizeTool({ defaultFormat = 'png', title }: ResizeToolProps) {
    const {
        originalImage,
        originalFile,
        previewUrl,
        isProcessing,
        error,
        loadImageFile,
        download,
        reset,
    } = useImageResize();

    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [quality, setQuality] = useState(95);
    const [format, setFormat] = useState(defaultFormat);
    const [isServerProcessing, setIsServerProcessing] = useState(false);

    const [startTime, setStartTime] = useState<number>(0);

    // Custom Presets State
    const [customPresets, setCustomPresets] = useState<{ name: string; width: number; height: number }[]>([]);
    const [newPresetName, setNewPresetName] = useState('');

    const { limits, trackDownload } = useUsageTracking();
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    // Load custom presets
    useEffect(() => {
        try {
            const stored = localStorage.getItem('resizeme_custom_presets');
            if (stored) {
                setCustomPresets(JSON.parse(stored));
            }
            const favFormat = localStorage.getItem('resizeme_fav_format');
            if (favFormat) {
                setFormat(favFormat);
            }
        } catch (e) {
            console.error('Failed to load local settings:', e);
        }
    }, []);

    const saveCustomPreset = () => {
        if (!newPresetName.trim() || !width || !height) return;
        const updated = [...customPresets, { name: newPresetName.trim(), width, height }];
        setCustomPresets(updated);
        setNewPresetName('');
        try {
            localStorage.setItem('resizeme_custom_presets', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save preset:', e);
        }
    };

    const deleteCustomPreset = (index: number) => {
        const updated = customPresets.filter((_, i) => i !== index);
        setCustomPresets(updated);
        try {
            localStorage.setItem('resizeme_custom_presets', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to delete preset:', e);
        }
    };

    const handleFormatChange = (newFormat: string) => {
        setFormat(newFormat);
        try {
            localStorage.setItem('resizeme_fav_format', newFormat);
        } catch (e) {
            console.error('Failed to save favorite format:', e);
        }
    };

    useEffect(() => {
        if (originalImage) {
            setWidth(originalImage.width);
            setHeight(originalImage.height);
        }
    }, [originalImage]);

    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        if (maintainAspectRatio && originalImage) {
            const aspectRatio = originalImage.width / originalImage.height;
            setHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        if (maintainAspectRatio && originalImage) {
            const aspectRatio = originalImage.width / originalImage.height;
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    const handlePercentageClick = (percentage: number) => {
        if (originalImage) {
            const { width: newWidth, height: newHeight } = calculatePercentageSize(
                originalImage.width,
                originalImage.height,
                percentage
            );
            setWidth(newWidth);
            setHeight(newHeight);
        }
    };

    const handlePresetClick = (presetWidth: number, presetHeight: number) => {
        setWidth(presetWidth);
        setHeight(presetHeight);
        setMaintainAspectRatio(false);
    };

    const handleFileSelect = async (file: File) => {
        trackImageUpload('Resize Tool', file.size, file.type);
        setStartTime(Date.now());
        await loadImageFile(file);
    };

    const handleDownload = async () => {
        if (!originalFile) return;

        setIsServerProcessing(true);
        try {
            // High-speed browser canvas processing with direct blob download
            await download({
                width,
                height,
                maintainAspectRatio,
                format,
                quality: quality / 100,
            });

            if (startTime > 0) {
                const duration = Math.round((Date.now() - startTime) / 1000);
                trackTimeOnTool('Resize Tool', duration);
            }
            await trackDownload(originalFile.size, 'Resize Tool', originalFile.name);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setIsServerProcessing(false);
        }
    };

    const handleReset = () => {
        reset();
        setWidth(0);
        setHeight(0);
        setMaintainAspectRatio(true);
        setQuality(95);
        setFormat(defaultFormat);
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Image Resizer'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Resize images to exact dimensions or scale percentages with high-fidelity Lanczos3 sinc kernel.
                    </p>
                </div>

                {/* Main Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (Canvas & Preview Only) */}
                    <div className="lg:col-span-7 space-y-4">
                        {!originalFile ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    accept="image/*"
                                    maxSizeMB={limits.maxFileSize === Infinity ? Infinity : limits.maxFileSize / (1024 * 1024)}
                                />
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Original:</span>{' '}
                                        {originalImage?.width} × {originalImage?.height}px • {formatFileSize(originalFile.size)}
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                {/* Preview Viewport */}
                                <div className="relative rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center min-h-[340px] max-h-[500px]">
                                    <img
                                        src={previewUrl!}
                                        alt="Preview"
                                        className="max-w-full max-h-[480px] object-contain"
                                    />
                                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/75 text-white text-[11px] font-mono backdrop-blur-sm">
                                        Target: {width} × {height}px
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 text-center">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column (Consolidated Controls: Dimensions, Scale %, Presets, Format, Download) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!originalFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Section 1: Dimensions */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Target Dimensions
                                    </h2>
                                    <button
                                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                            maintainAspectRatio
                                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                        }`}
                                    >
                                        {maintainAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                        <span>{maintainAspectRatio ? 'Aspect Locked' : 'Unlocked'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                            Width (px)
                                        </label>
                                        <input
                                            type="number"
                                            value={width || ''}
                                            onChange={(e) => handleWidthChange(Number(e.target.value))}
                                            className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
                                            min="1"
                                            placeholder="Width"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                            Height (px)
                                        </label>
                                        <input
                                            type="number"
                                            value={height || ''}
                                            onChange={(e) => handleHeightChange(Number(e.target.value))}
                                            className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
                                            min="1"
                                            placeholder="Height"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Scale by Percentage */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Scale Percentage
                                </span>
                                <div className="grid grid-cols-6 gap-1.5">
                                    {PERCENTAGE_PRESETS.map((preset) => (
                                        <button
                                            key={preset.value}
                                            onClick={() => handlePercentageClick(preset.value)}
                                            className="py-1.5 text-xs font-semibold rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section 3: Preset Sizes */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Standard Presets
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {PRESET_SIZES.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => handlePresetClick(preset.width, preset.height)}
                                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-left transition-colors bg-gray-50/50 dark:bg-gray-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
                                        >
                                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                                {preset.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                                {preset.width}×{preset.height}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Presets */}
                                {customPresets.length > 0 && (
                                    <div className="pt-2 space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">My Presets</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {customPresets.map((preset, index) => (
                                                <div
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 text-[11px] text-indigo-700 dark:text-indigo-300"
                                                >
                                                    <button
                                                        onClick={() => handlePresetClick(preset.width, preset.height)}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {preset.name} ({preset.width}×{preset.height})
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomPreset(index)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Format & Quality */}
                            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Output Format
                                    </span>
                                    <span className="text-[11px] text-gray-500">Quality: {quality}%</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {FORMATS.map((fmt) => (
                                        <button
                                            key={fmt.value}
                                            onClick={() => handleFormatChange(fmt.value)}
                                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                format === fmt.value
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {fmt.label}
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Section 5: Action Button */}
                            <button
                                onClick={handleDownload}
                                disabled={isProcessing || isServerProcessing || !width || !height || !originalFile}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>
                                    {isProcessing || isServerProcessing
                                        ? 'Processing...'
                                        : `Download Image (${width || 0} × ${height || 0}px)`}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Compact Horizontal Pill Bar for Related Tools */}
                <ToolRecommendations currentTool="resize" />

                {/* Ad Placement: In-Content Leaderboard Slot Directly Under Action Workspace */}
                {contentAdSlot && (
                    <div className="pt-2">
                        <AdBanner dataAdSlot={contentAdSlot} dataAdFormat="horizontal" />
                    </div>
                )}
            </div>
        </div>
    );
}
