import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowRight, Mail, Globe2, Sparkles, CheckCircle2, Users, Cpu, Layers } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About ResizeMe - Free & Privacy-First Online Image Editor',
    description: 'Learn about ResizeMe: our mission, privacy-first local processing architecture, independent developer team, and comprehensive suite of digital image utilities.',
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    const toolsSummary = [
        { name: 'Image Resize', href: '/tools/resize', desc: 'Scale by pixel dimensions, percentages, or target KB/MB limits.' },
        { name: 'Image Crop', href: '/tools/crop', desc: 'Precision freeform and preset aspect cropping (1:1, 16:9, 4:5, 9:16).' },
        { name: 'Image Compress', href: '/tools/compress', desc: 'Adaptive lossy and lossless reduction with interactive split-slider.' },
        { name: 'Format Convert', href: '/tools/convert', desc: 'Batch convert between PNG, JPG, WebP, AVIF, and GIF in seconds.' },
        { name: 'Image Enlarge', href: '/tools/enlarge', desc: '2× and 4× high-resolution upscaling with Lanczos3 sinc interpolation.' },
        { name: 'Background Remover', href: '/tools/background-remover', desc: 'Client-side AI neural segmentation for instant transparent cutouts.' },
        { name: 'Meme Generator', href: '/tools/meme-generator', desc: 'High-DPI text styling, movable layers, and custom typography.' },
        { name: 'Color Picker', href: '/tools/color-picker', desc: '10× magnifying loupe with instant HEX, RGB, HSL, and CMYK extraction.' },
        { name: 'Rotate & Flip', href: '/tools/rotate', desc: 'Precision angle adjustments, 90° rotation, and horizontal/vertical mirroring.' },
        { name: 'Watermark Photo', href: '/tools/watermark', desc: 'Add copyright text stamps or transparent PNG logo watermarks.' },
    ];

    return (
        <div className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>About ResizeMe</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Fast, Free & Privacy-First Digital Image Tools
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        ResizeMe (<Link href="/" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">resizeme.in</Link>) provides creators, developers, designers, and students with high-performance image manipulation utilities that run directly on their device.
                    </p>
                </div>

                {/* E-E-A-T: Who We Are Section */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 text-gray-900 dark:text-white font-bold text-lg">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2>Built by Developers for Creators</h2>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
                        <p>
                            ResizeMe is an independent software project built to solve a common frustration: most online image tools are bloated with intrusive paywalls, mandatory account registrations, aggressive daily limits, and hidden data harvesting practices.
                        </p>
                        <p>
                            Our platform is actively maintained by web performance engineers dedicated to providing accessible, production-grade image utilities with zero friction. Whether you need to compress assets to improve Google Core Web Vitals, crop photos for social media aspect ratios, or convert modern formats like WebP and AVIF, ResizeMe provides instant utility without barriers.
                        </p>
                    </div>
                </div>

                {/* Technology & Privacy Philosophy */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-5">
                    <div className="flex items-center gap-2.5 text-gray-900 dark:text-white font-bold text-lg">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h2>Our Technology & Privacy Philosophy</h2>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
                        <p>
                            Privacy isn&apos;t an afterthought at ResizeMe—it is the foundational architecture of everything we build. Instead of routing your personal photos, identity documents, and sensitive assets through remote cloud databases, our tools execute calculations directly inside your web browser.
                        </p>
                        <p>
                            By leveraging modern web standards—including HTML5 Canvas rendering pipelines and high-speed WebAssembly (WASM) modules—your device&apos;s own processor handles the pixel transformations. For tasks that require specialized processing, data is handled strictly in ephemeral, transient memory and discarded immediately upon completion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs">
                            <div className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>Zero File Storage</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                Your photos and documents are never saved, backed up, or retained on our disks.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs">
                            <div className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>No Account Needed</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                Use all utilities immediately with no email signup, tracking cookies, or passwords.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs">
                            <div className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>No AI Training</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                Your artwork and intellectual property will never be scraped or used to train machine learning models.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complete Image Suite */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-5">
                    <div className="flex items-center gap-2.5 text-gray-900 dark:text-white font-bold text-lg">
                        <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2>The ResizeMe Utility Suite</h2>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Explore our complete catalog of browser-based image editing and optimization utilities:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {toolsSummary.map((tool) => (
                            <Link
                                key={tool.name}
                                href={tool.href}
                                className="group p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <div className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                                    <span>{tool.name}</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                                    {tool.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mission & Contact 2-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-2.5">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Our Mission</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            To provide an accessible, ultra-fast image toolbox for the global internet community. We believe essential photo tools should be open to all, free of predatory paywalls, and built with strict respect for digital privacy.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-2.5">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Get in Touch</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Have feedback, a feature request, or an issue to report? We welcome your input and actively update our utilities.
                        </p>
                        <div className="pt-1 text-xs space-y-1">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Direct Email:</strong>{' '}
                                <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    handleresizeme@gmail.com
                                </a>
                            </p>
                            <p>
                                <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                                    Contact & Support Center →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
