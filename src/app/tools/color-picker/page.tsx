import ColorPickerTool from '@/components/tools/ColorPickerTool';
import { Metadata } from 'next';
import ToolRecommendations from '@/components/ToolRecommendations';
import ToolContentSection from '@/components/shared/ToolContentSection';

export const metadata: Metadata = {
    title: 'Image Color Picker Online Free - HEX, RGB, HSL Palette Extractor',
    description: 'Pick and extract colors from any image online with a pixel-level magnifier loupe. Get HEX, RGB, and HSL color codes and build downloadable palettes.',
    alternates: {
        canonical: '/tools/color-picker',
    },
};

export default function ColorPickerPage() {
    return (
        <>
            <ColorPickerTool title="Color Picker" />

            <ToolContentSection
                title="Image Color Picker"
                subtitle="Color Theory, Digital Color Spaces & Pixel Loupe Sampling"
                description="Extract exact color codes from any digital graphic, illustration, or photograph. Use the high-precision pixel magnifier loupe to sample sub-pixels, generate cohesive UI design palettes, and copy HEX, RGB, and HSL values with one click."
                canonicalUrl="https://resizeme.in/tools/color-picker"
                howToSteps={[
                    {
                        step: 1,
                        title: 'Upload Any Image',
                        text: 'Drag and drop your photo, website mockup, or brand graphic onto the canvas.',
                    },
                    {
                        step: 2,
                        title: 'Hover with Magnifier Loupe',
                        text: 'Move the cursor over target pixels — the real-time loupe enlarges the area by up to 10× for sub-pixel accuracy.',
                    },
                    {
                        step: 3,
                        title: 'Click to Sample Color',
                        text: 'Click on any pixel to lock its color values and add it to your active palette history buffer.',
                    },
                    {
                        step: 4,
                        title: 'Copy Color Code Formats',
                        text: 'Instantly copy CSS HEX (#RRGGBB), RGB (r, g, b), or HSL (h, s%, l%) codes to your clipboard.',
                    },
                ]}
                features={[
                    {
                        title: '10× Pixel Magnifier Loupe',
                        description: 'A circular zoom loupe provides pixel-grid precision for picking fine 1px strokes and border lines.',
                    },
                    {
                        title: 'Multi-Format Color Output',
                        description: 'Instant conversion between HEX, RGB, RGBA, and HSL color models formatted for web and mobile development.',
                    },
                    {
                        title: 'Palette History Swatches',
                        description: 'Automatically saves recently sampled colors into an interactive swatch bar for quick palette curation.',
                    },
                    {
                        title: 'One-Click Clipboard Copying',
                        description: 'Copy individual color codes or entire palette arrays formatted directly for Tailwind CSS and CSS variables.',
                    },
                    {
                        title: 'Sub-Pixel Accurate Sampling',
                        description: 'Direct canvas ImageData pixel buffer reading eliminates OS-level color shift and compression tinting.',
                    },
                    {
                        title: '100% In-Browser Execution',
                        description: 'All color parsing executes locally in your browser without uploading private brand assets to remote servers.',
                    },
                ]}
                educationalSections={[
                    {
                        badge: 'Color Science',
                        title: 'Understanding Digital Color Spaces: RGB, HEX, HSL & sRGB Gamuts',
                        paragraphs: [
                            'Digital color representation relies on additive color theory, where red, green, and blue light combine at varying intensities to produce the full spectrum of visible screen colors.',
                            'RGB (Red, Green, Blue) specifies integer intensities from 0 to 255 across 8-bit channels. Hexadecimal (HEX) notation is simply the base-16 alphanumeric representation of these three byte values (e.g. RGB(59, 130, 246) = #3B82F6).',
                            'HSL (Hue, Saturation, Lightness) offers an intuitive cylindrical coordinate representation: Hue represents the color angle around the 360° color wheel (0° Red, 120° Green, 240° Blue), Saturation represents color purity (0% gray to 100% full saturation), and Lightness controls illumination (0% black, 50% normal, 100% pure white). Web developers frequently use HSL to create cohesive hover states and dark-mode tints by simply adjusting lightness percentages.',
                        ],
                        keyTakeaways: [
                            'HEX is the base-16 shorthand for 8-bit RGB color channels.',
                            'HSL separates color identity (Hue) from intensity and brightness.',
                            'Adjusting HSL Lightness makes creating UI dark modes and hover states effortless.',
                        ],
                    },
                    {
                        badge: 'Accessibility (a11y)',
                        title: 'WCAG Color Contrast Guidelines for Web Accessibility',
                        paragraphs: [
                            'The Web Content Accessibility Guidelines (WCAG 2.1) require adequate luminance contrast between foreground text and background colors to ensure legibility for users with visual impairments or color blindness.',
                            'WCAG Level AA requires a minimum contrast ratio of 4.5:1 for normal body text and 3:1 for large headers (18pt+). WCAG Level AAA requires a strict 7:1 contrast ratio. When sampling colors for web interfaces, always test the extracted background hex code against your brand text color to guarantee compliance.',
                        ],
                        keyTakeaways: [
                            'WCAG AA requires a 4.5:1 contrast ratio for body text against backgrounds.',
                            'WCAG AAA requires 7:1 contrast for high-accessibility standards.',
                            'Sample background and foreground colors to verify accessibility before coding.',
                        ],
                    },
                    {
                        badge: 'Canvas Architecture',
                        title: 'How Browser Eyedroppers Sample Raw Pixel Buffers',
                        paragraphs: [
                            'When an image is loaded into an HTML5 Canvas, the browser allocates a flat 1D `Uint8ClampedArray` inside `ctx.getImageData()`. Every individual pixel occupies four consecutive array indices: `[R, G, B, A]`.',
                            'The color picker calculates the memory offset index using `index = (y * image_width + x) * 4`. This direct memory access guarantees instantaneous, lag-free color identification down to the single pixel without browser latency.',
                        ],
                        keyTakeaways: [
                            'ImageData buffers provide raw 8-bit color arrays directly from local RAM.',
                            'Sub-pixel coordinate calculation eliminates color distortion.',
                            'Zero server latency enables instantaneous magnifier loupe tracking.',
                        ],
                    },
                ]}
                technicalSpecsTable={[
                    { label: 'Sampling Engine', value: 'HTML5 Canvas 2D Uint8ClampedArray Buffer' },
                    { label: 'Magnifier Zoom Power', value: 'Up to 10× real-time loupe magnification' },
                    { label: 'Supported Color Formats', value: 'HEX (#RRGGBB), RGB(r, g, b), HSL(h, s%, l%), RGBA' },
                    { label: 'Color Depth Support', value: '24-bit TrueColor + 8-bit Alpha transparency channel' },
                    { label: 'Palette Buffer Capacity', value: 'Recent history swatch memory' },
                    { label: 'Privacy & Storage', value: '100% Client-Side memory execution' },
                ]}
                relatedUseCases={[
                    {
                        title: 'UI/UX Design Palette Creation',
                        description: 'Extract brand colors from inspirational photos, nature scenes, or moodboards to build UI design systems.',
                    },
                    {
                        title: 'Web Development & CSS Variables',
                        description: 'Grab exact button, border, and background hex codes from design mockups and Figma screenshot exports.',
                    },
                    {
                        title: 'Digital Art & Illustration',
                        description: 'Sample authentic color harmonies from master paintings and photography for custom digital brushes.',
                    },
                ]}
                faqs={[
                    {
                        question: 'How do I pick an exact single pixel?',
                        answer: 'Use the live magnifier loupe that appears as you hover over your image. The loupe zooms in by up to 10× and highlights the center crosshair pixel with its real-time HEX code.',
                    },
                    {
                        question: 'What is the difference between RGB and HSL?',
                        answer: 'RGB defines colors by red, green, and blue light intensity (0-255). HSL defines colors by Hue angle (0-360°), Saturation percentage (0-100%), and Lightness percentage (0-100%), which is much more intuitive for making color variations.',
                    },
                    {
                        question: 'Can I copy the extracted colors to my clipboard?',
                        answer: 'Yes! Simply click on any color swatch or value box to copy the formatted HEX, RGB, or HSL code directly to your operating system clipboard.',
                    },
                    {
                        question: 'Does this tool work with transparent PNG or WebP images?',
                        answer: 'Yes. The color picker reads full 32-bit RGBA channels, detecting transparent pixels and displaying alpha opacity percentages.',
                    },
                ]}
            />
        </>
    );
}

