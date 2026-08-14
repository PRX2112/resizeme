/**
 * Client-side Image Pre-processing Utility
 * 
 * Vercel Serverless Functions enforce a strict 4.5 MB request body limit.
 * Because Base64 encoding adds ~33% overhead, any raw file > ~3.2 MB will exceed
 * the 4.5 MB threshold when transmitted as a JSON base64 string.
 * 
 * This utility detects large uploads and transparently downscales/pre-compresses
 * them on an in-browser HTML5 Canvas before network transmission, or provides
 * validation helpers to protect serverless Sharp endpoints.
 */

import { fileToBase64 } from './imageUtils';

/** Max HTTP request body size allowed by Vercel serverless functions (4.5 MB) */
export const VERCEL_MAX_BODY_BYTES = 4.5 * 1024 * 1024;

/** Max safe base64 string length (~4.2 MB to leave room for JSON headers/params) */
export const MAX_SAFE_BASE64_LENGTH = 4.2 * 1024 * 1024;

/** Max raw binary file size before base64 overhead risks hitting the 4.5 MB limit */
export const MAX_RAW_FILE_BYTES_FOR_SERVER = 3.1 * 1024 * 1024; // 3.1 MB

export interface PreprocessResult {
    base64: string;
    wasPreprocessed: boolean;
    originalSize: number;
    finalSize: number;
    mimeType: string;
}

export interface PreprocessOptions {
    maxBytes?: number;
    maxDimension?: number;
    initialQuality?: number;
    preserveTransparency?: boolean;
}

/**
 * Checks if a file or base64 payload is at risk of exceeding Vercel's 4.5 MB limit.
 */
export function isExceedingServerLimit(fileOrSize: File | number): boolean {
    const size = typeof fileOrSize === 'number' ? fileOrSize : fileOrSize.size;
    return size > MAX_RAW_FILE_BYTES_FOR_SERVER;
}

/**
 * Loads an image file into an HTMLImageElement using object URLs.
 * Transparently decodes HEIC/HEIF blobs via heic2any when required.
 */
async function loadFileToImage(file: File): Promise<HTMLImageElement> {
    let sourceBlob: Blob = file;
    const fileNameLower = file.name.toLowerCase();
    const isHeic = fileNameLower.endsWith('.heic') ||
                   fileNameLower.endsWith('.heif') ||
                   file.type.toLowerCase().includes('heic') ||
                   file.type.toLowerCase().includes('heif');

    if (isHeic && typeof window !== 'undefined') {
        try {
            const heic2any = (await import('heic2any')).default;
            const converted = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.95,
            });
            sourceBlob = Array.isArray(converted) ? converted[0] : converted;
        } catch (e) {
            console.error('Failed to pre-decode HEIC file:', e);
        }
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(sourceBlob);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Failed to decode image: ${file.name}`));
        };

        img.src = url;
    });
}

/**
 * Calculates downscaled dimensions while maintaining aspect ratio if maxDimension is exceeded.
 */
function getScaledDimensions(width: number, height: number, maxDimension: number): { width: number; height: number } {
    if (width <= maxDimension && height <= maxDimension) {
        return { width, height };
    }

    if (width > height) {
        return {
            width: maxDimension,
            height: Math.round((height * maxDimension) / width),
        };
    } else {
        return {
            width: Math.round((width * maxDimension) / height),
            height: maxDimension,
        };
    }
}

/**
 * Pre-processes an image file on the client using HTML5 Canvas to ensure
 * the resulting Base64 payload stays well under the 4.5 MB Vercel Serverless payload limit.
 * 
 * If the file is already small enough, it returns the raw base64 directly without re-compression.
 */
export async function prepareImageForServer(
    file: File,
    options: PreprocessOptions = {}
): Promise<PreprocessResult> {
    const {
        maxBytes = MAX_SAFE_BASE64_LENGTH,
        maxDimension = 3840, // 4K max dimension
        initialQuality = 0.92,
        preserveTransparency = true,
    } = options;

    const originalSize = file.size;

    // 1. If file is safely under ~3.1 MB, we can convert directly to base64
    if (originalSize <= MAX_RAW_FILE_BYTES_FOR_SERVER) {
        const rawBase64 = await fileToBase64(file);
        if (rawBase64.length <= maxBytes) {
            return {
                base64: rawBase64,
                wasPreprocessed: false,
                originalSize,
                finalSize: Math.round((rawBase64.length * 3) / 4),
                mimeType: file.type || 'image/jpeg',
            };
        }
    }

    // 2. File is large; perform canvas-based downsampling/compression
    const img = await loadFileToImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to obtain 2D canvas context for client pre-processing');
    }

    // Determine target format
    const isPng = file.type === 'image/png';
    const isWebp = file.type === 'image/webp';
    const hasAlpha = isPng || isWebp;
    
    // Choose export mime type
    let exportMime = file.type;
    if (!exportMime || (!hasAlpha && !exportMime.includes('jpeg') && !exportMime.includes('webp'))) {
        exportMime = 'image/jpeg';
    }

    // Progressive downscaling/compression loop
    let currentMaxDim = maxDimension;
    let currentQuality = initialQuality;
    let base64Output = '';
    let attempts = 0;

    while (attempts < 5) {
        attempts++;

        const { width: targetWidth, height: targetHeight } = getScaledDimensions(
            img.width,
            img.height,
            currentMaxDim
        );

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // If converting transparent image to JPEG, fill white background
        if (exportMime === 'image/jpeg' && hasAlpha && !preserveTransparency) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        base64Output = canvas.toDataURL(exportMime, currentQuality);

        // Check if output meets the safe payload size threshold
        if (base64Output.length <= maxBytes) {
            break;
        }

        // If still too large, step down quality and/or dimension
        if (exportMime === 'image/png' && base64Output.length > maxBytes) {
            // PNG ignores canvas quality parameter, so switch to WebP (keeps alpha) or reduce dimensions
            if (hasAlpha && preserveTransparency) {
                exportMime = 'image/webp';
                currentQuality = 0.88;
            } else {
                exportMime = 'image/jpeg';
                currentQuality = 0.85;
            }
        } else {
            currentQuality = Math.max(0.65, currentQuality - 0.12);
            currentMaxDim = Math.round(currentMaxDim * 0.8);
        }
    }

    return {
        base64: base64Output,
        wasPreprocessed: true,
        originalSize,
        finalSize: Math.round((base64Output.length * 3) / 4),
        mimeType: exportMime,
    };
}

/**
 * Prepares multiple image files for batch server endpoints (like /api/convert or /api/resize/bulk).
 * Ensures that all payloads are pre-processed to stay within the serverless body limits.
 */
export async function prepareBatchImagesForServer(
    files: File[],
    options?: PreprocessOptions
): Promise<Array<{ name: string; content: string; wasPreprocessed: boolean }>> {
    return Promise.all(
        files.map(async (file) => {
            const res = await prepareImageForServer(file, options);
            return {
                name: file.name,
                content: res.base64,
                wasPreprocessed: res.wasPreprocessed,
            };
        })
    );
}
