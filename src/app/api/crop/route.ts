import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

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

        const { image, crop, format = 'png', quality = 90 } = body;

        if (!image || !crop) {
            return NextResponse.json(
                { error: 'Image and crop coordinates are required' },
                { status: 400 }
            );
        }

        // Remove data URL prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        if (imageBuffer.length > MAX_PAYLOAD_BYTES) {
            return NextResponse.json(
                { error: 'Decoded image payload exceeds 4.5MB server limit.' },
                { status: 413 }
            );
        }

        // Round coordinates to integers as Sharp expects integers
        let left = Math.round(Number(crop.x) || 0);
        let top = Math.round(Number(crop.y) || 0);
        let width = Math.round(Number(crop.width) || 1);
        let height = Math.round(Number(crop.height) || 1);

        // Ensure minimum dimensions of 1x1
        if (width < 1) width = 1;
        if (height < 1) height = 1;

        // Ensure non-negative coordinates
        if (left < 0) left = 0;
        if (top < 0) top = 0;

        const validQuality = Math.min(100, Math.max(1, parseInt(quality, 10) || 90));
        const normalizedFormat = (format || 'png').toLowerCase();

        let processedBuffer: Buffer;
        let finalRegion = { left, top, width, height };

        try {
            let sharpInstance = sharp(imageBuffer, { failOnError: false });

            // Get metadata to validate crop bounds
            const metadata = await sharpInstance.metadata();

            // Validate bounds against image size
            if (metadata.width && metadata.height) {
                if (left >= metadata.width) left = Math.max(0, metadata.width - 1);
                if (top >= metadata.height) top = Math.max(0, metadata.height - 1);

                if (left + width > metadata.width) {
                    width = Math.max(1, metadata.width - left);
                }
                if (top + height > metadata.height) {
                    height = Math.max(1, metadata.height - top);
                }
            }

            finalRegion = { left, top, width, height };

            // Perform crop
            sharpInstance = sharpInstance.extract(finalRegion);

            // Format conversion
            if (normalizedFormat === 'jpg' || normalizedFormat === 'jpeg') {
                sharpInstance = sharpInstance.jpeg({ quality: validQuality, mozjpeg: true });
            } else if (normalizedFormat === 'webp') {
                sharpInstance = sharpInstance.webp({ quality: validQuality });
            } else {
                sharpInstance = sharpInstance.png({ quality: validQuality });
            }

            processedBuffer = await sharpInstance.toBuffer();
        } catch (sharpError: any) {
            console.error('Sharp crop error:', sharpError);
            return NextResponse.json(
                { error: `Crop processing failed: ${sharpError.message || 'Invalid crop region or corrupted image.'}` },
                { status: 422 }
            );
        }

        const mimeType = normalizedFormat === 'jpg' || normalizedFormat === 'jpeg' ? 'image/jpeg' : `image/${normalizedFormat}`;
        const base64Output = `data:${mimeType};base64,${processedBuffer.toString('base64')}`;

        return NextResponse.json({
            image: base64Output,
            width: finalRegion.width,
            height: finalRegion.height,
        });

    } catch (error: any) {
        console.error('Crop API unhandled error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to crop image' },
            { status: 500 }
        );
    }
}

