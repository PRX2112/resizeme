import type { Metadata } from 'next';
import CropTool from '@/components/tools/CropTool';
import { notFound } from 'next/navigation';

const VALID_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

interface PageProps {
    params: Promise<{
        format: string;
    }>
}

export default async function FormatCropPage({ params }: PageProps) {
    const resolvedParams = await params;
    const format = resolvedParams.format.toLowerCase();

    // Validate format
    if (!VALID_FORMATS.includes(format)) {
        notFound();
    }

    const displayFormat = format === 'jpeg' ? 'JPG' : format.toUpperCase();

    return (
        <CropTool
            defaultFormat={format === 'jpeg' ? 'jpg' : format}
            title={`Crop ${displayFormat} Image`}
        />
    );
}

export async function generateMetadata({ params }: PageProps) {
    const resolvedParams = await params;
    const format = resolvedParams.format.toLowerCase();
    const displayFormat = format === 'jpeg' ? 'JPG' : format.toUpperCase();

    return {
        title: `Crop ${displayFormat} Image Online - Free Image Cropper`,
        description: `Crop ${displayFormat} images online for free. Trim unwanted areas with preset or custom aspect ratios.`,
        alternates: {
            canonical: `/crop-${format}`
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export function generateStaticParams() {
    return [
        { format: 'png' },
        { format: 'jpg' },
        { format: 'webp' },
    ];
}

