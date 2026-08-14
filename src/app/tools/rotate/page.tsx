import RotateTool from '@/components/tools/RotateTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Rotate Image Online Free - 90, 180, 270 Degrees & Custom Angles',
    description: 'Rotate images online for free. Fix sideways or upside-down photos with 90° clockwise/counter-clockwise turns or custom precision angle adjustments.',
    alternates: {
        canonical: '/tools/rotate',
    },
};

export default function RotatePage() {
    return (
        <>
            <RotateTool title="Rotate Image" />

            <ToolContentSection
                title="Image Rotator"
                subtitle="EXIF Orientation, Coordinate Transforms & Custom Angle Rotation"
                description="Fix sideways or upside-down smartphone photos and apply fine-tuned angular corrections. Rotate in 90-degree orthogonal increments or dial in custom fractional angles with smart bounding-box expansion and transparent canvas padding."
                canonicalUrl="https://resizeme.in/tools/rotate"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Upload Sideways Photo',
                        text: 'Drag and drop your image (JPG, PNG, WebP) into the rotator workspace.',
                    },
                    {
                        step: 2,
                        title: 'Choose 90° Turn or Custom Angle',
                        text: 'Click Rotate Left (-90°), Rotate Right (+90°), or drag the custom angle slider from -180° to +180°.',
                    },
                    {
                        step: 3,
                        title: 'Select Background Fill Mode',
                        text: 'Choose transparent canvas fill (for PNG/WebP) or pick a solid background color for rotated corners.',
                    },
                    {
                        step: 4,
                        title: 'Download Corrected Image',
                        text: 'Export your properly oriented photo with updated EXIF tags and crisp pixel clarity.',
                    },
                ]}
                features={[
                    {
                        title: 'One-Click 90° & 180° Turns',
                        description: 'Instant orthogonal rotations that swap coordinate axes with zero resampling loss or visual artifacts.',
                    },
                    {
                        title: 'Fine-Tuned Precision Angle Slider',
                        description: 'Straighten crooked horizons, architecture, or skewed document scans with 0.1° fractional angle control.',
                    },
                    {
                        title: 'Automated Bounding Box Expansion',
                        description: 'Dynamically recalculates canvas width and height to prevent cropped corners during custom rotations.',
                    },
                    {
                        title: 'Smart Corner Fill Options',
                        description: 'Supports transparent alpha fill for PNGs or customizable solid color background fills for JPEGs.',
                    },
                    {
                        title: 'EXIF Orientation Tag Reset',
                        description: 'Permanently bakes physical pixel rotation and resets confusing EXIF orientation metadata tags.',
                    },
                    {
                        title: '100% Client-Side Privacy',
                        description: 'Rotations execute in your local device browser memory with zero server uploads or logging.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Metadata Engineering',
                        title: 'EXIF Orientation Tags: Why Smartphone Photos Appear Sideways on Desktops',
                        paragraphs: [
                            'When you take a photo with a smartphone held vertically or sideways, modern cameras do not physically rearrange the pixels in the image sensor array. Instead, they record raw horizontal pixel data and attach an EXIF (Exchangeable Image File Format) Orientation flag (values 1 through 8) in the file metadata.',
                            'While mobile gallery apps read this flag and display the photo upright, many older desktop image viewers, web browsers, and document upload portals ignore EXIF metadata, causing your photos to appear flipped sideways or upside down. Rotating your image through ResizeMe rewrites the physical 2D pixel array and resets the EXIF tag to 1 (Normal), guaranteeing identical upright orientation across every application and operating system in the world.',
                        ],
                        keyTakeaways: [
                            'Smartphones use EXIF tags 1-8 to signal camera orientation rather than rotating pixels.',
                            'Many web forms ignore EXIF, causing images to display sideways.',
                            'Physical raster rotation permanently bakes correct orientation into the pixel buffer.',
                        ],
                    },
                    {
                        badge: 'Mathematics & Canvas',
                        title: 'Affine Transformation Matrices and Trigonometric Canvas Rotation',
                        paragraphs: [
                            'Rotating an image by an arbitrary angle θ requires 2D affine coordinate transformation mathematics. Every pixel at coordinate (x, y) is mapped to new coordinate (x\', y\') using the standard rotation matrix: x\' = x cos(θ) - y sin(θ) and y\' = x sin(θ) + y cos(θ).',
                            'When rotating by non-orthogonal angles (e.g. 15° or 45°), the bounding rectangle containing the diamond-shaped rotated image expands. The new canvas dimensions are calculated as: new_width = |width × cos(θ)| + |height × sin(θ)| and new_height = |width × sin(θ)| + |height × cos(θ)|. ResizeMe dynamically resizes the target canvas buffer to prevent accidental clipping of corner details.',
                        ],
                        keyTakeaways: [
                            'Trigonometric rotation transforms coordinate matrices around the image centroid.',
                            'Bounding-box expansion prevents corners from being clipped outside canvas boundaries.',
                            'Sub-pixel anti-aliasing maintains smooth diagonal lines after angular rotation.',
                        ],
                    },
                    {
                        badge: 'Document Processing',
                        title: 'Straightening Skewed Document Scans & Receipts',
                        paragraphs: [
                            'Physical paperwork, contracts, receipts, and book pages scanned via mobile cameras are frequently misaligned by 1 to 5 degrees. This angular skew interferes with Optical Character Recognition (OCR) software accuracy.',
                            'Using our fine-tuned custom angle slider, you can apply micro-rotations to level horizontal text baselines, significantly improving OCR text recognition accuracy.',
                        ],
                        keyTakeaways: [
                            'Minor 1°-3° angular corrections level tilted book pages and receipts.',
                            'Level document baselines dramatically increase OCR text extraction accuracy.',
                            'Export as high-contrast PNG for optimal document legibility.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Rotation Precision', value: '0.1° fractional angle increments (-180° to +180°)' },
                    { label: 'Orthogonal Presets', value: '90° Clockwise, 90° Counter-Clockwise, 180° Flip' },
                    { label: 'Bounding Box Logic', value: 'Dynamic trigonometric expansion (auto-fit)' },
                    { label: 'Corner Background Modes', value: 'Alpha Transparent (PNG/WebP), Solid Color (JPEG)' },
                    { label: 'EXIF Tag Handling', value: 'Resets Orientation Flag to 1 (Top-Left Standard)' },
                    { label: 'Privacy & Storage', value: '100% In-browser ephemeral memory execution' },
                ]}
                relatedUseCases={[
                    {
                        title: 'Fixing Sideways Mobile Uploads',
                        description: 'Permanently correct orientation for photos uploaded to government portals, school portals, or real estate listings.',
                    },
                    {
                        title: 'Document & Receipt Straightening',
                        description: 'Straighten crooked mobile camera document scans before PDF conversion or expense archiving.',
                    },
                    {
                        title: 'Creative Artistic Tilts',
                        description: 'Apply dramatic 45-degree dutch angle rotations to graphic banners, social cards, and album artwork.',
                    },
                ]}
                faqs={[
                    {
                        question: 'Why do my photos appear sideways when uploaded to websites?',
                        answer: 'Smartphones store camera tilt as an EXIF metadata flag rather than physically rotating the pixel grid. Many website forms ignore this flag. Our tool physically re-encodes the pixels upright and resets the EXIF flag so it displays correctly everywhere.',
                    },
                    {
                        question: 'Does a standard 90-degree rotation cause quality loss?',
                        answer: 'No. 90-degree and 180-degree orthogonal rotations simply transpose rows and columns in the pixel coordinate matrix with zero resampling interpolation loss.',
                    },
                    {
                        question: 'What happens to empty corner spaces during custom angle rotation?',
                        answer: 'When you rotate by custom angles (e.g. 25°), the canvas expands to prevent clipping. You can keep the newly revealed corner space transparent (PNG/WebP) or fill it with a matching background color.',
                    },
                    {
                        question: 'Can I straighten an image by a tiny fraction of a degree?',
                        answer: 'Yes! Our custom slider allows precision adjustments down to 0.1 degree increments to straighten slightly tilted horizon lines and documents.',
                    },
                ]}
            />

            <ToolRecommendations currentTool="rotate" />
        </>
    );
}

