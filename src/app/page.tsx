'use client';

import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import VisitorCounter from '@/components/VisitorCounter';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import UltimateGuide from '@/components/sections/UltimateGuide';
import TrustAndArchitecture from '@/components/sections/TrustAndArchitecture';
import AdBanner from '@/components/AdBanner';
import { useState } from 'react';
import {
  Maximize2, Crop, Minimize2, RefreshCw, Sparkles, Shield, Zap,
  Smile, Pipette, RotateCw, FlipHorizontal, Maximize,
  Users, Star, Clock, Lock, CheckCircle2, ChevronDown, ChevronUp,
  ImageIcon, Eraser, Pencil, Cpu, ArrowRight
} from 'lucide-react';

const stats = [
  { icon: Users, value: '10M+', label: 'Images Optimized' },
  { icon: Star, value: '4.9/5', label: 'User Rating' },
  { icon: Clock, value: '< 2s', label: 'Average Speed' },
  { icon: Lock, value: '100%', label: 'Private & Secure' },
];

const secondaryTools = {
  editing: [
    {
      icon: Crop, title: 'Image Crop', href: '/tools/crop',
      description: 'Crop with precision. Choose preset aspect ratios or custom sizes.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: RotateCw, title: 'Rotate Image', href: '/tools/rotate',
      description: 'Rotate by 90°, 180°, 270°, or custom angles. Fix orientation in seconds.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: FlipHorizontal, title: 'Flip Image', href: '/tools/flip',
      description: 'Flip horizontally or vertically. Create mirror effects with one click.',
      gradient: 'from-red-500 to-pink-500',
    },
  ],
  ai: [
    {
      icon: Eraser, title: 'Background Remover', href: '/tools/background-remover',
      description: 'Remove image backgrounds in seconds using local/in-memory AI. Clean PNG exports.',
      gradient: 'from-violet-500 to-purple-500', badge: 'Popular',
      badgeColor: 'bg-green-400 text-green-900',
    },
    {
      icon: Maximize, title: 'Image Enlarger', href: '/tools/enlarge',
      description: 'Upscale images up to 4x with smart sharpening. AI-powered detail restoration.',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: Pencil, title: 'Watermark Photo', href: '/tools/watermark',
      description: 'Add text or image watermarks to protect your photos and personal identity.',
      gradient: 'from-cyan-500 to-blue-500', badge: 'New',
      badgeColor: 'bg-indigo-400 text-indigo-900',
    },
  ],
  utilities: [
    {
      icon: ImageIcon, title: 'Bulk Resize', href: '/tools/resize/bulk',
      description: 'Resize multiple images at once. Apply same settings and download as ZIP.',
      gradient: 'from-sky-500 to-indigo-500', badge: 'Bulk',
      badgeColor: 'bg-purple-400 text-purple-900',
    },
    {
      icon: Smile, title: 'Meme Generator', href: '/tools/meme-generator',
      description: 'Create viral memes with custom texts, sizes, fonts, and instant local exports.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Pipette, title: 'Color Picker', href: '/tools/color-picker',
      description: 'Extract exact color palettes from any image in HEX, RGB, and HSL formats.',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ]
};

const useCases = [
  { emoji: '✍️', role: 'Bloggers', desc: 'Optimized images for faster page loads and better SEO rankings.' },
  { emoji: '📱', role: 'Social Media Managers', desc: 'Get perfect sizes for Instagram, Facebook, and YouTube.' },
  { emoji: '💻', role: 'Web Developers', desc: 'Improve performance and Core Web Vitals with optimized assets.' },
  { emoji: '🎨', role: 'Designers', desc: 'Convert formats and compress images without losing quality.' },
  { emoji: '🎓', role: 'Students', desc: 'Quickly resize images for presentations and assignments.' },
  { emoji: '🏢', role: 'Professionals', desc: 'Prepare images for reports, emails, and marketing materials.' },
];

const faqs = [
  {
    q: 'Does resizing or compressing reduce image quality?',
    a: 'Not with ResizeMe. Our smart lossy and lossless algorithms adjust file structures and remove redundant metadata, giving you huge size reductions (often up to 90%) with zero visible quality loss.',
  },
  {
    q: 'Are my images uploaded to any server?',
    a: 'No. ResizeMe is designed as a privacy-first platform. Basic operations run entirely in your local browser sandbox. Advanced tasks (like AI background removal or specialized WebP conversion) process temporarily in secure, in-memory serverless functions that immediately discard the payload without saving or writing files. Your images remain private at all times.',
  },
  {
    q: 'Is ResizeMe free to use?',
    a: 'Yes, 100% free with no registration, no watermarks, no account limits, and no premium paywalls.',
  },
  {
    q: 'Does it support bulk processing?',
    a: 'Yes! Use our Bulk Resize tool to drag and drop multiple images at once, apply identical dimension scale constraints, and download everything grouped as a compressed ZIP file.',
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center p-5 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white pr-4 text-base md:text-lg">{faq.q}</h3>
            {open === i
              ? <ChevronUp className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 animate-fade-in text-sm md:text-base leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-950">

      {/* ─── Hero Section ─── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs md:text-sm font-semibold tracking-wide animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              100% Secure · On-Device Processing · Free Forever
            </div>

            {/* Premium Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] animate-fade-in">
              <span className="block mb-2">Optimize Your Images</span>
              <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent shimmer-text pb-1">
                With Absolute Privacy
              </span>
            </h1>

            {/* Value Proposition Tagline */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              Private image tools that run entirely on your device.
              <span className="block font-normal text-sm sm:text-base mt-2 text-gray-500">
                No slow uploads, no server storage, and no tracking. Process, resize, and compress your private digital assets in milliseconds directly in your browser.
              </span>
            </p>
          </div>

          {/* ─── 3 Primary CTAs Above Fold ─── */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* CTA 1: Resize */}
            <Link href="/tools/resize" className="group block relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-md" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between border border-white/20">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Resize Image</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Scale image heights and widths instantly using exact pixel dimensions or relative percentage settings.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1.5 transition-transform duration-300 text-sm">
                  Start Resizing <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* CTA 2: Compress */}
            <Link href="/tools/compress" className="group block relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-md" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between border border-white/20">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                    <Minimize2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Compress Image</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Reduce raw image file size up to 90% while retaining full visual clarity using MozJPEG & WebP algorithms.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-1.5 transition-transform duration-300 text-sm">
                  Start Compressing <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* CTA 3: Convert */}
            <Link href="/tools/convert" className="group block relative rounded-2xl p-0.5 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-md" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between border border-white/20">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Convert Image</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Swap formats in one click. Convert PNG to WebP, JPEG to PNG, SVG, or crop HEIC files without data leaks.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1.5 transition-transform duration-300 text-sm">
                  Start Converting <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* ─── Premium Glassmorphic Trust Strip ─── */}
          <div className="mt-12 md:mt-16 glass rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 max-w-5xl mx-auto shadow-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200/50 dark:divide-gray-800/50">
              {/* Trust Strip Item 1 */}
              <div className="flex items-start gap-4 p-2">
                <div className="bg-purple-100 dark:bg-purple-950/40 p-2.5 rounded-xl text-purple-600 dark:text-purple-400 flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">No Uploads</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Processed locally or in-memory, never stored.</p>
                </div>
              </div>

              {/* Trust Strip Item 2 */}
              <div className="flex items-start gap-4 p-2 pt-4 lg:pt-0 lg:pl-6">
                <div className="bg-indigo-100 dark:bg-indigo-950/40 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Browser-Based</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bypasses server latency via client-side engines.</p>
                </div>
              </div>

              {/* Trust Strip Item 3 */}
              <div className="flex items-start gap-4 p-2 pt-4 lg:pt-0 lg:pl-6">
                <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Free Forever</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">No premium limits or account registration required.</p>
                </div>
              </div>

              {/* Trust Strip Item 4 */}
              <div className="flex items-start gap-4 p-2 pt-4 lg:pt-0 lg:pl-6">
                <div className="bg-pink-100 dark:bg-pink-950/40 p-2.5 rounded-xl text-pink-600 dark:text-pink-400 flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Fast Processing</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Get optimized high-quality results in sub-2 seconds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="py-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-inner relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i} className="text-white animate-count-up" style={{ animationDelay: `${i * 100}ms` }}>
                <s.icon className="w-7 h-7 mx-auto mb-2 opacity-80 text-white/90" />
                <div className="text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs uppercase font-semibold tracking-wider opacity-70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categorized More Specialized Tools Section ─── */}
      <section id="more-tools" className="py-20 bg-gray-50/50 dark:bg-gray-950/30 relative z-10 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              More Specialized Image Tools
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Explore secondary processing utility kits designed for specific adjustments, quick formats, and custom assets. Everything is optimized to run locally in-browser or safely in ephemeral memory.
            </p>
          </div>

          <div className="space-y-12">
            {/* Category 1: Precision & Aspect Adjustments */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-950 dark:text-gray-100 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Precision & Aspect Adjustments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryTools.editing.map((tool, index) => (
                  <div key={tool.title} className="animate-slide-in-up" style={{ animationDelay: `${index * 60}ms` }}>
                    <ToolCard {...tool} />
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: AI Utilities & Watermarking */}
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-bold text-gray-950 dark:text-gray-100 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                AI Utilities & Enhancements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryTools.ai.map((tool, index) => (
                  <div key={tool.title} className="animate-slide-in-up" style={{ animationDelay: `${index * 60}ms` }}>
                    <ToolCard {...tool} />
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: Bulk Processing & Web Tools */}
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-bold text-gray-950 dark:text-gray-100 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Productivity & Web Utilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryTools.utilities.map((tool, index) => (
                  <div key={tool.title} className="animate-slide-in-up" style={{ animationDelay: `${index * 60}ms` }}>
                    <ToolCard {...tool} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Before / After Section ─── */}
      <section className="py-20 bg-white dark:bg-gray-950 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              See the Optimization Difference
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Drag the interactive slider to compare original photos with compressed ones side-by-side.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <BeforeAfterSlider
                beforeSrc="/before.jpg"
                afterSrc="/after.jpg"
                beforeLabel="Original RAW"
                beforeSubLabel="2.4 MB"
                afterLabel="Optimized"
                afterSubLabel="210 KB (91% Saved)"
              />
              <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
                👆 Drag the visual slider to inspect visual fidelity
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                91% File Size Reduction — Visually Identical
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our smart compression engine applies perceptual encoding and strips hidden, heavy metadata, shrinking files dramatically while preserving every visible pixel exactly as your eyes see them.
              </p>
              <ul className="space-y-3">
                {[
                  'Web pages and assets load 10× faster',
                  'Higher Google PageSpeed & Core Web Vitals scores',
                  'Frees up disk space and system memory limits',
                  'Fast downloads and instant sharing capabilities',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/tools/compress" className="btn btn-primary inline-flex text-base mt-2">
                Try Image Compressor Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Who Uses ResizeMe ─── */}
      <section className="py-20 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-gray-950 dark:to-gray-900 relative z-10 border-y border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Designed for Creators & Professionals
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              ResizeMe handles massive web compression and scaling workflows for users demanding both security and speed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div key={uc.role} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100/85 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="text-3xl mb-3">{uc.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{uc.role}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Guides & Resources ─── */}
      <section className="py-20 bg-white dark:bg-gray-950 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Learn Image Optimization</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Master digital assets and web performance with our complete user resources.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/what-is-image-resizing" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">What is Image Resizing?</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Learn how resizing differs from cropping and physical compression ratios.</p>
            </Link>
            <Link href="/why-image-optimization-matters" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Why Optimization Matters</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Discover optimization impacts on organic Google rankings and UX bounce rates.</p>
            </Link>
            <Link href="/social-media-image-sizes" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Social Media Dimensions</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Detailed templates for perfect Instagram sizes, YouTube cards, and banners.</p>
            </Link>
            <Link href="/image-format-guide" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Image Format Guide</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">JPEG vs PNG vs WebP vs SVG. Learn exactly which format to select and when.</p>
            </Link>
          </div>
        </div>
      </section>

      <UltimateGuide />

      <TrustAndArchitecture />

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 bg-gray-50/50 dark:bg-gray-900/30 relative z-10 border-t border-gray-100 dark:border-gray-900 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
          </div>
          <FAQ />
        </div>
      </section>
    </div>
  );
}
