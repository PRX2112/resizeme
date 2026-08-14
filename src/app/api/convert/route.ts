import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';

const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

export async function POST(req: NextRequest) {
    // 1. Validate content-length header early before buffer parsing
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
        return NextResponse.json(
            { error: 'Payload Too Large: Request body exceeds the 4.5MB server limit. Please convert fewer images simultaneously or pre-compress them.' },
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

        const { images, format = 'png', quality = 90 } = body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: 'Images array is required and must not be empty' },
                { status: 400 }
            );
        }

        const validQuality = Math.min(100, Math.max(1, parseInt(quality, 10) || 90));
        const normalizedFormat = (format || 'png').toLowerCase();
        const processedImages: { name: string; buffer: Buffer }[] = [];

        for (let i = 0; i < images.length; i++) {
            const { content, name } = images[i];

            if (!content) continue;

            // Remove data URL prefix
            const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');

            if (imageBuffer.length > MAX_PAYLOAD_BYTES) {
                return NextResponse.json(
                    { error: `Image "${name || i}" exceeds the 4.5MB payload limit.` },
                    { status: 413 }
                );
            }

            const originalName = name ? (name.substring(0, name.lastIndexOf('.')) || name) : `image_${i + 1}`;

            try {
                let sharpInstance = sharp(imageBuffer, { failOnError: false });

                // Apply compression/formatting
                if (normalizedFormat === 'png') {
                    sharpInstance = sharpInstance.png({ quality: validQuality, effort: 6 });
                } else if (normalizedFormat === 'jpg' || normalizedFormat === 'jpeg') {
                    sharpInstance = sharpInstance.jpeg({ quality: validQuality, mozjpeg: true });
                } else if (normalizedFormat === 'webp') {
                    sharpInstance = sharpInstance.webp({ quality: validQuality });
                } else if (normalizedFormat === 'avif') {
                    sharpInstance = sharpInstance.avif({ quality: validQuality });
                } else if (normalizedFormat === 'gif') {
                    sharpInstance = sharpInstance.gif();
                }

                const processedBuffer = await sharpInstance.toBuffer();
                const ext = normalizedFormat === 'jpeg' ? 'jpg' : normalizedFormat;
                processedImages.push({
                    name: `${originalName}.${ext}`,
                    buffer: processedBuffer,
                });
            } catch (sharpError: any) {
                console.error(`Sharp conversion error on image ${name}:`, sharpError);
                return NextResponse.json(
                    { error: `Failed to convert "${name}": ${sharpError.message || 'Corrupted or unsupported format.'}` },
                    { status: 422 }
                );
            }
        }

        if (processedImages.length === 0) {
            return NextResponse.json(
                { error: 'No valid images could be processed' },
                { status: 400 }
            );
        }

        // Return single image or ZIP
        if (processedImages.length === 1) {
            const img = processedImages[0];
            const mimeType = normalizedFormat === 'jpg' || normalizedFormat === 'jpeg' ? 'image/jpeg' : `image/${normalizedFormat}`;
            const base64 = `data:${mimeType};base64,${img.buffer.toString('base64')}`;

            return NextResponse.json({
                mode: 'single',
                image: base64,
                filename: img.name,
            });
        } else {
            const zip = new JSZip();
            processedImages.forEach(img => {
                zip.file(img.name, img.buffer);
            });

            const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

            return NextResponse.json({
                mode: 'zip',
                file: `converted_images.zip`,
                base64: `data:application/zip;base64,${zipBuffer.toString('base64')}`,
            });
        }

    } catch (error: any) {
        console.error('Conversion API unhandled error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to convert images' },
            { status: 500 }
        );
    }
}

