import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Shield, AlertCircle, Scale, CheckCircle2, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service - ResizeMe',
    description: 'Terms of Service for ResizeMe. Read our guidelines for using our free online image resizing, compression, cropping, and conversion utilities.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <FileText className="w-4 h-4" /> Legal Agreement
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Effective & Last Updated:</strong> August 14, 2026
                        </p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-8">
                        <p className="text-base leading-relaxed">
                            Welcome to <strong>ResizeMe</strong> (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>). By accessing, browsing, or utilizing any of our online image processing utilities, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our associated <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</Link>. If you do not agree with these terms, please do not use our services.
                        </p>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 1. Description of Service */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" /> 1. Description of Service
                            </h2>
                            <p>
                                ResizeMe provides a suite of free, web-based digital image utilities designed for rapid editing, optimization, and conversion. These tools include but are not limited to:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2">
                                <li><strong>Image Resizing:</strong> Scaling by percentage, specific dimensions (width × height), target file sizes, and aspect-ratio preservation.</li>
                                <li><strong>Image Compression:</strong> Lossy and lossless file size reduction for JPG, PNG, and WebP formats.</li>
                                <li><strong>Image Cropping & Transforming:</strong> Freeform and aspect ratio cropping, 90° rotation, custom angular rotation, and horizontal/vertical flipping.</li>
                                <li><strong>Format Conversion:</strong> Converting between PNG, JPG, WebP, AVIF, GIF, and HEIC.</li>
                                <li><strong>Creative Tools:</strong> Image enlargement (Lanczos3 upscaling), client-side background removal, color palette extraction, text watermarking, and meme generation.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 2. File Privacy and In-Browser Processing */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" /> 2. Privacy & User Content Ownership
                            </h2>
                            <p>
                                We believe your content belongs solely to you.
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
                                <li><strong>100% User Ownership:</strong> You retain all copyright, intellectual property, and proprietary rights in and to any image files you process through ResizeMe. We claim no ownership, license, or rights to your media.</li>
                                <li><strong>Zero Storage Guarantee:</strong> All client-side tools run exclusively in your browser session. When serverless utilities are used for heavy batch processing, images are handled entirely in ephemeral RAM memory, returned immediately to your browser, and instantly discarded. No files are saved to persistent disks or databases.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 3. Acceptable Use Policy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" /> 3. Acceptable Use Policy
                            </h2>
                            <p>
                                By accessing or using ResizeMe, you agree that you will NOT:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
                                <li>Process or distribute images that are unlawful, defamatory, libelous, harmful, abusive, harassing, or violate any applicable municipal, national, or international law.</li>
                                <li>Upload or manipulate images that infringe upon any patent, trademark, trade secret, copyright, or other proprietary rights of any party without explicit authorization.</li>
                                <li>Attempt to bypass rate limits, probe, scan, or test the vulnerability of our system, servers, or networks.</li>
                                <li>Use automated scrapers, spiders, robots, or scripts to bulk-extract data or launch denial-of-service (DDoS) attacks against our infrastructure.</li>
                                <li>Reverse-engineer, decompile, or disassemble proprietary scripts or backend software modules without prior written consent.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 4. Third-Party Advertisements & Google AdSense */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                4. Third-Party Advertisements & Google AdSense
                            </h2>
                            <p>
                                ResizeMe is supported through third-party advertising networks, including <strong>Google AdSense</strong>. By using our website:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
                                <li>You acknowledge that third-party vendors, including Google, may use cookies to serve advertisements based on your prior visits to this or other websites.</li>
                                <li>We do not endorse, guarantee, or assume responsibility for any products, services, or claims advertised within third-party banner ads. Any transactions between you and third-party advertisers are solely between you and the respective third party.</li>
                                <li>You may opt out of personalized ad targeting by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Ads Settings</a> or <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">aboutads.info</a>.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 5. Intellectual Property Rights */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                5. ResizeMe Intellectual Property
                            </h2>
                            <p>
                                All software, codebases, user interfaces, website design, text, logos, icons, graphics, and compilation of tools on ResizeMe are the property of ResizeMe and are protected by international copyright, trademark, and intellectual property laws. You may not copy, replicate, republish, or create derivative works of our website or branding without express written authorization.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 6. Disclaimer of Warranties */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <AlertCircle className="w-6 h-6 text-amber-500" /> 6. Disclaimer of Warranties
                            </h2>
                            <p>
                                RESIZEME AND ALL ASSOCIATED TOOLS, FEATURES, AND DOCUMENTATION ARE PROVIDED ON AN <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, TITLE, OR NON-INFRINGEMENT.
                            </p>
                            <p className="mt-3">
                                WE DO NOT WARRANT THAT: (A) THE SERVICE WILL FUNCTION UNINTERRUPTED, ERROR-FREE, OR SECURE; (B) DEFECTS WILL BE IMMEDIATELY CORRECTED; OR (C) THE OUTPUT OF PROCESSED IMAGES WILL MEET SPECIFIC RESOLUTION OR COMPRESSION METRICS UNDER ALL OPERATING CONDITIONS. <strong>YOU ARE STRONGLY ADVISED TO MAINTAIN LOCAL BACKUPS OF YOUR ORIGINAL IMAGES PRIOR TO PROCESSING.</strong>
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 7. Limitation of Liability */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                7. Limitation of Liability
                            </h2>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL RESIZEME, ITS FOUNDERS, OPERATORS, AFFILIATES, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF DATA, LOSS OF PROFITS, BUSINESS INTERRUPTION, OR HARDWARE CRASHES) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE OUR WEBSITE OR TOOLS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 8. Modifications & Termination */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                8. Service Modifications & Termination
                            </h2>
                            <p>
                                We reserve the right to modify, enhance, temporarily suspend, or discontinue any tool or feature at our sole discretion without prior notice. We also reserve the right to restrict or terminate access to any user who engages in malicious activity, server abuse, or violations of these Terms.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 9. Governing Law */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                9. Governing Law & Jurisdiction
                            </h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law principles. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts having jurisdiction.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 10. Contact Information */}
                        <section className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 not-prose">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" /> 10. Contact Us
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                If you have questions or concerns regarding these Terms of Service, please reach out to us:
                            </p>
                            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <p><strong>Website:</strong> ResizeMe (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>)</p>
                                <p><strong>Email:</strong> <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">handleresizeme@gmail.com</a></p>
                                <p><strong>Support Page:</strong> <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in/contact</Link></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}


