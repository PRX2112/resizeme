

import ResizeTool from '@/components/tools/ResizeTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Resize Image Online Free - Change Dimensions, Pixels & File Size',
    description: 'Resize JPG, PNG, WebP, and AVIF images online for free. Adjust pixel dimensions, scale percentages, maintain aspect ratios with Lanczos3 interpolation.',
    alternates: {
        canonical: '/tools/resize',
    },
};

export default function ResizePage() {
    return (
        <>
            <ResizeTool title="Resize Image" />

            <ToolContentSection
                title="Image Resizer"
                subtitle="The Ultimate Guide to Resizing Images Online: Dimensions, DPI & Interpolation"
                description="Resize digital images with mathematical precision. Whether you need exact pixel dimensions for an e-commerce store, social media banners, or responsive web development, our tool provides lossless downsampling and high-fidelity scaling directly in your browser."
                canonicalUrl="https://resizeme.in/tools/resize"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Upload Your Image',
                        text: 'Drag and drop or select single or multiple JPG, PNG, WebP, or AVIF files from your device.',
                    },
                    {
                        step: 2,
                        title: 'Set Target Dimensions',
                        text: 'Input width and height in pixels, scale by a percentage (e.g., 50%, 75%), or target a specific file size.',
                    },
                    {
                        step: 3,
                        title: 'Lock Aspect Ratio (Optional)',
                        text: 'Keep the aspect ratio padlock enabled to prevent accidental distortion or stretching of your subject.',
                    },
                    {
                        step: 4,
                        title: 'Process & Download',
                        text: 'Click Resize to process the image with high-speed Lanczos3 resampling and download individually or in a ZIP archive.',
                    },
                ]}
                features={[
                    {
                        title: 'Aspect Ratio Locking',
                        description: 'Automatically calculates proportional height when width changes, ensuring your photos never look squished or skewed.',
                    },
                    {
                        title: 'Percentage & Pixel Modes',
                        description: 'Switch between exact width/height pixel inputs or relative percentage multipliers (25%, 50%, 75%, 200%).',
                    },
                    {
                        title: 'Batch Image Resizing',
                        description: 'Upload and resize dozens of photos simultaneously to the same dimensions with one-click bulk ZIP export.',
                    },
                    {
                        title: 'High-Precision Lanczos3 Kernel',
                        description: 'Uses advanced sinc filtering algorithms for crisp downsampling without moiré artifacts or blurriness.',
                    },
                    {
                        title: 'Universal Format Compatibility',
                        description: 'Full support for modern and legacy formats including JPEG, PNG 24-bit, WebP, and AVIF.',
                    },
                    {
                        title: '100% In-Browser Privacy',
                        description: 'Your photos stay in your local device memory without persistent server storage or third-party access.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Display Engineering',
                        title: 'Understanding Pixels, Resolution, and Screen Densities (DPI/PPI)',
                        paragraphs: [
                            'Digital images are composed of discrete picture elements called pixels. An image measuring 1920×1080 contains over 2 million individual pixels. When preparing images for modern screens, understanding display pixel density (PPI or Pixels Per Inch) is critical.',
                            'Modern smartphones and high-resolution displays (such as Apple Retina displays) feature 2x and 3x device pixel ratios (DPR). This means that a visual container of 400×300 CSS pixels actually requires an 800×600 or 1200×900 image to render with tack-sharp clarity. Resizing your source images to exact 2x dimensions ensures maximum visual crispness without transferring bloated file sizes over mobile networks.',
                            'For print media, Dots Per Inch (DPI) determines output fidelity. While web browsers ignore DPI tags and render strictly by raw pixel dimensions, desktop publishers targeting standard 300 DPI print quality must calculate required dimensions: an 8×10 inch photograph at 300 DPI requires an exact resolution of 2400×3000 pixels.',
                        ],
                        keyTakeaways: [
                            'Web browsers render by pixel count, ignoring embedded DPI metadata tags.',
                            'Retina (2x/3x DPR) screens require double the visual CSS resolution for optimal crispness.',
                            'Print publishing standard is 300 DPI: calculate pixels = (inches × 300).',
                        ],
                    },
                    {
                        badge: 'Algorithmic Resampling',
                        title: 'Interpolation Algorithms: Lanczos3 vs Bicubic vs Nearest Neighbor',
                        paragraphs: [
                            'When an image is scaled down or enlarged, an interpolation kernel computes the color values of newly formed pixels based on existing neighboring pixels.',
                            'Nearest Neighbor is the simplest method, copying the closest pixel directly. While extremely fast and ideal for retro pixel art, it causes severe jagged stair-stepping (aliasing) on photographic content.',
                            'Bilinear and Bicubic interpolation calculate weighted averages of 4 to 16 surrounding pixels using polynomial splines. This creates smoother gradients but can introduce mild blurring on sharp edges.',
                            'ResizeMe implements Lanczos3 resampling, an 8-lobed sinc filter that preserves fine contrast transitions, edge sharpness, and subtle textures while eliminating ringing and moiré patterns when downsampling high-resolution camera photos.',
                        ],
                        keyTakeaways: [
                            'Nearest Neighbor creates jagged edges on photos but is great for pixel art.',
                            'Bicubic provides smooth transitions for gentle photographic gradients.',
                            'Lanczos3 delivers the highest edge fidelity and sharpness during downscaling.',
                        ],
                    },
                    {
                        badge: 'Web Performance',
                        title: 'Aspect Ratio Math & Responsive Layout Optimization',
                        paragraphs: [
                            'Maintaining proper aspect ratios prevents layout shift—a key metric measured by Google Cumulative Layout Shift (CLS). When an image’s width and height ratio is preserved, web browsers can pre-allocate the exact dimensional bounding box before the image finishes downloading.',
                            'Common standard aspect ratios include 16:9 (widescreen video thumbnails), 4:3 (traditional photography), 1:1 (square profile avatars and Instagram grids), and 4:5 (vertical social feeds). Always compute your target dimensions with proportional math: new_height = (new_width × original_height) / original_width.',
                        ],
                        keyTakeaways: [
                            'Proper dimensional resizing directly reduces Google Core Web Vitals (CLS) penalties.',
                            'Locking aspect ratios prevents horizontal/vertical distortion.',
                            'Always serve properly dimensioned images rather than relying on CSS downscaling.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Resampling Algorithm', value: 'Lanczos3 / Bicubic adaptive sinc filtering' },
                    { label: 'Supported Input Formats', value: 'JPG, JPEG, PNG, WebP, AVIF, GIF, BMP, HEIC' },
                    { label: 'Supported Output Formats', value: 'JPG, PNG, WebP, AVIF' },
                    { label: 'Batch Processing Limit', value: 'Up to 50 images per session (ZIP archive download)' },
                    { label: 'Maximum Input Dimensions', value: 'Up to 16,000 × 16,000 pixels (100+ Megapixels)' },
                    { label: 'Memory & Execution', value: 'Local browser HTML5 Canvas + Serverless Sharp stream' },
                ]}
                relatedUseCases={[
                    {
                        title: 'E-Commerce Product Catalogs',
                        description: 'Standardize thousands of supplier photos to uniform 1000×1000 square dimensions for Shopify and Amazon.',
                    },
                    {
                        title: 'Social Media Headers & Avatars',
                        description: 'Resize banners to exact specs for YouTube (2560×1440), Twitter (1500×500), and LinkedIn (1584×396).',
                    },
                    {
                        title: 'Government & Passport Portals',
                        description: 'Reduce applicant photos to strict physical pixel limits (e.g. 600×600) and file constraints (under 100KB).',
                    },
                ]}
                faqs={[
                    {
                        question: 'Does resizing an image reduce its quality?',
                        answer: 'Scaling down (downsampling) actually increases pixel density and perceived sharpness when using high-quality Lanczos3 interpolation. Upscaling (making an image larger) can cause softening if enlarged excessively, which is why we recommend using our specialized AI Enlarge tool for upscaling.',
                    },
                    {
                        question: 'What is the difference between resizing and cropping?',
                        answer: 'Resizing scales the entire image to new dimensions, keeping all visual content intact. Cropping cuts away parts of the outer frame to change the aspect ratio or focus on a specific subject.',
                    },
                    {
                        question: 'Can I resize multiple images at the same time?',
                        answer: 'Yes! You can upload multiple files at once, apply identical target dimensions or percentage multipliers, and download the entire batch in a single compressed ZIP file.',
                    },
                    {
                        question: 'Are my photos uploaded or stored on any server?',
                        answer: 'No. ResizeMe operates with a strict privacy-first architecture. All image data is processed in local browser memory or streamed ephemerally in transient RAM without persistent storage.',
                    },
                ]}
            />
        </>
    );
}

