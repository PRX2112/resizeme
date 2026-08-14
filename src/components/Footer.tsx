'use client';

import Link from 'next/link';
import { Mail, ShieldCheck, Zap, Lock } from 'lucide-react';
import PWAInstallButton from '@/components/PWAInstallBanner';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const toolsList = [
        { name: 'Image Resize', href: '/tools/resize' },
        { name: 'Bulk Resize (ZIP)', href: '/tools/resize/bulk' },
        { name: 'Image Crop', href: '/tools/crop' },
        { name: 'Image Compress', href: '/tools/compress' },
        { name: 'Format Convert', href: '/tools/convert' },
        { name: 'AI Background Remover', href: '/tools/background-remover' },
        { name: 'Image Enlarger', href: '/tools/enlarge' },
        { name: 'Watermark Photo', href: '/tools/watermark' },
        { name: 'Meme Generator', href: '/tools/meme-generator' },
        { name: 'Color Picker', href: '/tools/color-picker' },
        { name: 'Rotate Image', href: '/tools/rotate' },
        { name: 'Flip Image', href: '/tools/flip' },
    ];

    const resourcesList = [
        { name: 'Knowledge Hub & Blog', href: '/blog' },
        { name: 'Image Format Guide', href: '/image-format-guide' },
        { name: 'Social Media Dimensions', href: '/social-media-image-sizes' },
        { name: 'What is Image Resizing?', href: '/what-is-image-resizing' },
        { name: 'Why Optimization Matters', href: '/why-image-optimization-matters' },
        { name: 'AVIF vs WebP vs JPEG', href: '/blog/avif-vs-webp-vs-jpeg-comparison' },
        { name: 'Resampling Algorithms Guide', href: '/blog/complete-guide-to-image-resampling-algorithms' },
    ];

    const legalList = [
        { name: 'About Us', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
        { name: 'Disclaimer', href: '/disclaimer' },
        { name: 'Contact Us', href: '/contact' },
    ];

    // Schema.org structured data for SEO
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ResizeMe",
        "url": "https://resizeme.in",
        "logo": "https://resizeme.in/logo.png",
        "description": "Professional browser-based image utility tools. Resize, crop, compress, convert, and edit images with 100% privacy.",
        "email": "handleresizeme@gmail.com",
    };

    return (
        <>
            {/* Schema.org JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-12 text-sm" role="contentinfo" aria-label="Site footer">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand & Privacy Statement */}
                        <div className="space-y-4 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                    <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white text-base">ResizeMe</span>
                            </Link>

                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Fast, private, browser-based image utilities. Processed locally or in ephemeral memory — your photos never stay on any server.
                            </p>

                            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-1">
                                <div className="flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Zero Permanent File Storage</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Client-Side Engine Speed</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <PWAInstallButton />
                            </div>
                        </div>

                        {/* Column 1: Tools */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                Image Tools
                            </h3>
                            <ul className="space-y-1.5 text-xs">
                                {toolsList.map((tool) => (
                                    <li key={tool.name}>
                                        <Link
                                            href={tool.href}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {tool.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2: Resources & Guides */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                Guides & Resources
                            </h3>
                            <ul className="space-y-1.5 text-xs">
                                {resourcesList.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Legal & Support */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                Company & Legal
                            </h3>
                            <ul className="space-y-1.5 text-xs">
                                {legalList.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-2">
                                <a
                                    href="mailto:handleresizeme@gmail.com"
                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>handleresizeme@gmail.com</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom copyright */}
                    <div className="pt-6 bg-white dark:bg-gray-950  border-t border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
                        <p>© {currentYear} ResizeMe.in — Free & Private Online Image Editor.</p>
                        <p>All processing happens locally on your device for complete security.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
