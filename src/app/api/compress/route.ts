import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

async function compressImageBuffer(
    buffer: Buffer,
    format: string,
    quality: number,
    scaleFactor: number = 1.0
): Promise<Buffer> {
    let instance = sharp(buffer, { failOnError: false });

    if (scaleFactor < 1.0) {
        const metadata = await instance.metadata();
        if (metadata.width && metadata.height) {
            const newW = Math.max(16, Math.round(metadata.width * scaleFactor));
            const newH = Math.max(16, Math.round(metadata.height * scaleFactor));
            instance = instance.resize(newW, newH, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }
    }

    if (format === 'png') {
        instance = instance.png({
            quality,
            palette: true,
            compressionLevel: 9,
            effort: 8,
        });
    } else if (format === 'webp') {
        instance = instance.webp({
            quality,
            effort: 5,
        });
    } else if (format === 'avif') {
        instance = instance.avif({
            quality,
            effort: 4,
        });
    } else if (format === 'gif') {
        instance = instance.gif({
            colours: Math.min(256, Math.max(32, Math.round((quality / 100) * 256))),
            effort: 8,
        });
    } else {
        // Default to JPG (MozJPEG)
        instance = instance.jpeg({
            quality,
            mozjpeg: true,
        });
    }

    return await instance.toBuffer();
}

export async function POST(req: NextRequest) {
    // 1. Validate content-length header early before buffer parsing
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
        return NextResponse.json(
            { error: 'Payload Too Large: Request body exceeds the 4.5MB server limit. Please use client-side compression or upload a smaller file.' },
            { status: 413 }
        );
    }

    try {
        let body: any;
        try {
            body = await req.json();
        } catch (jsonErr) {
            return NextResponse.json(
                { error: 'Invalid JSON payload or request body too large.' },
                { status: 400 }
            );
        }

        const { image, quality = 80, format, targetKb } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        // Remove data URL prefix
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        if (imageBuffer.length > MAX_PAYLOAD_BYTES) {
            return NextResponse.json(
                { error: 'Decoded image payload exceeds 4.5MB server limit.' },
                { status: 413 }
            );
        }

        const originalSize = imageBuffer.length;
        const validQuality = Math.min(100, Math.max(1, parseInt(quality, 10) || 80));

        let compressedBuffer: Buffer;
        let outputFormat: string;

        try {
            const probeInstance = sharp(imageBuffer, { failOnError: false });
            const metadata = await probeInstance.metadata();

            // Determine output format
            outputFormat = (format || metadata.format || 'jpg').toLowerCase();
            if (outputFormat === 'jpeg') outputFormat = 'jpg';

            const numericTargetKb = parseInt(targetKb, 10);

            if (numericTargetKb && numericTargetKb > 0) {
                const targetBytes = numericTargetKb * 1024;
                const minTargetBytes = targetBytes * 0.95;
                const maxTargetBytes = targetBytes * 1.05;

                let lowQ = 10;
                let highQ = 90;
                let bestBuffer: Buffer | null = null;
                let bestDiff = Infinity;

                // Binary search loop (capped at maximum 4 iterations)
                for (let iter = 0; iter < 4; iter++) {
                    const midQ = Math.round((lowQ + highQ) / 2);
                    const testBuffer = await compressImageBuffer(imageBuffer, outputFormat, midQ, 1.0);
                    const testSize = testBuffer.length;
                    const diff = Math.abs(testSize - targetBytes);

                    if (diff < bestDiff) {
                        bestDiff = diff;
                        bestBuffer = testBuffer;
                    }

                    // If within ±5% of target size, terminate early
                    if (testSize >= minTargetBytes && testSize <= maxTargetBytes) {
                        bestBuffer = testBuffer;
                        break;
                    }

                    if (testSize > targetBytes) {
                        highQ = midQ - 1;
                    } else {
                        lowQ = midQ + 1;
                    }
                }

                // If still exceeding target size after binary search, apply gentle proportional downscaling
                if (bestBuffer && bestBuffer.length > maxTargetBytes) {
                    const scaleSteps = [0.8, 0.65, 0.5];
                    for (const scale of scaleSteps) {
                        const testBuffer = await compressImageBuffer(imageBuffer, outputFormat, 25, scale);
                        if (testBuffer.length <= maxTargetBytes) {
                            bestBuffer = testBuffer;
                            break;
                        }
                        if (testBuffer.length < bestBuffer.length) {
                            bestBuffer = testBuffer;
                        }
                    }
                }

                compressedBuffer = bestBuffer || await compressImageBuffer(imageBuffer, outputFormat, 15, 1.0);
            } else {
                // Standard single-pass compression
                compressedBuffer = await compressImageBuffer(imageBuffer, outputFormat, validQuality, 1.0);
            }

        } catch (sharpError: any) {
            console.error('Sharp compression error:', sharpError);
            return NextResponse.json(
                { error: `Image compression failed: ${sharpError.message || 'Corrupted or unsupported image file.'}` },
                { status: 422 }
            );
        }

        const compressedSize = compressedBuffer.length;
        const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : `image/${outputFormat}`;
        const base64Output = `data:${mimeType};base64,${compressedBuffer.toString('base64')}`;

        return NextResponse.json({
            image: base64Output,
            originalSize,
            compressedSize,
            format: outputFormat,
        });

    } catch (error: any) {
        console.error('Compression API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to compress image' },
            { status: 500 }
        );
    }
}


