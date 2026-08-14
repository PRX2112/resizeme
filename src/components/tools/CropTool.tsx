'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import FileUpload from '@/components/FileUpload';
import { useImageCrop } from '@/hooks/useImageCrop';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import {
    Download,
    RotateCcw,
    Smartphone,
    Monitor,
    Square,
    Maximize,
    Loader2,
    X,
    Plus,
} from 'lucide-react';
import ToolRecommendations from '@/components/ToolRecommendations';
import AdBanner from '@/components/AdBanner';

const ASPECT_RATIOS = [
    { label: 'Freeform', value: undefined, icon: Maximize },
    { label: '1:1 Square', value: 1 / 1, icon: Square },
    { label: '16:9 Landscape', value: 16 / 9, icon: Monitor },
    { label: '4:5 Portrait', value: 4 / 5, icon: Smartphone },
    { label: '9:16 Story', value: 9 / 16, icon: Smartphone },
    { label: '4:3 Standard', value: 4 / 3, icon: Monitor },
];

const FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
];

interface CropToolProps {
    defaultFormat?: string;
    title?: string;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export default function CropTool({ defaultFormat = 'png', title }: CropToolProps) {
    const {
        originalFile,
        previewUrl,
        isProcessing,
        error,
        loadImageFile,
        cropImage,
        reset,
    } = useImageCrop();

    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [format, setFormat] = useState(defaultFormat);
    const imgRef = useRef<HTMLImageElement>(null);

    // Custom Saved Aspect Ratios State
    const [customAspects, setCustomAspects] = useState<{ name: string; value: number }[]>([]);
    const [newAspectName, setNewAspectName] = useState('');
    const [newAspectW, setNewAspectW] = useState<number>(0);
    const [newAspectH, setNewAspectH] = useState<number>(0);

    const { limits, trackDownload } = useUsageTracking();
    const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    useEffect(() => {
        try {
            const stored = localStorage.getItem('resizeme_custom_aspects');
            if (stored) {
                setCustomAspects(JSON.parse(stored));
            }
            const favFormat = localStorage.getItem('resizeme_fav_format');
            if (favFormat) {
                setFormat(favFormat);
            }
        } catch (e) {
            console.error('Failed to load local crop settings:', e);
        }
    }, []);

    const saveCustomAspect = () => {
        if (!newAspectName.trim() || !newAspectW || !newAspectH) return;
        const newRatio = {
            name: `${newAspectName.trim()} (${newAspectW}:${newAspectH})`,
            value: newAspectW / newAspectH,
        };
        const updated = [...customAspects, newRatio];
        setCustomAspects(updated);
        localStorage.setItem('resizeme_custom_aspects', JSON.stringify(updated));
        setNewAspectName('');
        setNewAspectW(0);
        setNewAspectH(0);
    };

    const deleteCustomAspect = (index: number) => {
        const updated = customAspects.filter((_, i) => i !== index);
        setCustomAspects(updated);
        localStorage.setItem('resizeme_custom_aspects', JSON.stringify(updated));
    };

    const handleFormatChange = (newFormat: string) => {
        setFormat(newFormat);
        try {
            localStorage.setItem('resizeme_fav_format', newFormat);
        } catch (e) {
            console.error('Failed to save format:', e);
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        if (aspect) {
            setCrop(centerAspectCrop(width, height, aspect));
        } else {
            setCrop({
                unit: '%',
                x: 5,
                y: 5,
                width: 90,
                height: 90,
            });
        }
    };

    const handleAspectRatioChange = (newAspect: number | undefined) => {
        setAspect(newAspect);
        if (imgRef.current && newAspect) {
            const { width, height } = imgRef.current;
            setCrop(centerAspectCrop(width, height, newAspect));
        }
    };

    const handleFileSelect = async (file: File) => {
        await loadImageFile(file);
    };

    const handleDownload = async () => {
        if (!imgRef.current || !completedCrop || !originalFile) return;

        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropX = Math.round(completedCrop.x * scaleX);
        const cropY = Math.round(completedCrop.y * scaleY);
        const cropWidth = Math.max(1, Math.round(completedCrop.width * scaleX));
        const cropHeight = Math.max(1, Math.round(completedCrop.height * scaleY));

        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const mimeType = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : `image/${format}`;

        if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, cropWidth, cropHeight);
        }

        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), mimeType, 0.92);
        });

        if (blob) {
            const originalName = originalFile.name || 'image';
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
            const filename = `${nameWithoutExt}_cropped_${cropWidth}x${cropHeight}.${format}`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        if (originalFile) {
            await trackDownload(originalFile.size, 'Crop Tool', originalFile.name);
        }
    };

    const handleReset = () => {
        reset();
        setCrop(undefined);
        setCompletedCrop(undefined);
        setAspect(undefined);
    };

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title || 'Image Cropper'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
                        Crop photos to exact aspect ratios (16:9, 4:5, 1:1) or custom freeform boundaries.
                    </p>
                </div>

                {/* Main Workspace (Consistent 2-Column Grid: lg:grid-cols-12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Interactive Crop Canvas (lg:col-span-8) */}
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
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Crop Mode:</span>{' '}
                                        {aspect ? 'Aspect Ratio Locked' : 'Freeform Selection'}
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center p-4 min-h-[380px] max-h-[540px]">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                        className="max-h-[500px]"
                                    >
                                        <img
                                            ref={imgRef}
                                            src={previewUrl || ''}
                                            alt="Crop preview"
                                            onLoad={onImageLoad}
                                            style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%' }}
                                        />
                                    </ReactCrop>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Consolidated Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5 ${!originalFile ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Aspect Ratios */}
                            <div className="space-y-2">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Aspect Ratios
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <button
                                            key={ratio.label}
                                            onClick={() => handleAspectRatioChange(ratio.value)}
                                            className={`p-2 rounded-lg border text-left text-xs font-medium transition-all ${
                                                aspect === ratio.value
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                                            }`}
                                        >
                                            <div className="truncate">{ratio.label}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Aspect Ratios */}
                                {customAspects.length > 0 && (
                                    <div className="pt-2 space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">My Ratios</span>
                                        <div className="flex flex-wrap gap-1">
                                            {customAspects.map((ratio, index) => (
                                                <div
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 text-[11px] text-indigo-700 dark:text-indigo-300"
                                                >
                                                    <button
                                                        onClick={() => handleAspectRatioChange(ratio.value)}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {ratio.name}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomAspect(index)}
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

                            {/* Add Custom Ratio */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Custom Ratio
                                </span>
                                <div className="flex gap-1.5 items-center">
                                    <input
                                        type="number"
                                        placeholder="W"
                                        value={newAspectW || ''}
                                        onChange={(e) => setNewAspectW(Number(e.target.value))}
                                        className="w-14 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                        min="1"
                                    />
                                    <span className="text-gray-400 text-xs font-bold">:</span>
                                    <input
                                        type="number"
                                        placeholder="H"
                                        value={newAspectH || ''}
                                        onChange={(e) => setNewAspectH(Number(e.target.value))}
                                        className="w-14 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                        min="1"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={newAspectName}
                                        onChange={(e) => setNewAspectName(e.target.value)}
                                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={saveCustomAspect}
                                        disabled={!newAspectName.trim() || !newAspectW || !newAspectH}
                                        className="p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                                        title="Save ratio"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Output Format */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Output Format
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {FORMATS.map((fmt) => (
                                        <button
                                            key={fmt.value}
                                            onClick={() => handleFormatChange(fmt.value)}
                                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                format === fmt.value
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                            }`}
                                        >
                                            {fmt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleDownload}
                                disabled={isProcessing || !completedCrop || !originalFile}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Cropping...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Crop & Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Tools Horizontal Pill Bar */}
                <ToolRecommendations currentTool="crop" />

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
