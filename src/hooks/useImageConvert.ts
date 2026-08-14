import { useState, useCallback } from 'react';
import { downloadFile } from '@/utils/imageUtils';
import { prepareImageForServer } from '@/utils/clientImagePreprocess';

export interface ConvertFile {
    file: File;
    preview: string;
}

export function useImageConvert() {
    const [files, setFiles] = useState<ConvertFile[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addFiles = useCallback(async (newFiles: File[]) => {
        const processed: ConvertFile[] = [];
        setIsConverting(true);
        setError(null);

        try {
            for (const file of newFiles) {
                const fileNameLower = file.name.toLowerCase();
                const isHeic = fileNameLower.endsWith('.heic') ||
                               fileNameLower.endsWith('.heif') ||
                               file.type.toLowerCase().includes('heic') ||
                               file.type.toLowerCase().includes('heif');

                if (isHeic) {
                    try {
                        // Dynamic import of heic2any in browser
                        const heic2any = (await import('heic2any')).default;
                        const convertedBlobOrBlobs = await heic2any({
                            blob: file,
                            toType: 'image/jpeg',
                            quality: 0.95,
                        });
                        const convertedBlob = Array.isArray(convertedBlobOrBlobs) ? convertedBlobOrBlobs[0] : convertedBlobOrBlobs;
                        const convertedName = file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
                        const standardFile = new File([convertedBlob], convertedName, { type: 'image/jpeg' });

                        processed.push({
                            file: standardFile,
                            preview: URL.createObjectURL(convertedBlob),
                        });
                        continue;
                    } catch (heicErr) {
                        console.error('HEIC client decoding failed:', heicErr);
                    }
                }

                // Standard image file validation
                if (file.type.startsWith('image/') || isHeic) {
                    processed.push({
                        file,
                        preview: URL.createObjectURL(file),
                    });
                }
            }

            setFiles(prev => [...prev, ...processed]);
        } catch (err: any) {
            console.error('Failed to add files:', err);
            setError(err.message || 'Failed to process files');
        } finally {
            setIsConverting(false);
        }
    }, []);

    const removeFile = useCallback((index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    }, []);

    const convertImages = useCallback(async (format: string, quality: number = 90) => {
        if (files.length === 0) return;

        setIsConverting(true);
        setError(null);

        try {
            const imagesPayload = await Promise.all(
                files.map(async (f) => {
                    const { base64 } = await prepareImageForServer(f.file);
                    return {
                        name: f.file.name,
                        content: base64,
                    };
                })
            );

            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    images: imagesPayload,
                    format,
                    quality
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to convert images');
            }

            const result = await response.json();

            if (result.mode === 'single') {
                downloadFile(result.image, result.filename);
            } else if (result.mode === 'zip') {
                downloadFile(result.base64, result.file);
            }

        } catch (err: any) {
            console.error('Convert failed:', err);
            setError(err.message || 'Failed to convert images');
        } finally {
            setIsConverting(false);
        }
    }, [files]);

    const reset = useCallback(() => {
        files.forEach(f => URL.revokeObjectURL(f.preview));
        setFiles([]);
        setError(null);
    }, [files]);

    return {
        files,
        isConverting,
        error,
        addFiles,
        removeFile,
        convertImages,
        reset
    };
}
