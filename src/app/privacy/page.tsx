import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Cookie, Server, Globe2, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy - ResizeMe',
    description: 'Learn how ResizeMe protects your privacy. Comprehensive privacy policy covering local client-side image processing, Google AdSense cookies, GDPR, and CCPA disclosures.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <ShieldCheck className="w-4 h-4" /> Legal & Transparency
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Effective & Last Updated:</strong> August 14, 2026
                        </p>
                    </div>

                    {/* Summary Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                <Lock className="w-4 h-4" /> 100% Private Files
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Your images are processed directly on your device. We do not store or inspect your pictures.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold mb-1">
                                <Cookie className="w-4 h-4" /> Transparent Cookies
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Clear disclosure on Google AdSense, DoubleClick DART cookies, and analytics.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40">
                            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold mb-1">
                                <Globe2 className="w-4 h-4" /> GDPR & CCPA Ready
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Explicit user rights, easy ad opt-out controls, and zero sale of personal data.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-8">
                        <p className="text-base leading-relaxed">
                            Welcome to <strong>ResizeMe</strong> (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>). We are committed to safeguarding your personal privacy and providing total transparency regarding how your data is handled. This Privacy Policy details our operational principles, our use of cookies and third-party advertising partners like Google AdSense, and your rights under global privacy regulations including the <strong>General Data Protection Regulation (GDPR)</strong> and the <strong>California Consumer Privacy Act (CCPA / CPRA)</strong>.
                        </p>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 1. Image Data and Processing */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 1. Image Processing & Local Privacy Guarantee
                            </h2>
                            <p>
                                ResizeMe is designed with a <strong>privacy-first architecture</strong>. The vast majority of our tool operations (including image cropping, color extraction, canvas-based resizing, rotation, watermarking, meme generation, and client-side background removal) are executed <strong>100% locally inside your web browser</strong> via HTML5 Canvas, WebAssembly (WASM), and Web Workers.
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li><strong>No File Uploads:</strong> Files processed locally in your browser never leave your device.</li>
                                <li><strong>No Server File Storage:</strong> For tools utilizing high-speed serverless transformations (e.g. sharp pipelines), files are processed strictly in-memory (transient RAM) and streamed back immediately. No user files or metadata are ever saved, archived, or shared with third parties.</li>
                                <li><strong>No Image Scraping or AI Model Training:</strong> Your files are never utilized for model training, machine learning datasets, or promotional purposes.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 2. Information We Collect */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 2. Information We Automatically Collect
                            </h2>
                            <p>
                                When you visit ResizeMe, our servers and standard diagnostic utilities may automatically log technical non-personally identifiable information, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li>Browser type, language preferences, and operating system version.</li>
                                <li>Referring website URLs and timestamps of visits.</li>
                                <li>Anonymized Internet Protocol (IP) addresses and general country/city geolocation.</li>
                                <li>Diagnostic metrics such as page response times, error codes, and visitor count aggregates.</li>
                            </ul>
                            <p className="mt-3">
                                This data is used exclusively to maintain site reliability, prevent automated abuse or DDoS attacks, and improve overall performance.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 3. Google AdSense & Third-Party Advertising Disclosures */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 3. Google AdSense, DoubleClick DART Cookies & Third-Party Advertising
                            </h2>
                            <p>
                                We use third-party advertising companies, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website. These companies may use cookies and web beacons to serve ads based on your prior visits to this website or other websites across the internet.
                            </p>

                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-5 my-4 space-y-3">
                                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                                    Important AdSense Disclosures
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-sm text-amber-900 dark:text-amber-300">
                                    <li>
                                        <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                                    </li>
                                    <li>
                                        <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to users based on their visit to ResizeMe and/or other sites on the Internet.
                                    </li>
                                    <li>
                                        <strong>Personalized Advertising:</strong> Ads served may be tailored to your interests based on anonymous browsing patterns.
                                    </li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                                How to Opt Out of Personalized Advertising
                            </h3>
                            <p>
                                You have the right to control how advertising networks use your information. You can opt out of personalized advertising by visiting the following links:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li>
                                    <strong>Google Ads Settings:</strong> You can manage or opt out of personalized Google advertising at{' '}
                                    <a
                                        href="https://adssettings.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://adssettings.google.com <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </li>
                                <li>
                                    <strong>Digital Advertising Alliance (DAA):</strong> Opt out of participating third-party ad networks at{' '}
                                    <a
                                        href="https://optout.aboutads.info"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://optout.aboutads.info <ExternalLink className="w-3.5 h-3.5" />
                                    </a>{' '}
                                    or{' '}
                                    <a
                                        href="https://www.aboutads.info/choices/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://www.aboutads.info/choices/ <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </li>
                                <li>
                                    <strong>Network Advertising Initiative (NAI):</strong> Opt out via the NAI consumer opt-out page at{' '}
                                    <a
                                        href="https://optout.networkadvertising.org"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://optout.networkadvertising.org <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </li>
                                <li>
                                    <strong>European Interactive Digital Advertising Alliance (EDAA):</strong> European visitors can manage preferences at{' '}
                                    <a
                                        href="https://www.youronlinechoices.eu"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://www.youronlinechoices.eu <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </li>
                            </ul>
                            <p className="mt-3 text-sm">
                                For additional details on Google's advertising policies and data handling, visit{' '}
                                <a
                                    href="https://policies.google.com/technologies/ads"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                    Google's Privacy & Terms on Advertising
                                </a>.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 4. Cookies & Local Storage */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 4. Cookies, Web Storage & Tracking Technologies
                            </h2>
                            <p>
                                ResizeMe uses cookies and local browser storage (such as <code>localStorage</code> and <code>sessionStorage</code>) for:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li><strong>Essential Preferences:</strong> Preserving your chosen color theme (light or dark mode) and tool configuration presets.</li>
                                <li><strong>Session Operations:</strong> Enabling recent client-side tool history without sending any data to a database.</li>
                                <li><strong>Analytics:</strong> Google Analytics cookies to gauge site speed and feature popularity in aggregated form.</li>
                                <li><strong>Advertising:</strong> Ad delivery, frequency capping, and anti-fraud verification via Google AdSense.</li>
                            </ul>
                            <p className="mt-3">
                                For full information regarding managing, blocking, or clearing cookies, please read our dedicated{' '}
                                <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    Cookie Policy
                                </Link>.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 5. GDPR Privacy Rights (EEA & UK Users) */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Globe2 className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 5. General Data Protection Regulation (GDPR) Disclosures
                            </h2>
                            <p>
                                For users residing in the European Economic Area (EEA) and the United Kingdom, ResizeMe acts as the Data Controller with respect to website access logs. Our legal bases for processing data under Regulation (EU) 2016/679 (GDPR) include:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For personalized advertising and optional analytics cookies.</li>
                                <li><strong>Legitimate Interests (Art. 6(1)(f) GDPR):</strong> For website security, fraud mitigation, preventing server abuse, and ensuring fast content delivery.</li>
                            </ul>
                            <p className="mt-3">Under GDPR, you retain the following statutory rights:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
                                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-sm">
                                    <strong>Right to Access:</strong> Request confirmation and copies of any personal data we hold.
                                </div>
                                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-sm">
                                    <strong>Right to Rectification:</strong> Request correction of inaccurate information.
                                </div>
                                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-sm">
                                    <strong>Right to Erasure ("To Be Forgotten"):</strong> Request deletion of your personal data where applicable.
                                </div>
                                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-sm">
                                    <strong>Right to Restrict or Object:</strong> Restrict or object to certain processing operations or direct marketing.
                                </div>
                            </div>
                            <p className="text-sm">
                                To exercise any of these rights, contact us at <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">handleresizeme@gmail.com</a>. You also have the right to lodge a complaint with your local Data Protection Authority (DPA).
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 6. CCPA / CPRA Privacy Rights (California Residents) */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 6. California Consumer Privacy Act (CCPA / CPRA) Disclosures
                            </h2>
                            <p>
                                If you are a resident of California, the California Consumer Privacy Act (CCPA), as amended by the CPRA, provides specific privacy rights regarding personal information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li>
                                    <strong>No Sale of Personal Information:</strong> ResizeMe does <strong>not</strong> sell your personal data or user images to third parties for monetary consideration.
                                </li>
                                <li>
                                    <strong>Sharing for Cross-Context Advertising:</strong> Third-party ad networks (like Google AdSense) may collect identifiers for cross-context behavioral ads. You can opt out via{' '}
                                    <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                        AboutAds Opt-Out
                                    </a>.
                                </li>
                                <li>
                                    <strong>Right to Know & Delete:</strong> You have the right to request disclosure of categories of personal information collected and request its deletion.
                                </li>
                                <li>
                                    <strong>Non-Discrimination:</strong> We will never discriminate against you, deny service, or provide a different quality of service for exercising your privacy rights.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 7. Children's Privacy (COPPA) */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                7. Children's Online Privacy Protection (COPPA)
                            </h2>
                            <p>
                                Protecting children's privacy online is paramount. ResizeMe does not knowingly solicit or collect personally identifiable information from children under the age of 13. If you believe your child has submitted personal details on our website, please contact us immediately so we can promptly take corrective action and purge such data.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 8. Third-Party Links */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                8. External Links & Third-Party Sites
                            </h2>
                            <p>
                                Our website may contain links to external sites (such as Google support, social media, or partner resources). We do not control and are not responsible for the privacy practices, content, or policies of third-party platforms. We recommend reviewing the individual privacy statements of any external site you visit.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 9. Policy Amendments */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                9. Changes to This Privacy Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy periodically to reflect technological changes, legal compliance requirements, or updates to our tool suite. Any revisions will be reflected on this page with an updated "Last Updated" timestamp. We encourage users to check this page periodically.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 10. Contact Information */}
                        <section className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 not-prose">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 10. Contact & Inquiries
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                If you have questions regarding this Privacy Policy, your rights under GDPR/CCPA, or cookie preferences, please contact our team:
                            </p>
                            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <p><strong>Entity / Website:</strong> ResizeMe (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>)</p>
                                <p><strong>Email:</strong> <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">handleresizeme@gmail.com</a></p>
                                <p><strong>Contact Page:</strong> <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in/contact</Link></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}


