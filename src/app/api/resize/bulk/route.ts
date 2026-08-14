import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';

export const maxDuration = 60; // Set max duration for simple functionality

const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

export async function POST(request: NextRequest) {
    // 1. Validate content-length header early before buffer parsing
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
        return NextResponse.json(
            { error: 'Payload Too Large: Total bulk upload size exceeds the 4.5MB server limit. Please resize fewer images or pre-compress them.' },
            { status: 413 }
        );
    }

    try {
        let body: any;
        try {
            body = await request.json();
        } catch (jsonErr) {
            return NextResponse.json(
                { error: 'Invalid JSON payload or request body too large.' },
                { status: 400 }
            );
        }

        const { images, settings } = body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }

        const zip = new JSZip();

        // Settings defaults
        const percentage = Math.min(500, Math.max(1, settings?.percentage || 100));
        const targetFormat = (settings?.format || 'png').toLowerCase();
        const quality = Math.min(100, Math.max(1, settings?.quality || 90));

        let successCount = 0;

        await Promise.all(images.map(async (img: { name: string, content: string }, index: number) => {
            try {
                if (!img.content) return;

                // Decode base64
                const base64Data = img.content.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                if (buffer.length > MAX_PAYLOAD_BYTES) {
                    console.warn(`Bulk image ${index} (${img.name}) exceeds 4.5MB`);
                    return;
                }

                let sharpInstance = sharp(buffer, { failOnError: false });
                const metadata = await sharpInstance.metadata();

                // Resize logic
                let newWidth: number | undefined;
                let newHeight: number | undefined;

                if (settings?.width && settings?.height) {
                    newWidth = parseInt(settings.width, 10);
                    newHeight = parseInt(settings.height, 10);
                } else if (metadata.width && metadata.height) {
                    // Use percentage
                    newWidth = Math.round(metadata.width * (percentage / 100));
                    newHeight = Math.round(metadata.height * (percentage / 100));
                }

                if (newWidth && newHeight && newWidth > 0 && newHeight > 0) {
                    sharpInstance = sharpInstance.resize(newWidth, newHeight, {
                        fit: 'fill',
                    });
                }

                // Format logic
                if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
                    sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
                } else if (targetFormat === 'webp') {
                    sharpInstance = sharpInstance.webp({ quality });
                } else {
                    sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
                }

                const outputBuffer = await sharpInstance.toBuffer();

                // Add to zip
                const origName = img.name ? (img.name.split('.')[0] || `image_${index + 1}`) : `image_${index + 1}`;
                const fileName = `${origName}_resized.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
                zip.file(fileName, outputBuffer);
                successCount++;

            } catch (err) {
                console.error(`Error processing bulk image ${index} (${img.name}):`, err);
                // Continue with other images even if one fails
            }
        }));

        if (successCount === 0) {
            return NextResponse.json(
                { error: 'Failed to process any images in the batch. Please verify file formats.' },
                { status: 422 }
            );
        }

        const zipContent = await zip.generateAsync({ type: 'uint8array' });

        return new NextResponse(new Blob([zipContent as any]), {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="images_resized.zip"'
            }
        });

    } catch (error: any) {
        console.error('Bulk API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

