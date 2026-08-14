

import CompressTool from '@/components/tools/CompressTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Compress Image Online Free - Reduce File Size up to 80%',
    description: 'Compress JPG, PNG, and WebP images online without losing quality. Reduce file sizes for faster websites, email attachments, and Google Core Web Vitals.',
    alternates: {
        canonical: '/tools/compress',
    },
};

export default function CompressPage() {
    return (
        <>
            <CompressTool title="Compress Image" />

            <ToolContentSection
                title="Image Compressor"
                subtitle="The Engineering of Image Compression: Lossy vs Lossless, Quantization & Web Vitals"
                description="Optimize digital images for lightning-fast web delivery without noticeable visual degradation. Compare before-and-after fidelity in real-time, strip unnecessary metadata bloat, and achieve up to 80% payload savings."
                canonicalUrl="https://resizeme.in/tools/compress"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Upload Images',
                        text: 'Drag and drop single or multiple JPG, PNG, or WebP files from your desktop or phone.',
                    },
                    {
                        step: 2,
                        title: 'Select Compression Level',
                        text: 'Choose Balanced (recommended), High Compression (maximum space savings), or Best Quality.',
                    },
                    {
                        step: 3,
                        title: 'Inspect Before/After Slider',
                        text: 'Use the interactive split slider to verify visual sharpness and ensure no compression artifacts were introduced.',
                    },
                    {
                        step: 4,
                        title: 'Download Optimized Files',
                        text: 'Save your compressed files individually or download the entire optimized batch in a single ZIP archive.',
                    },
                ]}
                features={[
                    {
                        title: 'Interactive Before/After Slider',
                        description: 'Compare source vs compressed pixels side-by-side with an interactive drag divider to inspect clarity.',
                    },
                    {
                        title: 'Smart Lossy & Lossless Algorithms',
                        description: 'Utilizes MozJPEG, libvips, and WebP encoders to eliminate invisible high-frequency color redundancies.',
                    },
                    {
                        title: 'Automated Metadata Stripping',
                        description: 'Removes heavy EXIF camera tags, GPS coordinates, and thumbnail previews for extra KB savings and privacy.',
                    },
                    {
                        title: 'Batch Compression Engine',
                        description: 'Compress dozens of high-res images simultaneously with instant savings statistics and ZIP downloads.',
                    },
                    {
                        title: 'Custom Quality Tuning',
                        description: 'Fine-tune quality percentages from 10% to 100% to hit precise kilobyte limits required by government and job portals.',
                    },
                    {
                        title: '100% Secure & Private',
                        description: 'Image processing executes in local browser memory without storing or tracking your personal media.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Compression Science',
                        title: 'Lossy vs Lossless Compression: How Quantization and DCT Work',
                        paragraphs: [
                            'Digital images contain massive amounts of raw byte data. Uncompressed, a 24-bit 1920×1080 image requires over 6.2 megabytes of raw memory. Image compression algorithms reduce this payload through two distinct mathematical approaches: lossless and lossy compression.',
                            'Lossless compression (such as PNG and WebP Lossless) uses Huffman coding and DEFLATE dictionary algorithms to identify repeated pixel patterns. When decompressed, every single pixel is bit-for-bit identical to the original. This is essential for line art, text screenshots, and medical imaging where zero pixel distortion is permitted.',
                            'Lossy compression (such as JPEG and standard WebP) exploits the Human Visual System (HVS). Because human eyes are far more sensitive to luminance (brightness variations) than chrominance (subtle color shifts), algorithms divide the image into 8×8 pixel blocks and apply a Discrete Cosine Transform (DCT). High-frequency color details imperceptible to human vision are selectively quantized (discarded), achieving massive 60% to 85% file size reductions with zero perceived quality loss.',
                        ],
                        keyTakeaways: [
                            'Lossless preserves 100% of raw data — best for graphics, UI icons, and text.',
                            'Lossy leverages Human Visual System limits to discard imperceptible color frequencies.',
                            'Quantization matrices determine the compression ratio vs artifact trade-off.',
                        ],
                    },
                    {
                        badge: 'SEO & Web Vitals',
                        title: 'How Image Optimization Powers Google Core Web Vitals (LCP)',
                        paragraphs: [
                            'Image payloads account for over 60% of average web page weight. Google search ranking algorithms directly penalize slow websites through the Largest Contentful Paint (LCP) Core Web Vital metric.',
                            'When hero banners or product images exceed 500KB, mobile browsers over 4G/5G connections experience noticeable network latency, delaying first-screen rendering. Compressing images down to 80–150KB reduces Time-To-First-Byte (TTFB) rendering overhead, boosts SEO rankings, and drastically decreases mobile bounce rates.',
                        ],
                        keyTakeaways: [
                            'Images represent the #1 factor in slow mobile LCP render times.',
                            'Compressing hero images under 150KB significantly improves Google Core Web Vitals.',
                            'Optimized pages reduce mobile user bounce rates and bandwidth consumption.',
                        ],
                    },
                    {
                        badge: 'Format Strategies',
                        title: 'Chroma Subsampling (4:2:0 vs 4:4:4) Explained',
                        paragraphs: [
                            'In standard JPEG encoding, chroma subsampling reduces the resolution of color channels relative to brightness. A 4:4:4 sampling maintains full color resolution across every pixel, while 4:2:0 halves color resolution both horizontally and vertically, instantly eliminating 50% of the raw data before entropy coding begins.',
                            'For natural photography, landscape shots, and portraits, 4:2:0 subsampling produces visually indistinguishable results from original files. However, for high-contrast red text or sharp graphic diagrams, 4:4:4 or lossless PNG compression preserves crisp typography boundaries.',
                        ],
                        keyTakeaways: [
                            '4:2:0 subsampling yields the smallest file sizes for photographic media.',
                            '4:4:4 or PNG should be selected for screenshots containing small red typography.',
                            'ResizeMe automatically selects optimal subsampling algorithms per file type.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Compression Kernels', value: 'MozJPEG, libvips, libwebp 1.3+ quantization' },
                    { label: 'Supported Input Formats', value: 'JPG, JPEG, PNG, WebP, GIF, AVIF' },
                    { label: 'Average File Reduction', value: '50% to 80% typical payload savings' },
                    { label: 'Metadata Handling', value: 'Automatic EXIF, GPS, and ICC profile stripping' },
                    { label: 'Chroma Subsampling', value: 'Adaptive 4:2:0 / 4:4:4 based on quality setting' },
                    { label: 'Batch Processing', value: 'Up to 50 images per session (ZIP archive download)' },
                ]}
                relatedUseCases={[
                    {
                        title: 'Website Performance & SEO',
                        description: 'Compress landing page hero banners and blog illustrations to achieve perfect 100/100 Google PageSpeed scores.',
                    },
                    {
                        title: 'Email Attachment Limits',
                        description: 'Shrink multi-megabyte camera photos down to lightweight kilobyte files to easily attach under strict email size caps.',
                    },
                    {
                        title: 'Application & Job Portals',
                        description: 'Reduce government, visa, or employment portal upload files to meet strict limits (e.g., under 50KB or 100KB).',
                    },
                ]}
                faqs={[
                    {
                        question: 'How much file size reduction can I expect?',
                        answer: 'Most high-resolution camera photos and PNG screenshots experience between 50% and 80% file size reduction on the Balanced setting without noticeable degradation.',
                    },
                    {
                        question: 'Will compressing my photo make it look blurry or pixelated?',
                        answer: 'No. Our intelligent quantization algorithms target invisible color redundancies rather than reducing pixel dimensions. You can use the live Before/After slider to preview the exact output before downloading.',
                    },
                    {
                        question: 'What happens to sensitive EXIF and GPS data in my photos?',
                        answer: 'Our compression engine automatically strips unneeded EXIF camera metadata and embedded GPS coordinates, protecting your location privacy and saving valuable kilobytes.',
                    },
                    {
                        question: 'Can I compress transparent PNG files?',
                        answer: 'Yes! Our PNG compressor uses palette optimization and alpha channel quantization to drastically reduce PNG sizes while maintaining complete transparent backgrounds.',
                    },
                ]}
            />
        </>
    );
}

