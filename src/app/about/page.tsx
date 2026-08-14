import type { Metadata } from 'next';
import Link from 'next/link';
import { Cpu, ShieldCheck, Zap, Layers, Sparkles, Lock, ArrowRight, Mail, Code2, Globe2, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About ResizeMe - Privacy-First Online Image Processing Suite',
    description: 'Learn about ResizeMe: our mission, modern web tech stack (Next.js, Sharp, WebAssembly, Canvas), privacy-first local processing, and comprehensive image editing tools.',
};

export default function AboutPage() {
    const techStack = [
        {
            title: 'Next.js 16 & React 19',
            description: 'Cutting-edge App Router framework providing sub-second page loads, Server Components, and responsive interfaces.',
            icon: Code2,
        },
        {
            title: 'Sharp Engine',
            description: 'Ultra-fast Node.js image processing kernel backed by libvips for high-fidelity serverless conversions and bulk resizes.',
            icon: Zap,
        },
        {
            title: 'HTML5 Canvas & WebAssembly',
            description: 'In-browser graphics pipeline enabling zero-latency client-side cropping, memes, rotation, and color picking.',
            icon: Cpu,
        },
        {
            title: '@imgly/background-removal',
            description: 'Advanced neural model executing directly in your local browser for 100% private background isolation.',
            icon: Sparkles,
        },
    ];

    const toolsSummary = [
        { name: 'Image Resize', href: '/tools/resize', desc: 'Scale by dimensions, percent, or exact KB/MB with aspect lock.' },
        { name: 'Image Crop', href: '/tools/crop', desc: 'Precision freeform and preset aspect cropping (1:1, 16:9, 4:5).' },
        { name: 'Image Compress', href: '/tools/compress', desc: 'Smart lossy/lossless reduction with live Before-After slider.' },
        { name: 'Format Convert', href: '/tools/convert', desc: 'Instant batch conversion between PNG, JPG, WebP, AVIF, and GIF.' },
        { name: 'Image Enlarge', href: '/tools/enlarge', desc: '2× and 4× smart upscaling using Lanczos3 interpolation.' },
        { name: 'Background Remover', href: '/tools/background-remover', desc: 'Neural AI background removal that runs entirely in your browser.' },
        { name: 'Meme Generator', href: '/tools/meme-generator', desc: 'Client-side meme editor with customizable typography and layers.' },
        { name: 'Color Picker', href: '/tools/color-picker', desc: 'Magnifier pixel loupe with HEX, RGB, and HSL history.' },
        { name: 'Rotate & Flip', href: '/tools/rotate', desc: 'Fine-tuned angular rotation with background fill and mirroring.' },
        { name: 'Watermark', href: '/tools/watermark', desc: 'Protect photos with customizable text and graphic overlays.' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 px-4">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4" /> About the Platform
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                        Empowering Creators with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Privacy-First</span> Image Tools
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        <strong>ResizeMe</strong> (<a href="https://resizeme.in" className="text-blue-600 dark:text-blue-400 hover:underline">resizeme.in</a>) is a modern, high-performance digital image utility platform engineered to make image manipulation fast, free, and completely respectful of your personal privacy.
                    </p>
                </div>

                {/* Privacy Pillar */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
                            <Lock className="w-4 h-4" /> Zero-Storage Promise
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Your Images Never Leave Your Device
                        </h2>
                        <p className="text-blue-100 leading-relaxed mb-6">
                            Unlike traditional online photo editors that upload your private files to foreign database servers, ResizeMe processes the vast majority of operations locally right in your web browser. Heavy batch jobs are processed ephemerally in RAM and immediately discarded. No file storage, no tracking, and no AI scraping.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <ShieldCheck className="w-4 h-4 text-green-300" /> 100% Client-Side Available
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <ShieldCheck className="w-4 h-4 text-green-300" /> Zero File Retention
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <ShieldCheck className="w-4 h-4 text-green-300" /> No Registration Required
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Technology & Engineering Architecture
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        ResizeMe is engineered on a modern, modern full-stack web architecture built for speed, responsiveness, and zero server bottlenecks:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {techStack.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tool Suite Overview */}
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Comprehensive Image Utilities Suite
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Whether you are an e-commerce seller preparing product thumbnails, a developer optimizing WebP assets, a student adjusting passport photos, or a social media manager crafting Instagram stories, ResizeMe provides tailored utilities:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {toolsSummary.map((tool) => (
                            <Link
                                key={tool.name}
                                href={tool.href}
                                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1.5">
                                    <span>{tool.name}</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{tool.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mission & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Globe2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Our Mission
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            Our mission is to make professional image manipulation accessible to everyone worldwide without paywalls, restrictive daily quotas, or compromises on file privacy. We believe essential productivity tools should be open, fast, and accessible across any modern browser.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Get in Touch
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We value community feedback and actively roll out enhancements. Have a suggestion, format request, or bug report? Reach out directly:
                        </p>
                        <div className="text-sm space-y-1">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Support Email:</strong> <a href="mailto:handleresizeme@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">handleresizeme@gmail.com</a>
                            </p>
                            <p>
                                <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    Visit Contact & Help Page ↗
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

