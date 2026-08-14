import EnlargeTool from '@/components/tools/EnlargeTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Enlarge Image Online Free - Upscale Photos 2x and 4x Without Pixelation',
    description: 'Enlarge and upscale small photos online for free. Increase image resolution by 2x or 4x with smart Lanczos3 sinc resampling and unsharp edge enhancement.',
    alternates: {
        canonical: '/tools/enlarge',
    },
};

export default function EnlargePage() {
    return (
        <>
            <EnlargeTool title="Enlarge Image" />

            <ToolContentSection
                title="Image Enlarger & Upscaler"
                subtitle="High-Fidelity Image Upscaling: Lanczos3 Interpolation & Detail Reconstruction"
                description="Enlarge low-resolution snapshots, vintage photos, and small web graphics up to 400% without blocky pixelation. Our intelligent upscaling pipeline pairs multi-lobed sinc interpolation with micro-contrast edge sharpening to rebuild clean, printable assets."
                canonicalUrl="https://resizeme.in/tools/enlarge"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Upload Low-Res Photo',
                        text: 'Drag and drop your small image (JPG, PNG, WebP) into the upscaler dashboard.',
                    },
                    {
                        step: 2,
                        title: 'Select Scale Multiplier',
                        text: 'Choose 2× (200% resolution boost) or 4× (400% high-definition expansion).',
                    },
                    {
                        step: 3,
                        title: 'Enable Smart Sharpening',
                        text: 'Activate adaptive unsharp masking to enhance micro-contrast along structural edges.',
                    },
                    {
                        step: 4,
                        title: 'Download High-Res Output',
                        text: 'Inspect the enlarged result and download the crisp high-resolution photo instantly.',
                    },
                ]}
                features={[
                    {
                        title: '2× & 4× Upscale Factors',
                        description: 'Multiply native pixel counts by 4× to 16× total pixel area for large-format displays.',
                    },
                    {
                        title: 'Lanczos3 Sinc Resampling',
                        description: 'Advanced 8-lobed convolution kernel reconstructs missing continuous tonal gradients.',
                    },
                    {
                        title: 'Adaptive Unsharp Masking',
                        description: 'Micro-contrast filter detects high-frequency boundaries and sharpens edges without adding halos.',
                    },
                    {
                        title: 'Print-Ready Resolution Boost',
                        description: 'Convert low-DPI phone captures into high-density 300 DPI files suitable for photo printing and framing.',
                    },
                    {
                        title: 'Real-Time Canvas Processing',
                        description: 'High-speed client-side execution delivers rapid rendering without queue wait times.',
                    },
                    {
                        title: '100% In-Browser Security',
                        description: 'Your personal photos and graphic files remain completely private in local device memory.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Upscaling Mathematics',
                        title: 'The Challenge of Digital Pixelation and Super-Sampling Algorithms',
                        paragraphs: [
                            'Digital images are raster matrices of discrete pixel values. When you stretch an image beyond its native resolution, standard display engines simply replicate existing pixels, resulting in obvious jagged stair-stepping, blockiness, and checkerboard artifacts known as pixelation.',
                            'Traditional nearest-neighbor and simple bilinear upscaling cannot guess or reconstruct high-frequency details. Instead, modern mathematical upscalers utilize convolution kernels that evaluate a window of adjacent pixel neighborhoods to estimate smooth gradient transitions.',
                            'ResizeMe incorporates Lanczos3 resampling—a sinc function filter with a window of 3 cycles. By calculating weighted trigonometric averages of 36 surrounding pixels, it produces remarkably clean, organic transitions across curved and diagonal contours.',
                        ],
                        keyTakeaways: [
                            'Standard image stretching leads to blocky pixelation and jagged edge aliasing.',
                            'Lanczos3 sinc interpolation calculates 36 neighboring pixels to construct smooth curves.',
                            'Super-sampling eliminates the harsh blockiness of low-res mobile screenshots.',
                        ],
                    },
                    {
                        badge: 'Edge Enhancement',
                        title: 'Unsharp Masking (USM) and Micro-Contrast Enhancement',
                        paragraphs: [
                            'Whenever an image is enlarged through mathematical interpolation, high-frequency edge transitions can become slightly softened. To counteract this natural diffusion, photographic engineers utilize Unsharp Masking (USM).',
                            'Unsharp Masking creates an inverted, blurred copy of the image and compares it with the upscaled version. Where sharp tonal boundaries occur (such as the iris of an eye, hair strands, or architectural outlines), the algorithm amplifies the local contrast differential. This gives the human eye the impression of rich focus and tactile texture without introducing unnatural halos.',
                        ],
                        keyTakeaways: [
                            'Unsharp masking amplifies local edge contrast to restore perceived sharpness.',
                            'Adaptive thresholding prevents noise amplification in smooth sky or skin tones.',
                            'Combines seamlessly with Lanczos3 to deliver crisp printable posters.',
                        ],
                    },
                    {
                        badge: 'Print Preparation',
                        title: 'Converting Web Graphics to 300 DPI Print Standards',
                        paragraphs: [
                            'Standard web images are typically authored at 72 or 96 pixels per inch. If you send a 600×400 pixel web graphic to a professional photo printer requiring 300 DPI, the printed image will measure only 2×1.3 inches, or look blurry if stretched across a page.',
                            'By upscaling that same photo by 4× (to 2400×1600 pixels), it can be printed at a crisp 8×5.3 inches with crystal-clear 300 DPI physical dot density.',
                        ],
                        keyTakeaways: [
                            'Upscaling transforms low-res web snapshots into frameable print photos.',
                            'Multiply physical print inches by 300 to find your required pixel dimensions.',
                            'Always sharpen after upscaling to maximize ink droplet definition.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Interpolation Kernel', value: 'Lanczos3 (8-lobed sinc filtering)' },
                    { label: 'Upscale Multipliers', value: '2× (200%), 4× (400%)' },
                    { label: 'Edge Sharpening Engine', value: 'Convolution unsharp mask with threshold clipping' },
                    { label: 'Supported Input Formats', value: 'JPG, JPEG, PNG, WebP, AVIF' },
                    { label: 'Maximum Output Dimensions', value: 'Up to 8192 × 8192 pixels' },
                    { label: 'Execution Environment', value: 'Local WebGL / HTML5 2D Canvas + Server Sharp worker' },
                ]}
                relatedUseCases={[
                    {
                        title: 'Vintage Photo Restoration',
                        description: 'Upscale scanned family photographs and vintage prints to modern high-definition display resolutions.',
                    },
                    {
                        title: 'Poster & Canvas Printing',
                        description: 'Enlarge smartphone photos into high-resolution 300 DPI master files for large wall canvas prints.',
                    },
                    {
                        title: 'Social Media Asset Reuse',
                        description: 'Convert small legacy icons, avatars, and thumbnails into sharp assets for high-DPI Retina screens.',
                    },
                ]}
                faqs={[
                    {
                        question: 'Can you enlarge an image without losing quality?',
                        answer: 'While upscaling cannot magically recreate information that was never captured by the original camera sensor, our advanced Lanczos3 sinc filtering and adaptive sharpening mathematically reconstruct smooth transitions and crisp edges, preventing the blocky pixelation caused by basic resizing.',
                    },
                    {
                        question: 'What is the maximum upscale factor supported?',
                        answer: 'We support 2× (200%) and 4× (400%) scaling factors, allowing you to turn an 800×600 web snapshot into a massive 3200×2400 high-definition master file.',
                    },
                    {
                        question: 'How do I prepare an image for 300 DPI printing?',
                        answer: 'Calculate your desired physical print size in inches and multiply both width and height by 300. For example, a 6×4 inch print requires 1800×1200 pixels. Use our 2× or 4× upscaler to reach those target dimensions.',
                    },
                    {
                        question: 'Are my uploaded photos safe and private?',
                        answer: 'Yes. All image processing operations occur in your local device browser memory. Your personal photos are never stored on remote disks or used for machine learning training.',
                    },
                ]}
            />

            <ToolRecommendations currentTool="enlarge" />
        </>
    );
}

