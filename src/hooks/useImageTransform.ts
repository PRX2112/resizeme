import { useState, useCallback, useEffect } from 'react';
import { validateImageFile } from '@/utils/imageUtils';

export interface TransformResult {
    image: string; // data URL
    width: number;
    height: number;
    blob?: Blob;
}

export function useImageTransform() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<TransformResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Transform State
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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
            setResult(null);

            const validation = validateImageFile(file, 25);
            if (!validation.valid) {
                setError(validation.error || 'Invalid file');
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                setImageElement(img);
                setPreviewUrl(objectUrl);
                setOriginalFile(file);
                setRotation(0);
                setFlipH(false);
                setFlipV(false);
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                setError('Failed to load image into browser.');
            };
            img.src = objectUrl;

        } catch (err) {
            console.error('Failed to load image:', err);
            setError('Failed to load image');
        }
    }, []);

    const applyTransform = useCallback(async (overrideParams?: {
        rotation?: number;
        flipHorizontal?: boolean;
        flipVertical?: boolean;
    }) => {
        if (!originalFile || !imageElement) return;

        setIsProcessing(true);
        setError(null);

        try {
            const rot = overrideParams?.rotation ?? rotation;
            const fH = overrideParams?.flipHorizontal ?? flipH;
            const fV = overrideParams?.flipVertical ?? flipV;

            const rad = (rot * Math.PI) / 180;
            const sin = Math.abs(Math.sin(rad));
            const cos = Math.abs(Math.cos(rad));

            // Compute new bounding dimensions
            const origW = imageElement.naturalWidth;
            const origH = imageElement.naturalHeight;
            const newWidth = Math.max(1, Math.round(origW * cos + origH * sin));
            const newHeight = Math.max(1, Math.round(origW * sin + origH * cos));

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not initialize canvas context');

            // Fill background if needed
            if (backgroundColor && backgroundColor !== 'transparent' && rot % 90 !== 0) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, newWidth, newHeight);
            }

            // Translate to center, rotate, flip, and draw
            ctx.translate(newWidth / 2, newHeight / 2);
            ctx.rotate(rad);
            ctx.scale(fH ? -1 : 1, fV ? -1 : 1);
            ctx.drawImage(imageElement, -origW / 2, -origH / 2);

            const mimeType = originalFile.type || 'image/png';
            const dataUrl = canvas.toDataURL(mimeType, 0.95);

            const blob = await new Promise<Blob | undefined>((resolve) => {
                canvas.toBlob((b) => resolve(b || undefined), mimeType, 0.95);
            });

            const transformResult = {
                image: dataUrl,
                width: newWidth,
                height: newHeight,
                blob,
            };

            setResult(transformResult);
            return transformResult;

        } catch (err: any) {
            console.error('Client-side transform failed:', err);
            setError(err.message || 'Failed to transform image');
            return undefined;
        } finally {
            setIsProcessing(false);
        }
    }, [originalFile, imageElement, rotation, flipH, flipV, backgroundColor]);

    const reset = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setOriginalFile(null);
        setImageElement(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
    }, [previewUrl]);

    // Live preview style for CSS transforms (instant fluid feedback)
    const getPreviewStyle = () => {
        return {
            transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    };

    return {
        originalFile,
        previewUrl,
        result,
        isProcessing,
        error,
        rotation,
        setRotation,
        flipH,
        setFlipH,
        flipV,
        setFlipV,
        backgroundColor,
        setBackgroundColor,
        loadFile,
        applyTransform,
        reset,
        getPreviewStyle
    };
}

