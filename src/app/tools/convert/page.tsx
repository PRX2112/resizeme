import ConvertTool from '@/components/tools/ConvertTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Convert Image Format Online Free - JPG, PNG, WebP, AVIF, GIF, HEIC',
    description: 'Convert images between JPG, PNG, WebP, AVIF, GIF, and HEIC online for free. Fast bulk image conversion with transparency retention.',
    alternates: {
        canonical: '/tools/convert',
    },
};

export default function ConvertPage() {
    return (
        <>
            <ConvertTool title="Convert Image" />

            <ToolContentSection
                title="Image Converter"
                subtitle="The Comprehensive Image Format Guide: JPEG vs PNG vs WebP vs AVIF vs HEIC"
                description="Convert raster and vector images between modern next-gen web formats and universally supported legacy standards. Maintain 24-bit/32-bit color gamuts, preserve alpha channel transparency, and batch process multiple files in seconds."
                canonicalUrl="https://resizeme.in/tools/convert"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Select Input Files',
                        text: 'Upload up to 50 photos or graphics (JPG, PNG, WebP, AVIF, HEIC, GIF, or BMP).',
                    },
                    {
                        step: 2,
                        title: 'Choose Target Format',
                        text: 'Select your preferred output container (e.g. WebP for web delivery, PNG for transparency, JPG for compatibility).',
                    },
                    {
                        step: 3,
                        title: 'Execute Conversion',
                        text: 'Click Convert to re-encode color profiles and compression headers in real time.',
                    },
                    {
                        step: 4,
                        title: 'Save & Download',
                        text: 'Download converted files individually or download the complete collection as a ZIP archive.',
                    },
                ]}
                features={[
                    {
                        title: 'Next-Gen WebP & AVIF Support',
                        description: 'Modern encoding standards that deliver up to 50% better compression efficiency than legacy JPEG.',
                    },
                    {
                        title: 'Lossless Alpha Channel Preservation',
                        description: 'Seamlessly convert between transparent PNG and transparent WebP without losing cutout outlines.',
                    },
                    {
                        title: 'Batch Format Conversion',
                        description: 'Convert dozens of images across mixed source formats into a unified target format with single-click ZIP export.',
                    },
                    {
                        title: 'Apple HEIC/HEIF Decoding',
                        description: 'Easily convert iPhone HEIC camera captures to universally compatible JPEG or WebP files.',
                    },
                    {
                        title: 'Zero Quality Degeneration',
                        description: 'High-precision color space mapping prevents chromatic banding and gamma distortion.',
                    },
                    {
                        title: '100% Client-Side Privacy',
                        description: 'Files are processed safely in your browser memory without being stored on remote servers.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Format Evolution',
                        title: 'Next-Gen Formats: Why WebP and AVIF Outperform Legacy JPEG and PNG',
                        paragraphs: [
                            'For decades, JPEG (developed in 1992) and PNG (developed in 1996) served as the foundation of the World Wide Web. However, modern web standards have evolved to meet the demands of 4K displays and mobile bandwidth constraints.',
                            'WebP (developed by Google) combines lossy transform coding derived from the VP8 video codec with predictive lossless coding. It supports 24-bit RGB color with an 8-bit alpha transparency channel, producing files that are 25–35% smaller than comparable JPEGs and PNGs.',
                            'AVIF (AV1 Image File Format) represents the cutting edge of image compression. Utilizing the open-source AV1 video codec standard, AVIF achieves up to 50% better compression than JPEG, supports High Dynamic Range (HDR), 10-bit and 12-bit color depths, and wide color gamuts (BT.2020). Converting your website assets to WebP or AVIF ensures modern browser compatibility and top-tier page load speeds.',
                        ],
                        keyTakeaways: [
                            'WebP delivers ~30% smaller files than JPEG with native alpha transparency support.',
                            'AVIF offers state-of-the-art compression and 10-bit/12-bit HDR color depth.',
                            'All modern browsers (Chrome, Safari, Firefox, Edge) now natively support WebP and AVIF.',
                        ],
                    },
                    {
                        badge: 'Color Channels',
                        title: 'Alpha Channel Transparency & Bit Depth Explained',
                        paragraphs: [
                            'Standard 24-bit JPEG images store three 8-bit color channels: Red, Green, and Blue (RGB), allowing for 16.7 million colors. However, JPEG lacks an alpha channel, meaning transparent pixels are automatically flattened onto a solid background (typically white or black).',
                            '32-bit PNG and WebP formats include an additional 8-bit Alpha channel (RGBA), storing 256 levels of opacity per pixel. When converting from transparent PNG to JPEG, always be aware that transparency will be filled with a solid background color, whereas converting PNG to WebP or AVIF fully preserves transparent cutouts.',
                        ],
                        keyTakeaways: [
                            'Converting transparent PNG to JPG will replace transparency with a solid white background.',
                            'Converting PNG to WebP maintains transparent alpha channels with smaller file sizes.',
                            'Use PNG or WebP for logos, UI icons, and background cutouts.',
                        ],
                    },
                    {
                        badge: 'Mobile Media',
                        title: 'Converting iPhone HEIC Photos to Universal JPEG',
                        paragraphs: [
                            'Modern Apple devices capture photos in High Efficiency Image Container (HEIC/HEIF) format. While HEIC offers excellent compression on iOS, many Windows computers, Android phones, and web upload portals cannot open or preview HEIC files.',
                            'ResizeMe provides instant client-side decoding of HEIC files into standard JPEG or PNG, allowing seamless sharing and document submission across all operating systems.',
                        ],
                        keyTakeaways: [
                            'HEIC is Apple’s proprietary container format optimized for iOS camera sensors.',
                            'Converting HEIC to JPG enables universal compatibility on Windows, Linux, and Android.',
                            'Batch conversion allows quick processing of multiple camera roll dumps.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Input Formats', value: 'JPG, JPEG, PNG, WebP, AVIF, HEIC, GIF, BMP, SVG' },
                    { label: 'Output Formats', value: 'JPG, PNG, WebP, AVIF, GIF' },
                    { label: 'Color Space Preservation', value: 'sRGB, Display P3, Adobe RGB profile mapping' },
                    { label: 'Bit Depth Support', value: '8-bit, 24-bit RGB, 32-bit RGBA with Alpha' },
                    { label: 'Batch Processing Limit', value: 'Up to 50 files simultaneously' },
                    { label: 'Privacy & Security', value: 'Transient in-memory processing, zero file logging' },
                ]}
                relatedUseCases={[
                    {
                        title: 'Web Asset Modernization',
                        description: 'Convert legacy PNG and JPG site assets into modern WebP files to cut hosting bandwidth by 40%.',
                    },
                    {
                        title: 'iPhone Photo Compatibility',
                        description: 'Convert HEIC snapshots taken on iPhone into universally viewable JPGs for school and work submissions.',
                    },
                    {
                        title: 'Transparent Logo Delivery',
                        description: 'Convert complex PNG brand graphics into lightweight WebP graphics with full alpha transparency.',
                    },
                ]}
                faqs={[
                    {
                        question: 'What is the best image format for websites?',
                        answer: 'WebP is currently the industry standard for websites, supported by over 97% of global web browsers. It provides superior compression over JPEG and PNG while fully supporting transparency and animation.',
                    },
                    {
                        question: 'Will converting PNG to JPG lose quality?',
                        answer: 'Converting from PNG to JPG applies lossy compression and removes transparent backgrounds (replacing them with white). For lossless graphics with transparency, converting PNG to WebP or keeping PNG is recommended.',
                    },
                    {
                        question: 'Can I convert HEIC photos from my iPhone?',
                        answer: 'Yes! Our converter natively decodes Apple HEIC files and converts them into standard JPEG or PNG format for easy sharing on Windows and Android.',
                    },
                    {
                        question: 'Can I convert multiple files to different formats in bulk?',
                        answer: 'Yes. You can upload multiple files at once, select your target output format, convert them simultaneously, and download a single organized ZIP folder.',
                    },
                ]}
            />

            <ToolRecommendations currentTool="convert" />
        </>
    );
}

