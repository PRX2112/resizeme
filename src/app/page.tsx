'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Sliders,
  Layers,
  Scissors,
  Minimize2,
  RefreshCw,
  Eraser,
  Maximize,
  Pencil,
  Smile,
  Pipette,
  RotateCw,
  FlipHorizontal,
  ShieldCheck,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import UltimateGuide from '@/components/sections/UltimateGuide';
import AdBanner from '@/components/AdBanner';

const coreTools = [
  {
    name: 'Image Resizer',
    href: '/tools/resize',
    badge: 'Popular',
    desc: 'Scale exact pixel dimensions (W × H) or percentages with aspect ratio lock.',
    icon: Sliders,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    name: 'Bulk Resizer (ZIP)',
    href: '/tools/resize/bulk',
    badge: 'Batch',
    desc: 'Resize multiple images simultaneously and download as a single ZIP.',
    icon: Layers,
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
  },
  {
    name: 'Image Compressor',
    href: '/tools/compress',
    badge: 'Save 90%',
    desc: 'Reduce file size to exact KB targets (50KB, 100KB, 200KB) with lossless clarity.',
    icon: Minimize2,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  {
    name: 'Format Converter',
    href: '/tools/convert',
    badge: 'HEIC Support',
    desc: 'Convert between PNG, JPG, WebP, AVIF, GIF, and decode iPhone HEIC photos.',
    icon: RefreshCw,
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400',
  },
  {
    name: 'Image Cropper',
    href: '/tools/crop',
    desc: 'Crop to standard ratios (16:9, 4:5, 1:1, 9:16) or custom freeform crops.',
    icon: Scissors,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400',
  },
  {
    name: 'AI Background Remover',
    href: '/tools/background-remover',
    badge: 'WASM AI',
    desc: 'Remove backgrounds and isolate subjects with in-browser neural segmentation.',
    icon: Eraser,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400',
  },
  {
    name: 'Image Enlarger',
    href: '/tools/enlarge',
    desc: 'Upscale low-res images 2x or 4x with Lanczos3 sinc reconstruction filters.',
    icon: Maximize,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
  },
  {
    name: 'Watermark Photo',
    href: '/tools/watermark',
    desc: 'Protect digital photos with custom text stamps, logo overlays, or 45° grids.',
    icon: Pencil,
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400',
  },
  {
    name: 'Meme Generator',
    href: '/tools/meme-generator',
    desc: 'Create viral memes with Retina high-DPI text and mobile touch drag controls.',
    icon: Smile,
    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/60 dark:text-yellow-400',
  },
  {
    name: 'Color Picker & Loupe',
    href: '/tools/color-picker',
    desc: 'Sample pixel colors with native EyeDropper API and a 10x magnifying loupe.',
    icon: Pipette,
    color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/60 dark:text-pink-400',
  },
  {
    name: 'Rotate Image',
    href: '/tools/rotate',
    desc: 'Rotate photos 90°, 180°, 270°, or adjust fine tilt with custom angle sliders.',
    icon: RotateCw,
    color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400',
  },
  {
    name: 'Flip Image',
    href: '/tools/flip',
    desc: 'Mirror images horizontally or vertically in your browser with zero latency.',
    icon: FlipHorizontal,
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/60 dark:text-orange-400',
  },
];

const faqs = [
  {
    q: 'Does resizing or compressing reduce image quality?',
    a: 'Not with ResizeMe. Our lossy and lossless algorithms adjust file structures, quantize color palettes, and strip redundant metadata, giving you huge size reductions (often up to 90%) with zero visible quality loss.',
  },
  {
    q: 'Are my images uploaded or stored on any server?',
    a: 'No. ResizeMe is designed as a privacy-first platform. Basic operations run entirely on your device via the HTML5 Canvas API. Heavy tasks execute in ephemeral memory and are immediately discarded. Your private photos never stay on any server.',
  },
  {
    q: 'Is ResizeMe free to use?',
    a: 'Yes, 100% free with no registration, no watermarks, and no usage limits.',
  },
  {
    q: 'Does it support bulk processing?',
    a: 'Yes! Use our Bulk Resize tool to drag and drop multiple images at once, apply unified dimensions or percentages, and download everything as a ZIP archive.',
  },
  {
    q: 'What image formats are supported?',
    a: 'ResizeMe supports PNG, JPEG, JPG, WebP, AVIF, GIF, SVG, and iPhone HEIC/HEIF files directly in the browser.',
  },
];

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const contentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

  // Structured Data (JSON-LD) for Schema.org FAQPage compliance
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Schema.org FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ─── Streamlined Minimalist Hero ─── */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          {/* 3 Subtle Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <Lock className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Uploads
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
              <Zap className="w-3.5 h-3.5" /> Free & No Sign-up
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Free, Private <span className="text-blue-600 dark:text-blue-400">Image Tools</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Resize, compress, convert, crop, and edit digital images directly in your browser. Fast, lossless, and 100% secure.
          </p>
        </div>
      </section>

      {/* ─── Primary 12-Tool Launchpad Grid (Direct 1-Click Access) ─── */}
      <section className="py-10 sm:py-12 border-b border-gray-100 dark:border-gray-900 bg-gray-50/40 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select an Image Utility
            </h2>
            <Link
              href="/tools/resize/bulk"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Batch Mode</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500/50 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {tool.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Clean AdSense In-Content Placement (Zero CLS) ─── */}
      {contentAdSlot && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdBanner dataAdSlot={contentAdSlot} dataAdFormat="horizontal" />
        </div>
      )}

      {/* ─── AdSense Editorial Authority: Complete Ultimate Guide ─── */}
      <UltimateGuide />

      {/* ─── Frequently Asked Questions (Accordion) ─── */}
      <section id="faq" className="py-14 border-t border-gray-100 dark:border-gray-900 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Clear answers to common questions about our browser-based image toolkit.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-semibold text-gray-900 dark:text-white text-sm sm:text-base hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
