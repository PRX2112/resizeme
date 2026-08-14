

import CropTool from '@/components/tools/CropTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Crop Image Online Free - Custom Ratios & Social Media Presets',
    description: 'Crop JPG, PNG, and WebP photos online for free. Use presets for Instagram (1:1, 4:5), YouTube (16:9), and freeform bounding box cropping.',
    alternates: {
        canonical: '/tools/crop',
    },
};

export default function CropPage() {
    return (
        <>
            <CropTool title="Crop Image" />

            <ToolContentSection
                title="Image Cropper"
                subtitle="Mastering Image Composition, Framing & Aspect Ratio Cropping"
                description="Refine your visual storytelling and composition with precision cropping. Eliminate distracting background elements, center key subjects with photographic framing rules, and format your photos for social media platforms."
                canonicalUrl="https://resizeme.in/tools/crop"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Upload Your Photo',
                        text: 'Drag and drop your image into the interactive cropper interface.',
                    },
                    {
                        step: 2,
                        title: 'Select Aspect Ratio Preset',
                        text: 'Choose standard dimensions (1:1 Square, 16:9 Landscape, 4:5 Portrait, 9:16 Story) or choose Freeform.',
                    },
                    {
                        step: 3,
                        title: 'Adjust Framing Bounding Box',
                        text: 'Drag corner handles or pan the selection over your focal point to compose the ideal frame.',
                    },
                    {
                        step: 4,
                        title: 'Crop & Export',
                        text: 'Click Apply Crop to extract the sub-region with lossless pixel accuracy and save your photo.',
                    },
                ]}
                features={[
                    {
                        title: 'Social Media Ratio Presets',
                        description: 'Instant 1-click crop boxes calibrated for Instagram Posts, YouTube Thumbnails, TikTok, and LinkedIn covers.',
                    },
                    {
                        title: 'Freeform Bounding Box',
                        description: 'Manually drag handles across any X/Y coordinates to isolate custom rectangular zones without ratio constraints.',
                    },
                    {
                        title: 'Zero Re-compression Degradation',
                        description: 'Extracts exact source pixels with maximum clarity and lossless coordinate slicing.',
                    },
                    {
                        title: 'High-Precision Pixel Coordinates',
                        description: 'Displays live width, height, and offset positions for pixel-perfect graphic design requirements.',
                    },
                    {
                        title: 'Touch & Mobile Optimized',
                        description: 'Responsive multi-touch pinch, zoom, and drag handles designed for smartphones and tablets.',
                    },
                    {
                        title: '100% In-Browser Privacy',
                        description: 'Cropping runs locally on your browser canvas without uploading private media to any remote server.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Photographic Theory',
                        title: 'Compositional Rules: Rule of Thirds, Golden Ratio & Visual Balance',
                        paragraphs: [
                            'Cropping is one of the most powerful post-processing techniques available to photographers and designers. By adjusting the frame boundary, you alter the narrative weight and eye trajectory across the image.',
                            'The Rule of Thirds divides the image into a 3×3 grid with two horizontal and two vertical lines. Placing your primary subject or horizon line along these gridlines or at their four intersections creates natural tension, energy, and visual interest compared to simple static centering.',
                            'For portrait photography, cropping closer to eye level eliminates dead headroom and draws viewers into emotional eye contact. In product marketing, cropping out distracting studio equipment or unaligned shadows elevates brand trustworthiness.',
                        ],
                        keyTakeaways: [
                            'Align key facial features or horizons along third-grid intersections for dynamic balance.',
                            'Eliminate peripheral visual clutter to amplify subject prominence.',
                            'Vertical 4:5 crops maximize screen real estate on mobile social feeds.',
                        ],
                    },
                    {
                        badge: 'Platform Guidelines',
                        title: 'Social Media Dimensions Cheat Sheet (2026 Standards)',
                        paragraphs: [
                            'Each major social media network enforces strict aspect ratio rules to ensure uniform presentation in algorithm feeds.',
                            'Instagram Feed: 1:1 (1080×1080px square) or 4:5 (1080×1350px portrait). The vertical 4:5 format occupies up to 30% more screen space on mobile feeds than landscape photos, resulting in higher user engagement and dwell time.',
                            'Instagram Stories & TikTok / Reels: 9:16 (1080×1920px vertical full-screen).',
                            'YouTube Thumbnails & Twitter / X Headers: 16:9 (1280×720px / 1920×1080px landscape widescreen).',
                            'LinkedIn Profile Banners: 4:1 (1584×396px panoramic banner) and 1:1 for headshots.',
                        ],
                        keyTakeaways: [
                            'Use 4:5 for Instagram posts to occupy maximum mobile viewport height.',
                            'Use 16:9 for YouTube video thumbnails and web presentation slides.',
                            'Always preview crops at target display resolutions before publishing.',
                        ],
                    },
                    {
                        badge: 'Pixel Integrity',
                        title: 'Coordinate Clipping vs Image Resizing: The Technical Difference',
                        paragraphs: [
                            'Users frequently confuse resizing with cropping. Resizing changes the scale of all pixels in the entire image simultaneously, preserving the full visible field of view.',
                            'Cropping extracts an exact rectangular subsection [x, y, width, height] and discards unselected border pixels. Because remaining pixels are not stretched or squished, their internal clarity and edge sharpness remain mathematically identical to the source photograph.',
                        ],
                        keyTakeaways: [
                            'Cropping preserves native pixel clarity for the selected sub-region.',
                            'Resizing scales the entire canvas field of view.',
                            'Combine crop and resize to achieve both ideal framing and specific target file limits.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Cropping Engine', value: 'HTML5 2D Canvas coordinate matrix slicing' },
                    { label: 'Preset Aspect Ratios', value: '1:1, 16:9, 4:5, 9:16, 4:3, 3:2, 2:3, Freeform' },
                    { label: 'Coordinate Accuracy', value: 'Sub-pixel floating point precision' },
                    { label: 'Supported Input Formats', value: 'JPG, JPEG, PNG, WebP, AVIF, GIF, HEIC' },
                    { label: 'Alpha Channel Support', value: 'Preserved for transparent PNG and WebP assets' },
                    { label: 'Privacy & Storage', value: '100% Client-Side browser memory execution' },
                ]}
                relatedUseCases={[
                    {
                        title: 'Social Media Feed Alignment',
                        description: 'Fit vertical phone camera shots to Instagram 4:5 ratio or TikTok 9:16 full-screen stories.',
                    },
                    {
                        title: 'Professional Headshots',
                        description: 'Crop wide casual photos into clean, focused 1:1 square profile photos for LinkedIn or company directories.',
                    },
                    {
                        title: 'Product Catalog Thumbnails',
                        description: 'Center commercial products and remove messy table borders for Amazon and eBay storefronts.',
                    },
                ]}
                faqs={[
                    {
                        question: 'Does cropping reduce the resolution of my photo?',
                        answer: 'Cropping removes outside pixels, which naturally reduces the total pixel dimensions (e.g. from 4000×3000 to 2000×2000). However, the remaining pixels keep 100% of their original sharpness and detail without any downscaling degradation.',
                    },
                    {
                        question: 'Can I crop with a custom ratio not listed in presets?',
                        answer: 'Yes! Select the "Freeform" mode to drag each side or corner of the crop frame freely to match any custom dimensions you need.',
                    },
                    {
                        question: 'What is the best aspect ratio for Instagram posts?',
                        answer: 'The 4:5 vertical portrait aspect ratio (1080×1350 pixels) is optimal because it fills the entire mobile phone screen as users scroll through their feed.',
                    },
                    {
                        question: 'Will cropping remove my PNG background transparency?',
                        answer: 'No. Our cropper retains all transparent alpha channel data when exporting PNG or WebP files.',
                    },
                ]}
            />
        </>
    );
}

