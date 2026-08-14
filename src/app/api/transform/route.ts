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

        const {
            image,
            rotation = 0,
            flipHorizontal = false,
            flipVertical = false,
            background = '#ffffff'
        } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
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
        let finalWidth: number;
        let finalHeight: number;
        let outputMimeType: string;

        try {
            let sharpInstance = sharp(imageBuffer, { failOnError: false });

            // 1. Rotate
            const rotNum = Number(rotation) || 0;
            if (rotNum !== 0) {
                sharpInstance = sharpInstance.rotate(rotNum, {
                    background: background || '#ffffff',
                });
            }

            // 2. Flip / Flop
            if (flipHorizontal) {
                sharpInstance = sharpInstance.flop();
            }

            if (flipVertical) {
                sharpInstance = sharpInstance.flip();
            }

            processedBuffer = await sharpInstance.toBuffer();
            const metadata = await sharp(processedBuffer).metadata();
            finalWidth = metadata.width || 0;
            finalHeight = metadata.height || 0;
            outputMimeType = metadata.format === 'jpeg' ? 'image/jpeg' : `image/${metadata.format || 'png'}`;
        } catch (sharpError: any) {
            console.error('Sharp transform error:', sharpError);
            return NextResponse.json(
                { error: `Transform processing failed: ${sharpError.message || 'Corrupted or unsupported image file.'}` },
                { status: 422 }
            );
        }

        const base64Output = `data:${outputMimeType};base64,${processedBuffer.toString('base64')}`;

        return NextResponse.json({
            image: base64Output,
            width: finalWidth,
            height: finalHeight,
        });

    } catch (error: any) {
        console.error('Transform API unhandled error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to transform image' },
            { status: 500 }
        );
    }
}

