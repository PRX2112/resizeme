import CompressTool from '@/components/tools/CompressTool';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'YouTube Thumbnail Image Compressor - Compress Under 2MB',
    description: 'Compress and optimize your YouTube thumbnails online for free. Keep dimensions at 1280x720 and shrink file sizes under YouTube\'s strict 2MB limit.',
    alternates: { canonical: '/youtube-thumbnail-compressor' },
    robots: {
        index: false,
        follow: true,
    },
};

export default function YouTubeThumbnailCompressorPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the maximum file size for a YouTube thumbnail?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "YouTube has a strict maximum file size limit of 2MB for all thumbnail uploads. If your file is even slightly over 2.0MB, YouTube will reject the upload with an error."
                }
            },
            {
                "@type": "Question",
                "name": "What are the recommended dimensions for YouTube thumbnails?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The recommended dimensions are 1280 pixels wide by 720 pixels high (with a minimum width of 640 pixels). This matches an aspect ratio of 16:9."
                }
            },
            {
                "@type": "Question",
                "name": "Does this tool support high quality export?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our compression algorithms are tuned to preserve text readability, vivid contrast, and fine lines (essential for thumbnail click-through rates) while reducing heavy files to under 2MB."
                }
            }
        ]
    };

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "ResizeMe YouTube Compressor",
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
                    "ratingCount": "980",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            }} />
            <JsonLd data={faqSchema} />

            <CompressTool title="YouTube Thumbnail Compressor" />

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent">
                        YouTube Thumbnail Compressor – Keep 16:9 Free
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Got a "file size is too large" error when uploading a thumbnail? Compress heavy PNGs or high-quality exports to under 2MB instantly without losing crisp overlay text.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">YouTube Thumbnail Specifications</h2>
                        <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            <p>For high conversions and instant portal approvals, stick to these exact parameters:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Maximum File Limit</strong> — Must be strictly <strong>under 2 MB</strong>.</li>
                                <li><strong>Recommended Dimensions</strong> — <strong>1280 × 720 pixels</strong>.</li>
                                <li><strong>Aspect Ratio Standard</strong> — <strong>16:9</strong> (Landscape widescreen).</li>
                                <li><strong>Accepted Formats</strong> — JPG, PNG, GIF, or WebP.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Strategies to Bypass the 2MB Error</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Photoshop and Canva high-res exports are frequently in PNG format, which can easily reach 3MB to 5MB.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                            Simply convert your PNG to JPG or WebP and adjust quality to 80-85%. The file size will drop from 4MB to around 300KB with zero visible difference on mobile or desktop feeds, keeping your thumbnail highly eye-catching.
                        </p>
                    </section>
                </div>

                <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">How can I check the slider quality?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Our split comparison slider lets you drag and inspect original vs compressed views in real time! You can zoom in and verify that your thumbnail's overlay text and graphic designs remain sharp.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">Are my thumbnails stored in the cloud?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                No. All compression routines are executed inside your browser or securely processed inside transient in-memory memory blocks that are discarded instantly. Your media files remain 100% yours.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl p-6 space-y-2">
                    <h3 className="font-bold text-gray-950 dark:text-white">Related Tools</h3>
                    <div className="flex flex-wrap gap-3">
                        <a href="/resize-image-for-youtube" className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold">YouTube Size Guide</a>
                        <a href="/tools/compress" className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold">Image Compressor</a>
                        <a href="/tools/resize" className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold">Resize Tool</a>
                    </div>
                </div>
            </div>
        </>
    );
}
