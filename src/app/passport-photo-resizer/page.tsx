import CropTool from '@/components/tools/CropTool';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Passport Photo Resizer & Cropper - Free Online Tool',
    description: 'Crop and resize your portrait photos to official government passport and visa photo size requirements online for free. 100% browser-based security.',
    alternates: { canonical: '/passport-photo-resizer' }
};

export default function PassportPhotoResizerPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the official size for a US passport photo?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The official size for a United States passport photo is exactly 2 inches by 2 inches (51 mm x 51 mm), which forms a perfect square 1:1 aspect ratio."
                }
            },
            {
                "@type": "Question",
                "name": "What is the standard European / UK visa photo size?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The standard size for UK and Schengen visa photos is 35 mm wide by 45 mm high, which requires a custom aspect ratio."
                }
            },
            {
                "@type": "Question",
                "name": "Is it safe to upload biometric or identity documents here?",
                "aria-level": "3",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! ResizeMe is 100% private. All cropping and resizing happen locally inside your web browser sandbox. No photo is ever sent over the internet or stored on database servers, completely protecting your biometric data."
                }
            }
        ]
    };

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "ResizeMe Passport Resizer",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                }
            }} />
            <JsonLd data={faqSchema} />

            <CropTool title="Passport Photo Resizer" />

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Passport & Visa Photo Resizer – Official Sizes Free
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Need an official portrait size for biometric applications or identity forms? Lock aspect ratios, crop facial features cleanly, and download your government-compliant photo privately.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Passport Photo Size Guidelines</h2>
                        <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            <p>Verify exact size requirements depending on your target country portal:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>United States (US)</strong> — <strong>2 × 2 inches</strong> (51 × 51 mm) — Square <strong>1:1</strong> aspect ratio.</li>
                                <li><strong>United Kingdom (UK)</strong> — <strong>35 × 45 mm</strong> (1.38 × 1.77 inches).</li>
                                <li><strong>European Union (Schengen Visa)</strong> — <strong>35 × 45 mm</strong>.</li>
                                <li><strong>India (Passport & OCI)</strong> — <strong>2 × 2 inches</strong> or <strong>35 × 45 mm</strong> depending on portal.</li>
                                <li><strong>Australia / Canada</strong> — <strong>35-40 mm wide by 45-50 mm high</strong>.</li>
                              </ul>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tips for Compliance Approvals</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <li><strong>Center Your Face</strong> — Use the Square aspect ratio preset in our tool to align eyes and nose along the vertical centerline.</li>
                            <li><strong>Leave Headroom</strong> — Ensure there is visible empty space between your hair and the top boundary lines.</li>
                            <li><strong>Format Choice</strong> — Government portals universally require high-quality <strong>JPG/JPEG</strong> format uploads.</li>
                        </ul>
                    </section>
                </div>

                <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">How do I crop to a square aspect ratio?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Simply click on the "Square (1:1)" aspect ratio selector under the control panel on the right. The crop boundary will snap to a perfect square, allowing you to scale and drag the box to outline your face cleanly.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/40">
                            <h3 className="font-bold text-lg mb-2">Are my identity scans safe from leaks?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Yes. All cropping operations run strictly locally inside your web browser. No copy of your facial photo or personal ID scan is ever uploaded to our servers or stored in any remote system.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl p-6 space-y-2">
                    <h3 className="font-bold text-gray-950 dark:text-white">Related Tools</h3>
                    <div className="flex flex-wrap gap-3">
                        <a href="/resize-image-for-passport" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">Passport Resizer Guide</a>
                        <a href="/tools/crop" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">Standard Cropper</a>
                        <a href="/tools/resize" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">Image Resizer</a>
                    </div>
                </div>
            </div>
        </>
    );
}
