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

const ASPECT_RATIOS = [
    { label: 'Free', value: undefined, icon: Maximize },
    { label: 'Square (1:1)', value: 1 / 1, icon: Square },
    { label: 'Landscape (16:9)', value: 16 / 9, icon: Monitor },
    { label: 'Portrait (4:5)', value: 4 / 5, icon: Smartphone },
    { label: 'Mobile (9:16)', value: 9 / 16, icon: Smartphone },
    { label: 'Standard (4:3)', value: 4 / 3, icon: Monitor },
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

// Helper to center the crop when image loads or aspect changes
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
    const [processedImageBlob, setProcessedImageBlob] = useState<Blob | null>(null);
    const [processedFileName, setProcessedFileName] = useState<string>('');

    // Custom Saved Aspect Ratios State
    const [customAspects, setCustomAspects] = useState<{ name: string; value: number }[]>([]);
    const [newAspectName, setNewAspectName] = useState('');
    const [newAspectW, setNewAspectW] = useState<number>(0);
    const [newAspectH, setNewAspectH] = useState<number>(0);

    // Load local custom aspect presets and favorite formats
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
            value: newAspectW / newAspectH
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

    const handleFormatChange = (fmt: string) => {
        setFormat(fmt);
        localStorage.setItem('resizeme_fav_format', fmt);
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleReset();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (!isProcessing && completedCrop && imgRef.current) {
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
    }, [completedCrop, isProcessing, originalFile]);

    // Usage tracking
    const { usage, limits, canDownload, canProcessFile, trackDownload } = useUsageTracking();

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        } else {
            // Default to full width crop for freeform
            const { width, height } = e.currentTarget;
            setCrop({
                unit: '%',
                width: 90,
                height: 90,
                x: 5,
                y: 5
            });
        }
    };

    const handleFileSelect = async (file: File) => {
        await loadImageFile(file);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setAspect(undefined);
    };

    const handleAspectRatioChange = (newAspect: number | undefined) => {
        setAspect(newAspect);

        if (imgRef.current && newAspect) {
            const { width, height } = imgRef.current;
            setCrop(centerAspectCrop(width, height, newAspect));
        } else if (imgRef.current && !newAspect) {
            // Reset to a default free crop if switching to free
            setCrop({
                unit: '%',
                width: 50,
                height: 50,
                x: 25,
                y: 25
            });
        }
    };

    const handleDownload = async () => {
        if (!completedCrop || !imgRef.current) return;



        // The completedCrop contains coordinates relative to the DISPLAYED image size.
        // We need to scale them to the ORIGINAL image natural size for the server.
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const serverCrop = {
            x: completedCrop.x * scaleX,
            y: completedCrop.y * scaleY,
            width: completedCrop.width * scaleX,
            height: completedCrop.height * scaleY,
        };

        // Call crop API and get result
        const base64 = originalFile ? await (async () => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(originalFile);
            });
        })() : '';

        const response = await fetch('/api/crop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: base64,
                crop: serverCrop,
                rotate: 0,
                format,
            }),
        });

        if (response.ok) {
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
            const filename = `cropped-image.${format === 'jpg' ? 'jpg' : format}`;

            // Download
            const link = document.createElement('a');
            link.href = result.image;
            link.download = filename;
            link.click();

            // Store for Drive save
            setProcessedImageBlob(blob);
            setProcessedFileName(filename);
        }

        // Track download
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {title || (
                            <>Image <span className="gradient-text">Crop</span></>
                        )}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        Crop your images to exact dimensions or common aspect ratios
                    </p>
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Cropper / Upload */}
                    <div className="lg:col-span-2 space-y-6">
                        {!originalFile && (
                            <div className="animate-fade-in">
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    accept="image/*"
                                    maxSizeMB={limits.maxFileSize === Infinity ? Infinity : limits.maxFileSize / (1024 * 1024)}
                                />
                            </div>
                        )}

                        {originalFile && previewUrl && (
                            <div className="card animate-fade-in relative flex flex-col min-h-[500px]">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={handleReset}
                                        className="btn btn-secondary shadow-lg py-2 px-4 text-sm"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset
                                    </button>
                                </div>

                                <div className="relative flex-1 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center p-4">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                        className="max-h-[600px]"
                                    >
                                        <img
                                            ref={imgRef}
                                            src={previewUrl}
                                            alt="Crop preview"
                                            onLoad={onImageLoad}
                                            style={{ maxHeight: '600px', width: 'auto', maxWidth: '100%' }}
                                        />
                                    </ReactCrop>
                                </div>

                                <div className="mt-4 px-2 text-center text-sm text-gray-500">
                                    Draft handles to resize selection. {aspect ? 'Aspect ratio locked.' : 'Free selection active.'}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Controls */}
                    {originalFile && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Aspect Ratios */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Aspect Ratio
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <button
                                            key={ratio.label}
                                            onClick={() => handleAspectRatioChange(ratio.value)}
                                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${aspect === ratio.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <ratio.icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{ratio.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Aspect Ratios List */}
                                {customAspects.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                            Custom Aspect Ratios
                                        </h4>
                                        <div className="space-y-2">
                                            {customAspects.map((ratio, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/50"
                                                >
                                                    <button
                                                        onClick={() => handleAspectRatioChange(ratio.value)}
                                                        className={`flex-1 text-left text-xs font-semibold ${aspect === ratio.value ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        ★ {ratio.name}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomAspect(index)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        aria-label="Delete aspect preset"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add Custom Aspect Form */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Add Custom Aspect
                                    </h4>
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Card)"
                                        value={newAspectName}
                                        onChange={(e) => setNewAspectName(e.target.value)}
                                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            placeholder="W (e.g. 4)"
                                            value={newAspectW || ''}
                                            onChange={(e) => setNewAspectW(Number(e.target.value))}
                                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            min="1"
                                        />
                                        <span className="text-gray-400 text-xs">:</span>
                                        <input
                                            type="number"
                                            placeholder="H (e.g. 3)"
                                            value={newAspectH || ''}
                                            onChange={(e) => setNewAspectH(Number(e.target.value))}
                                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            min="1"
                                        />
                                        <button
                                            onClick={saveCustomAspect}
                                            disabled={!newAspectName.trim() || !newAspectW || !newAspectH}
                                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
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

                            {/* Download */}
                            <button
                                onClick={handleDownload}
                                disabled={isProcessing || !completedCrop}
                                className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-2" />
                                        Crop & Download
                                    </>
                                )}
                            </button>


                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
