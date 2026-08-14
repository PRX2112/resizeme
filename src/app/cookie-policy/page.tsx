import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, Settings, Eye, ShieldCheck, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cookie Policy - ResizeMe',
    description: 'Learn about how ResizeMe uses cookies, local storage, and third-party advertising cookies including Google AdSense DoubleClick DART cookies.',
};

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Cookie className="w-4 h-4" /> Transparency
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            Cookie Policy
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Effective & Last Updated:</strong> August 14, 2026
                        </p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-8">
                        <p className="text-base leading-relaxed">
                            This Cookie Policy explains how <strong>ResizeMe</strong> (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">https://resizeme.in</a>) uses cookies, web beacons, and related browser storage mechanisms (like <code>localStorage</code> and <code>sessionStorage</code>) when you use our website and tools. It also explains your choices and rights to control or disable these technologies.
                        </p>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 1. What Are Cookies? */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" /> 1. What Are Cookies & Web Storage?
                            </h2>
                            <p>
                                Cookies are small text files placed onto your computer, tablet, or smartphone by websites you visit. They are widely used to make websites work efficiently, save user interface preferences, and provide analytical data to website operators.
                            </p>
                            <p className="mt-2">
                                In addition to cookies, web browsers support <strong>HTML5 Local Storage</strong> and <strong>Session Storage</strong>, which allow client-side applications (such as ResizeMe's theme toggle and temporary session tools) to store state locally on your machine without transmitting files or identity tokens to remote databases.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 2. Categories of Cookies We Use */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Settings className="w-6 h-6 text-teal-600 dark:text-teal-400" /> 2. Categories of Cookies Used on ResizeMe
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Essential Cookies */}
                                <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        A. Essential / Strictly Necessary Cookies & Storage
                                    </h3>
                                    <p className="text-sm">
                                        These storage items are necessary for the basic operation of the site, such as storing your active theme mode (light or dark mode) and retaining tool layout settings across page refreshes. They do not store personal identifiable information.
                                    </p>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        B. Analytics & Performance Cookies
                                    </h3>
                                    <p className="text-sm">
                                        We use Google Analytics cookies (such as <code>_ga</code> and <code>_ga_*</code>) to understand how visitors interact with our website, which tools are most frequently utilized, and identify technical bottlenecks or slow loading times. All analytical data is collected in aggregated and anonymized form with IP anonymization enabled.
                                    </p>
                                </div>

                                {/* Advertising & Google AdSense */}
                                <div className="p-5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                                        C. Advertising Cookies (Google AdSense & DoubleClick DART)
                                    </h3>
                                    <p className="text-sm text-amber-900 dark:text-amber-300 mb-3">
                                        ResizeMe displays advertisements provided by Google AdSense. Google and its certified third-party vendor network utilize advertising cookies, including the <strong>DoubleClick DART cookie</strong>, to:
                                    </p>
                                    <ul className="list-disc list-inside text-sm space-y-1.5 text-amber-900 dark:text-amber-300 pl-2">
                                        <li>Serve relevant advertisements to users based on their prior visits to ResizeMe and other websites across the web.</li>
                                        <li>Prevent the exact same ad from continuously reappearing (frequency capping).</li>
                                        <li>Combat invalid traffic, clicks, and fraudulent bot activity.</li>
                                        <li>Measure the performance and reach of advertising campaigns.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 3. Managing & Opting Out */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Eye className="w-6 h-6 text-teal-600 dark:text-teal-400" /> 3. How to Opt Out of Advertising Cookies
                            </h2>
                            <p>
                                You have full control over personalized advertising cookies and can opt out across multiple platforms:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
                                <li>
                                    <strong>Google Ad Personalization Opt-Out:</strong> Visit{' '}
                                    <a
                                        href="https://adssettings.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        Google Ads Settings <ExternalLink className="w-3.5 h-3.5" />
                                    </a>{' '}
                                    to turn off personalized ad targeting for your Google account or browser.
                                </li>
                                <li>
                                    <strong>Digital Advertising Alliance (DAA):</strong> Opt out of participating multi-network behavioral advertising at{' '}
                                    <a
                                        href="https://optout.aboutads.info"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://optout.aboutads.info <ExternalLink className="w-3.5 h-3.5" />
                                    </a>.
                                </li>
                                <li>
                                    <strong>Network Advertising Initiative (NAI):</strong> Manage consumer choices at{' '}
                                    <a
                                        href="https://optout.networkadvertising.org"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        https://optout.networkadvertising.org <ExternalLink className="w-3.5 h-3.5" />
                                    </a>.
                                </li>
                                <li>
                                    <strong>European Users (EDAA):</strong> Visitors in Europe can customize advertising preferences via{' '}
                                    <a
                                        href="https://www.youronlinechoices.eu"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        Your Online Choices <ExternalLink className="w-3.5 h-3.5" />
                                    </a>.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 4. Browser Controls */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" /> 4. Managing Cookies in Your Browser
                            </h2>
                            <p>
                                Most web browsers allow you to block, delete, or alert you before cookies are stored. Instructions for popular browsers can be accessed below:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 not-prose">
                                <a
                                    href="https://support.google.com/chrome/answer/95647"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-center font-medium text-sm text-gray-800 dark:text-gray-200 transition-colors"
                                >
                                    Google Chrome ↗
                                </a>
                                <a
                                    href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-center font-medium text-sm text-gray-800 dark:text-gray-200 transition-colors"
                                >
                                    Mozilla Firefox ↗
                                </a>
                                <a
                                    href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-center font-medium text-sm text-gray-800 dark:text-gray-200 transition-colors"
                                >
                                    Apple Safari ↗
                                </a>
                                <a
                                    href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-center font-medium text-sm text-gray-800 dark:text-gray-200 transition-colors"
                                >
                                    Microsoft Edge ↗
                                </a>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Note: Disabling essential cookies may impair your ability to preserve custom site preferences such as dark mode or recent offline processing history.
                            </p>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* 5. Contact Information */}
                        <section className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/60 not-prose">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" /> 5. Questions Regarding Cookies
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                If you have any inquiries regarding our use of cookies or third-party advertising practices, please contact us:
                            </p>
                            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <p><strong>Email:</strong> <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">handleresizeme@gmail.com</a></p>
                                <p><strong>Privacy Policy:</strong> <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Read Full Privacy Policy</Link></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

