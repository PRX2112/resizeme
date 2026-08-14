import { useState, useCallback, useEffect } from 'react';
import { validateImageFile, loadImage, downloadFile, formatFileSize } from '@/utils/imageUtils';
import { prepareImageForServer } from '@/utils/clientImagePreprocess';

export interface CompressionResult {
    image: string; // base64
    originalSize: number;
    compressedSize: number;
    format: string;
}

export function useImageCompress() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressedResult, setCompressedResult] = useState<CompressionResult | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [targetKb, setTargetKb] = useState<number | null>(null);
    const [mode, setMode] = useState<'quality' | 'targetSize'>('quality');

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const loadFile = useCallback(async (file: File) => {
        try {
            setError(null);
            setCompressedResult(null);

            const validation = validateImageFile(file);
            if (!validation.valid) {
                setError(validation.error || 'Invalid file');
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setOriginalFile(file);

            // Initial compression with default quality
            await compressImage(file, 80, null);

        } catch (err) {
            console.error('Failed to load image:', err);
            setError('Failed to load image');
        }
    }, []);

    const compressImage = useCallback(async (file: File, qualityValue: number, targetKbValue: number | null) => {
        setIsCompressing(true);
        setError(null);

        try {
            // Pre-process on client if file exceeds Vercel 4.5MB threshold
            const { base64 } = await prepareImageForServer(file);

            const payload: any = {
                image: base64,
            };

            if (mode === 'targetSize' && targetKbValue && targetKbValue > 0) {
                payload.targetKb = targetKbValue;
            } else {
                payload.quality = qualityValue;
            }

            const response = await fetch('/api/compress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to compress');
            }

            const result = await response.json();
            setCompressedResult(result);

        } catch (err: any) {
            console.error('Compression failed:', err);
            setError(err.message || 'Failed to compress image');
        } finally {
            setIsCompressing(false);
        }
    }, [mode]);

    // Debounce changes in quality or targetKb
    useEffect(() => {
        if (!originalFile) return;

        const timer = setTimeout(() => {
            compressImage(originalFile, quality, targetKb);
        }, 400);

        return () => clearTimeout(timer);
    }, [quality, targetKb, mode, originalFile, compressImage]);

    const reset = useCallback(() => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setOriginalFile(null);
        setPreviewUrl(null);
        setCompressedResult(null);
        setError(null);
        setQuality(80);
        setTargetKb(null);
        setMode('quality');
    }, [previewUrl]);

    return {
        originalFile,
        previewUrl,
        compressedResult,
        isCompressing,
        error,
        quality,
        setQuality,
        targetKb,
        setTargetKb,
        mode,
        setMode,
        loadFile,
        compressImage,
        reset,
    };
}

