'use client';

import Link from 'next/link';
import { Menu, X, ChevronDown, Sparkles, Layers, Sliders, Scissors, Minimize2, RefreshCw, Eraser, Maximize, Smile, Pipette, RotateCw, FlipHorizontal, Pencil } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const allTools = [
    {
        name: 'Resize Image',
        href: '/tools/resize',
        desc: 'Exact dimensions or scale percentage',
        icon: Sliders,
    },
    {
        name: 'Bulk Resize',
        href: '/tools/resize/bulk',
        desc: 'Batch process multiple photos to ZIP',
        icon: Layers,
    },
    {
        name: 'Crop Image',
        href: '/tools/crop',
        desc: 'Preset aspect ratios & freeform crop',
        icon: Scissors,
    },
    {
        name: 'Compress Image',
        href: '/tools/compress',
        desc: 'Target KB binary search & quality tuning',
        icon: Minimize2,
    },
    {
        name: 'Convert Format',
        href: '/tools/convert',
        desc: 'PNG, JPG, WebP, AVIF, HEIC support',
        icon: RefreshCw,
    },
    {
        name: 'Background Remover',
        href: '/tools/background-remover',
        desc: '100% in-browser AI subject segmentation',
        icon: Eraser,
    },
    {
        name: 'Image Enlarger',
        href: '/tools/enlarge',
        desc: '2x & 4x Lanczos3 detail restoration',
        icon: Maximize,
    },
    {
        name: 'Watermark Photo',
        href: '/tools/watermark',
        desc: 'Text & logo protection with tile grids',
        icon: Pencil,
    },
    {
        name: 'Meme Generator',
        href: '/tools/meme-generator',
        desc: 'Retina text rendering with touch dragging',
        icon: Smile,
    },
    {
        name: 'Color Picker',
        href: '/tools/color-picker',
        desc: 'Native eyedropper & 10x pixel loupe',
        icon: Pipette,
    },
    {
        name: 'Rotate Image',
        href: '/tools/rotate',
        desc: '90°, 180°, 270° & custom angle rotation',
        icon: RotateCw,
    },
    {
        name: 'Flip Image',
        href: '/tools/flip',
        desc: 'Horizontal & vertical mirror reflection',
        icon: FlipHorizontal,
    },
];

export default function Header() {
    const [toolsOpen, setToolsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                ResizeMe
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {/* Unified Tools Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setToolsOpen(!toolsOpen)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${toolsOpen
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60'
                                        }`}
                                >
                                    <span>All Tools</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${toolsOpen ? 'rotate-180 text-blue-600' : ''}`} />
                                </button>

                                {toolsOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-3 grid grid-cols-2 gap-1 z-50 animate-fade-in">
                                        {allTools.map((tool) => (
                                            <Link
                                                key={tool.href}
                                                href={tool.href}
                                                onClick={() => setToolsOpen(false)}
                                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                                    <tool.icon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {tool.name}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                                        {tool.desc}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/tools/resize/bulk"
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-lg transition-colors"
                            >
                                Bulk Resize
                            </Link>

                            <Link
                                href="/blog"
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-lg transition-colors"
                            >
                                Knowledge Hub
                            </Link>
                        </div>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto space-y-4">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Image Editing Tools
                            </div>
                            {allTools.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <tool.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="font-medium">{tool.name}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                            <Link
                                href="/blog"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                            >
                                Knowledge Hub & Guides
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                            >
                                About ResizeMe
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
