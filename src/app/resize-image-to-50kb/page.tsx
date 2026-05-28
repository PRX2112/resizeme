import ResizeTool from '@/components/tools/ResizeTool';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Resize Image to 50KB Online - Free Image Compressor',
    description: 'Reduce and resize image files to under 50KB online for free. Works with JPG, PNG, and WebP formats. Safe on-device processing, instant download.',
    alternates: { canonical: '/resize-image-to-50kb' }
};

export default function ResizeTo50KBPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I resize an image to exactly 50KB?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To resize an image to under 50KB, load your file into our on-device resizer. Scale down the pixel dimensions (e.g. to a width of 1000px) and lower the output quality slider to around 60-70%. We recommend exporting in JPG or WebP format for optimal compression sizes."
                }
            },
            {
                "@type": "Question",
                "name": "Is my photo safe when compressing to 50KB?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! All processing runs directly inside your local browser sandbox. Your images are never uploaded to our servers or saved in a remote database, ensuring 100% private conversion."
                }
            },
            {
                "@type": "Question",
                "name": "Why is the target limit exactly 50KB?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many government application portals, banking channels, job portals, and academic admission networks enforce a strict maximum upload limit of 50KB for documents, passport photos, and signatures."
                }
            }
        ]
    };

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "ResizeMe 50KB Optimization Tool",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                }
            }} />
            <JsonLd data={faqSchema} />

            <ResizeTool title="Resize Image to 50KB" />

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Resize Image to 50KB – Free Privacy-First Tool
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Need a high-quality photo under 50KB for standard uploads? Combine local dimension scaling with quality ratios to hit your exact size limit in seconds.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Strategy to Hit 50KB Limit</h2>
                        <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            <p>Getting a high-res camera shot under 50KB requires adjusting dimensions and format parameters:</p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong>Adjust Dimensions First</strong> — Scale the width down to 800px or 1000px. This reduces raw pixel area and cuts size by 75%.</li>
                                <li><strong>Select Output Format</strong> — Use <strong>JPG</strong> for standard portraits or photos, or <strong>WebP</strong> for web assets. Avoid PNG as it maintains lossless structures that remain large.</li>
                                <li><strong>Configure Quality</strong> — Set the slider to 65%. Most human eyes cannot distinguish quality loss at this ratio, but the file size drops dramatically.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Common 50KB Portal Requirements</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                            <li>🎓 College and university application forms</li>
                            <li>🏢 Government employment registration websites</li>
                            <li>🛂 Visa portal passport image submissions</li>
                            <li>💳 Bank KYC profile picture updates</li>
                            <li>📄 Digital signatures and identity scan verification</li>
                        </ul>
                    </section>
                </div>

                <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">How can I check the final output size?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Our tool displays original vs new size updates in real time (for compression) or generates optimized download blobs immediately. Simply inspect the file size of the downloaded asset to confirm it is under 50KB.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">Is the tool safe for scanning passport pages?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Yes. Since ResizeMe runs 100% locally in your active web browser session, your document scan data is never sent over the internet or written onto a remote database server. It is completely safe.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl p-6 space-y-2">
                    <h3 className="font-bold text-gray-950 dark:text-white">Related Tools</h3>
                    <div className="flex flex-wrap gap-3">
                        <a href="/compress-image-online" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">Compress Image Online</a>
                        <a href="/resize-image-to-100kb" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">Resize Image to 100KB</a>
                        <a href="/tools/crop" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">Crop Tool</a>
                    </div>
                </div>
            </div>
        </>
    );
}
