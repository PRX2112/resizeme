import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

export async function POST(request: NextRequest) {
    // 1. Validate content-length header early before buffer parsing
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
        return NextResponse.json(
            { error: 'Payload Too Large: Request body exceeds the 4.5MB server limit. Please resize or compress the file before uploading.' },
            { status: 413 }
        );
    }

    try {
        let body: any;
        try {
            body = await request.json();
        } catch (jsonErr) {
            return NextResponse.json(
                { error: 'Invalid JSON payload or body too large.' },
                { status: 400 }
            );
        }

        const { image, width, height, format, quality, preserveMetadata } = body;

        // Validate inputs
        if (!image || !width || !height || !format) {
            return NextResponse.json(
                { error: 'Missing required parameters (image, width, height, format)' },
                { status: 400 }
            );
        }

        // Validate dimensions
        const numWidth = parseInt(width, 10);
        const numHeight = parseInt(height, 10);

        if (isNaN(numWidth) || isNaN(numHeight) || numWidth > 10000 || numHeight > 10000 || numWidth < 1 || numHeight < 1) {
            return NextResponse.json(
                { error: 'Invalid dimensions. Must be between 1 and 10000 pixels' },
                { status: 400 }
            );
        }

        // Validate format
        const normalizedFormat = format.toLowerCase() === 'jpg' ? 'jpeg' : format.toLowerCase();
        if (!['png', 'jpg', 'jpeg', 'webp'].includes(normalizedFormat)) {
            return NextResponse.json(
                { error: 'Invalid format. Supported: png, jpg, jpeg, webp' },
                { status: 400 }
            );
        }

        // Convert base64 to buffer safely
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        if (imageBuffer.length > MAX_PAYLOAD_BYTES) {
            return NextResponse.json(
                { error: 'Decoded image payload exceeds 4.5MB server limit.' },
                { status: 413 }
            );
        }

        // Process image with Sharp with dedicated try/catch
        let outputBuffer: Buffer;
        let finalWidth: number;
        let finalHeight: number;

        try {
            let sharpInstance = sharp(imageBuffer, { failOnError: false });

            // Apply resize
            sharpInstance = sharpInstance.resize(numWidth, numHeight, {
                fit: 'fill',
                withoutEnlargement: false,
            });

            // Apply format-specific options
            const qualityValue = Math.min(100, Math.max(1, quality || 95));

            if (normalizedFormat === 'jpeg') {
                sharpInstance = sharpInstance.jpeg({
                    quality: qualityValue,
                    progressive: true,
                    mozjpeg: true,
                });
            } else if (normalizedFormat === 'png') {
                sharpInstance = sharpInstance.png({
                    quality: qualityValue,
                    compressionLevel: 9,
                    adaptiveFiltering: true,
                });
            } else if (normalizedFormat === 'webp') {
                sharpInstance = sharpInstance.webp({
                    quality: qualityValue,
                    effort: 6,
                });
            }

            // Keep metadata if requested
            if (preserveMetadata) {
                sharpInstance = sharpInstance.withMetadata();
            }

            outputBuffer = await sharpInstance.toBuffer();
            const meta = await sharp(outputBuffer).metadata();
            finalWidth = meta.width || numWidth;
            finalHeight = meta.height || numHeight;
        } catch (sharpError: any) {
            console.error('Sharp processing error in resize route:', sharpError);
            return NextResponse.json(
                { error: `Image processing failed: ${sharpError.message || 'Corrupted or unsupported image file.'}` },
                { status: 422 }
            );
        }

        // Convert to base64
        const base64Output = outputBuffer.toString('base64');
        const mimeType = `image/${normalizedFormat}`;
        const dataUrl = `data:${mimeType};base64,${base64Output}`;

        return NextResponse.json({
            image: dataUrl,
            size: outputBuffer.length,
            width: finalWidth,
            height: finalHeight,
            format: normalizedFormat,
        });
    } catch (error: any) {
        console.error('Resize API unhandled error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process image. Please try again.' },
            { status: 500 }
        );
    }
}

