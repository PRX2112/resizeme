import CropTool from '@/components/tools/CropTool';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Instagram Story Image Resizer - Crop to 9:16 Ratio',
    description: 'Resize and crop your photos for Instagram Stories online for free. Convert to the perfect 1080x1920 px and 9:16 aspect ratio with absolute privacy.',
    alternates: { canonical: '/instagram-story-resize' }
};

export default function InstagramStoryResizePage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the perfect size for an Instagram Story?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The perfect and recommended size for an Instagram Story is 1080 pixels wide by 1920 pixels high, which corresponds exactly to an aspect ratio of 9:16."
                }
            },
            {
                "@type": "Question",
                "name": "Why do my photos look blurry when posted to Instagram Stories?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Instagram automatically compresses files that exceed standard dimensions or are in the wrong aspect ratio. Cropping your image to 9:16 and exporting as a high-quality JPG or PNG using our tool avoids aggressive platform scaling."
                }
            },
            {
                "@type": "Question",
                "name": "Is my image private when uploading here?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! ResizeMe operates 100% locally on your computer/phone. Your photos are never sent or stored on a database server, so your private content remains completely safe."
                }
            }
        ]
    };

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "ResizeMe Instagram Resizer",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "1280",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            }} />
            <JsonLd data={faqSchema} />

            <CropTool title="Instagram Story Resizer" />

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
                        Instagram Story Image Resizer – Crop & Scale Free
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Make your portrait shots fit perfectly. Use our private cropper to lock the aspect ratio to 9:16, eliminate awkward crops, and keep your stories pixel-perfect.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instagram Dimensions Guide</h2>
                        <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            <p>To avoid default cropping or blur on Instagram, optimize your uploads with these exact guidelines:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Stories & Reels Ratio</strong> — Always use <strong>9:16</strong> (Portrait).</li>
                                <li><strong>Optimal Story Resolution</strong> — <strong>1080 × 1920 pixels</strong>.</li>
                                <li><strong>Instagram Grid Square</strong> — <strong>1080 × 1080 pixels</strong> (1:1 aspect ratio).</li>
                                <li><strong>Instagram Grid Portrait</strong> — <strong>1080 × 1350 pixels</strong> (4:5 aspect ratio).</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Avoiding Instagram Quality Loss</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you upload a huge 5MB raw DSLR photograph or a file with irregular ratios, Instagram's background engines aggressively compress it, resulting in pixelation.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                            By cropping it beforehand to a clean 9:16 ratio and compressing the file below 1MB, you bypass Instagram's harsh re-encoding and maintain high visual fidelity.
                        </p>
                    </section>
                </div>

                <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">Can I select mobile aspect ratio preset?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Yes! Inside our editor, click on the "Mobile (9:16)" aspect ratio preset under the controls panel. It locks the selector exactly to the Instagram Story shape so you can crop with perfect precision.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">Is there any watermark on my downloaded story?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                No. All crops are 100% free, high-quality, and clean. We never add overlays or watermarks to your personal content.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 rounded-xl p-6 space-y-2">
                    <h3 className="font-bold text-gray-950 dark:text-white">Related Tools</h3>
                    <div className="flex flex-wrap gap-3">
                        <a href="/resize-image-for-instagram" className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-semibold">Instagram Resize Guide</a>
                        <a href="/tools/resize" className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-semibold">Standard Resizer</a>
                        <a href="/tools/compress" className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-semibold">File Compressor</a>
                    </div>
                </div>
            </div>
        </>
    );
}
