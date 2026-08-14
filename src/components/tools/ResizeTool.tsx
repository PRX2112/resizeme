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
} from 'lucide-react';
import { formatFileSize, calculatePercentageSize, fileToBase64, downloadFile } from '@/utils/imageUtils';
import { prepareImageForServer } from '@/utils/clientImagePreprocess';

import RecentUploads, { addRecentUpload } from '@/components/RecentUploads';
import ToolRecommendations from '@/components/ToolRecommendations';
import BookmarkPrompt, { incrementToolUsage } from '@/components/BookmarkPrompt';
import { trackImageUpload, trackImageDownload, trackToolConversion, trackTimeOnTool } from '@/lib/analytics';

const PRESET_SIZES = [
    { name: 'Instagram Post', width: 1080, height: 1080, icon: Instagram },
    { name: 'Instagram Story', width: 1080, height: 1920, icon: Instagram },
    { name: 'Facebook Cover', width: 820, height: 312, icon: Facebook },
    { name: 'Twitter Header', width: 1500, height: 500, icon: Twitter },
    { name: 'HD', width: 1920, height: 1080, icon: Monitor },
    { name: 'Mobile', width: 750, height: 1334, icon: Smartphone },
];

const FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
];

const PERCENTAGE_PRESETS = [
    { label: '50%', value: 50 },
    { label: '75%', value: 75 },
    { label: '100%', value: 100 },
    { label: '125%', value: 125 },
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
    const [useServerProcessing, setUseServerProcessing] = useState(true);
    const [isServerProcessing, setIsServerProcessing] = useState(false);

    const [processedImageBlob, setProcessedImageBlob] = useState<Blob | null>(null);
    const [processedFileName, setProcessedFileName] = useState<string>('');
    const [startTime, setStartTime] = useState<number>(0);
    const [showRecommendations, setShowRecommendations] = useState(false);

    // Custom Presets State
    const [customPresets, setCustomPresets] = useState<{ name: string; width: number; height: number }[]>([]);
    const [newPresetName, setNewPresetName] = useState('');

    // Load custom presets and favorite format
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
        const newPreset = {
            name: newPresetName.trim(),
            width,
            height
        };
        const updated = [...customPresets, newPreset];
        setCustomPresets(updated);
        localStorage.setItem('resizeme_custom_presets', JSON.stringify(updated));
        setNewPresetName('');
    };

    const deleteCustomPreset = (index: number) => {
        const updated = customPresets.filter((_, i) => i !== index);
        setCustomPresets(updated);
        localStorage.setItem('resizeme_custom_presets', JSON.stringify(updated));
    };

    const handleFormatChange = (fmt: string) => {
        setFormat(fmt);
        localStorage.setItem('resizeme_fav_format', fmt);
    };

    // Usage tracking
    const { usage, limits, canDownload, canProcessFile, trackDownload, showUpgradePrompt } = useUsageTracking();

    // Update dimensions when image loads
    useEffect(() => {
        if (originalImage) {
            setWidth(originalImage.width);
            setHeight(originalImage.height);
        }
    }, [originalImage]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleReset();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (!isProcessing && !isServerProcessing && width && height) {
                    handleDownload();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.click();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [width, height, isProcessing, isServerProcessing, originalFile]);

    const handleFileSelect = async (file: File) => {
        // No limit


        // Track upload and start timer
        trackImageUpload('Resize Tool', file.size, file.type);
        setStartTime(Date.now());
        incrementToolUsage();

        await loadImageFile(file);
    };

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

    const handlePresetClick = (presetWidth: number, presetHeight: number) => {
        setWidth(presetWidth);
        setHeight(presetHeight);
    };

    const handlePercentageClick = (percentage: number) => {
        if (originalImage) {
            const newDimensions = calculatePercentageSize(
                originalImage.width,
                originalImage.height,
                percentage
            );
            setWidth(newDimensions.width);
            setHeight(newDimensions.height);
        }
    };

    const handleDownload = async () => {
        if (!originalFile || !originalImage) return;

        // No limit

        try {
            if (useServerProcessing) {
                setIsServerProcessing(true);

                // Prepare and pre-process image if needed (< 4.5MB payload guarantee)
                const { base64 } = await prepareImageForServer(originalFile);

                // Call server API
                const response = await fetch('/api/resize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64,
                        width,
                        height,
                        format,
                        quality,
                        preserveMetadata: false,
                    }),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || 'Server processing failed');
                }

                const result = await response.json();

                // Convert base64 to blob for Drive save
                const base64Data = result.image.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: `image/${format}` });

                // Download the result
                const filename = `resized-${width}x${height}.${format}`;
                downloadFile(result.image, filename);

                // Store for Drive save
                setProcessedImageBlob(blob);
                setProcessedFileName(filename);

                // Track download and conversion
                await trackDownload(originalFile.size, 'Resize Tool', originalFile.name);
                trackImageDownload('Resize Tool', blob.size, `image/${format}`);

                const processingTime = Date.now() - startTime;
                trackToolConversion('Resize Tool', processingTime);

                // Add to recent uploads
                addRecentUpload('Resize Image', '/tools/resize');

                // Show recommendations
                setShowRecommendations(true);

                setIsServerProcessing(false);
            } else {
                // Use client-side processing
                await download({
                    width,
                    height,
                    maintainAspectRatio,
                    quality: quality / 100,
                    format,
                });

                // Track download and conversion
                await trackDownload(originalFile.size, 'Resize Tool', originalFile.name);
                trackImageDownload('Resize Tool', originalFile.size, `image/${format}`);

                const processingTime = Date.now() - startTime;
                trackToolConversion('Resize Tool', processingTime);

                // Add to recent uploads
                addRecentUpload('Resize Image', '/tools/resize');

                // Show recommendations
                setShowRecommendations(true);
            }
        } catch (err) {
            console.error('Download failed:', err);
            setIsServerProcessing(false);
        }
    };

    const handleReset = () => {
        reset();
        setWidth(0);
        setHeight(0);
        setQuality(95);
        setFormat(defaultFormat);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {title || (
                            <>Image <span className="gradient-text">Resize</span></>
                        )}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        Resize your images to any dimension while maintaining quality
                    </p>

                    <a
                        href="/tools/resize/bulk"
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-primary/20 hover:border-primary text-primary font-medium transition-all hover:shadow-lg hover:shadow-primary/10"
                    >
                        <span>✨ Need to resize multiple images?</span>
                        <span className="font-bold">Try Bulk Resize →</span>
                    </a>
                </div>



                {/* Recent Uploads */}
                <RecentUploads />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Upload & Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* File Upload */}
                        {!originalFile && (
                            <div className="animate-fade-in">
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    accept="image/*"
                                    maxSizeMB={limits.maxFileSize === Infinity ? Infinity : limits.maxFileSize / (1024 * 1024)}
                                />
                            </div>
                        )}

                        {/* Preview */}
                        {originalFile && previewUrl && (
                            <div className="card animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Preview
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Original: {originalImage?.width} × {originalImage?.height}px
                                            {originalFile && ` • ${formatFileSize(originalFile.size)}`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="btn btn-ghost flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </button>
                                </div>

                                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-auto max-h-[500px] object-contain"
                                    />
                                </div>

                                {error && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Preset Sizes */}
                        {originalFile && (
                            <div className="card animate-fade-in">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Preset Sizes
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {PRESET_SIZES.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => handlePresetClick(preset.width, preset.height)}
                                            className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                                <preset.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {preset.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {preset.width} × {preset.height}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Presets Block */}
                                {customPresets.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                                            Your Custom Presets
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {customPresets.map((preset, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary transition-all duration-200 group relative bg-gray-50/50 dark:bg-gray-900/20"
                                                >
                                                    <button
                                                        onClick={() => handlePresetClick(preset.width, preset.height)}
                                                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                            ★
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                {preset.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {preset.width} × {preset.height}px
                                                            </p>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomPreset(index)}
                                                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                                                        aria-label="Delete preset"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Percentage Scaling */}
                        {originalFile && (
                            <div className="card animate-fade-in">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Scale by Percentage
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {PERCENTAGE_PRESETS.map((preset) => (
                                        <button
                                            key={preset.value}
                                            onClick={() => handlePercentageClick(preset.value)}
                                            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Controls */}
                    {originalFile && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Dimensions */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Dimensions
                                </h3>

                                <div className="space-y-4">
                                    {/* Width */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Width (px)
                                        </label>
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={(e) => handleWidthChange(Number(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            min="1"
                                        />
                                    </div>

                                    {/* Aspect Ratio Lock */}
                                    <button
                                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                                    >
                                        {maintainAspectRatio ? (
                                            <Lock className="w-4 h-4 text-primary" />
                                        ) : (
                                            <Unlock className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {maintainAspectRatio ? 'Locked' : 'Unlocked'} Aspect Ratio
                                        </span>
                                    </button>

                                    {/* Height */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Height (px)
                                        </label>
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => handleHeightChange(Number(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            min="1"
                                        />
                                    </div>

                                    {/* Save Preset */}
                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">
                                            Save current dimensions
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Preset name (e.g. Banner)"
                                                value={newPresetName}
                                                onChange={(e) => setNewPresetName(e.target.value)}
                                                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                            <button
                                                onClick={saveCustomPreset}
                                                disabled={!newPresetName.trim() || !width || !height}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Format */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Output Format
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {FORMATS.map((fmt) => (
                                        <button
                                            key={fmt.value}
                                            onClick={() => handleFormatChange(fmt.value)}
                                            className={`py-2 px-4 rounded-lg font-medium transition-all ${format === fmt.value
                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {fmt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Quality: {quality}%
                                </h3>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Lower size</span>
                                    <span>Higher quality</span>
                                </div>
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                disabled={isProcessing || isServerProcessing || !width || !height}
                                className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-5 h-5" />
                                {isProcessing || isServerProcessing ? 'Processing...' : `Download (${width} × ${height}px)`}
                            </button>


                        </div>
                    )}
                </div>

                {/* Tool Recommendations */}
                {showRecommendations && (
                    <ToolRecommendations currentTool="resize" />
                )}
            </div>

            {/* Bookmark Prompt */}
            <BookmarkPrompt />
        </div>
    );
}
