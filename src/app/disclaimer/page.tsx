import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Disclaimer - ResizeMe',
    description: 'Disclaimer for ResizeMe image tools. Important legal disclaimers regarding browser image processing, third-party advertising, and external links.',
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <AlertTriangle className="w-4 h-4" /> Legal Notice
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            Disclaimer
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Effective & Last Updated:</strong> August 14, 2026
                        </p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-8">
                        {/* 1. General Information */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-6 h-6 text-amber-500" /> 1. General Information & Purpose
                            </h2>
                            <p>
                                The information and utilities provided on <strong>ResizeMe</strong> (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>) are published in good faith for general information, productivity, and utility purposes only.
                            </p>
                            <p className="mt-2">
                                While we strive to provide reliable and high-fidelity image tools, ResizeMe makes no representations or warranties of any kind, express or implied, regarding the completeness, accuracy, reliability, suitability, or availability of the website or the generated output. Any reliance you place on such material or tools is strictly at your own risk.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 2. Image Processing & Backup Advisory */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <ShieldAlert className="w-6 h-6 text-amber-500" /> 2. Image Processing & Backup Advisory
                            </h2>
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 mb-4">
                                <strong>Crucial Notice:</strong> Always preserve unedited original copies of your important photos and documents on your device before conducting resizing, lossy compression, or format conversion.
                            </div>
                            <p>
                                Image compression and format transformations inherently involve mathematical encoding algorithms (such as MozJPEG, WebP lossless/lossy encoders, and Lanczos interpolation). The resulting file sizes, color reproduction, and visual sharpness depend on input dimensions, color profiles, browser hardware acceleration, and the user-specified parameters. ResizeMe shall not be liable for any accidental loss of detail, artifacts, color shifts, or corrupted downloads.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 3. Advertising & Google AdSense Disclosure */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                3. Advertising & Google AdSense Disclosure
                            </h2>
                            <p>
                                ResizeMe displays third-party advertisements delivered by advertising partners such as <strong>Google AdSense</strong>. Please note the following regarding advertised content:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
                                <li>The presence of an advertisement on ResizeMe does <strong>not</strong> constitute an endorsement, recommendation, guarantee, or warranty of the products, services, or companies promoted in those advertisements.</li>
                                <li>Third-party advertisers operate independently and may use cookies and web beacons (such as the DoubleClick DART cookie) to serve targeted advertisements based on your prior browsing history.</li>
                                <li>We do not control the creative content or landing pages linked from automated advertising networks. You interact with third-party advertisers at your own discretion.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 4. External Links Disclaimer */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <ExternalLink className="w-6 h-6 text-amber-500" /> 4. External Links Disclaimer
                            </h2>
                            <p>
                                ResizeMe may contain links to external websites, documentation, or social platforms that are not operated or monitored by us. While we strive to link only to safe, reputable resources, we have no control over the content, security practices, or privacy policies of third-party domains. Following any external link is done at your own risk.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 5. Limitation of Liability */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                5. Limitation of Liability
                            </h2>
                            <p>
                                In no event will ResizeMe, its developers, or affiliates be liable for any direct, indirect, special, incidental, consequential, or punitive damages arising from the use of, or inability to use, this website, including data corruption, work delays, or commercial losses, even if warned of the possibility of such damages.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 6. Contact Us */}
                        <section className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 not-prose">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-amber-500" /> 6. Questions & Contact
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                If you require any clarification regarding this disclaimer or our terms of operation, please contact us:
                            </p>
                            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <p><strong>Entity:</strong> ResizeMe (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>)</p>
                                <p><strong>Email:</strong> <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">handleresizeme@gmail.com</a></p>
                                <p><strong>Contact Form:</strong> <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in/contact</Link></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

