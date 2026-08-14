import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

export async function POST(req: NextRequest) {
    // 1. Validate content-length header early before buffer parsing
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
        return NextResponse.json(
            { error: 'Payload Too Large: Request body exceeds the 4.5MB server limit. Please use client-side pre-processing or upload a smaller file.' },
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

        const { image, factor = 2, enhance = true } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        // Validate factor
        const scaleFactor = Number(factor);
        if (scaleFactor !== 2 && scaleFactor !== 4) {
            return NextResponse.json(
                { error: 'Factor must be 2 or 4' },
                { status: 400 }
            );
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        if (imageBuffer.length > MAX_PAYLOAD_BYTES) {
            return NextResponse.json(
                { error: 'Decoded image payload exceeds 4.5MB server limit.' },
                { status: 413 }
            );
        }

        let processedBuffer: Buffer;
        let origWidth: number;
        let origHeight: number;
        let newWidth: number;
        let newHeight: number;
        let outputMimeType: string;
        let effectiveScaleFactor = scaleFactor;
        let warningMessage: string | undefined;

        try {
            let sharpInstance = sharp(imageBuffer, { failOnError: false });
            const metadata = await sharpInstance.metadata();

            if (!metadata.width || !metadata.height) {
                return NextResponse.json(
                    { error: 'Invalid image data or unreadable dimensions.' },
                    { status: 422 }
                );
            }

            origWidth = metadata.width;
            origHeight = metadata.height;

            // Memory Safety Cap: Prevent Vercel Serverless OOM crashes on 4x Lanczos upscaling of large images
            if (scaleFactor === 4 && (origWidth > 2048 || origHeight > 2048)) {
                effectiveScaleFactor = 2;
                warningMessage = 'Source image exceeds 2048px limit for 4× upscaling. Automatically adjusted to 2× Lanczos3 to prevent memory overflow.';
            }

            newWidth = Math.round(origWidth * effectiveScaleFactor);
            newHeight = Math.round(origHeight * effectiveScaleFactor);

            // Hard safety check for max output dimensions (prevent server crash)
            if (newWidth > 6000 || newHeight > 6000) {
                return NextResponse.json(
                    { error: 'Resulting image dimensions would exceed maximum safe limit (6000px). Please downscale first.' },
                    { status: 400 }
                );
            }

            // 1. Resize using Lanczos3 (high quality sinc kernel interpolation)
            sharpInstance = sharpInstance.resize({
                width: newWidth,
                height: newHeight,
                kernel: sharp.kernel.lanczos3,
                withoutEnlargement: false,
            });

            // 2. Apply Sharpening if enhanced (Unsharp Mask)
            if (enhance) {
                if (effectiveScaleFactor === 2) {
                    sharpInstance = sharpInstance.sharpen({
                        sigma: 0.8,
                        m1: 0,
                        m2: 2,
                    });
                } else {
                    sharpInstance = sharpInstance.sharpen({
                        sigma: 1.2,
                        m1: 0,
                        m2: 3,
                    });
                }
            }

            processedBuffer = await sharpInstance.toBuffer();
            outputMimeType = metadata.format === 'jpeg' ? 'image/jpeg' : `image/${metadata.format || 'png'}`;
        } catch (sharpError: any) {
            console.error('Sharp enlarge error:', sharpError);
            return NextResponse.json(
                { error: `Enlarging failed: ${sharpError.message || 'Corrupted image buffer.'}` },
                { status: 422 }
            );
        }

        const base64Output = `data:${outputMimeType};base64,${processedBuffer.toString('base64')}`;

        return NextResponse.json({
            image: base64Output,
            originalWidth: origWidth,
            originalHeight: origHeight,
            newWidth: newWidth,
            newHeight: newHeight,
            effectiveFactor: effectiveScaleFactor,
            warning: warningMessage,
        });

    } catch (error: any) {
        console.error('Enlarge API unhandled error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to enlarge image' },
            { status: 500 }
        );
    }
}

