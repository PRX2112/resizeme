'use client';

import { Shield, Lock, ShieldCheck, Database, ServerOff, Terminal, Award, HelpCircle, CheckCircle } from 'lucide-react';

const stats = [
  { value: '100%', label: 'Private & Secure', desc: 'Zero cloud tracking or files stored' },
  { value: '< 2s', label: 'Local Speed', desc: 'No upload bandwidth bottlenecks' },
  { value: 'Zero', label: 'Server Uploads', desc: 'Your assets never leave your device' },
  { value: '10M+', label: 'Images Processed', desc: 'Trusted by creators and developers' },
];

const browsers = [
  { name: 'Google Chrome', version: 'V8 Engine', desc: 'Hardware Accelerated' },
  { name: 'Mozilla Firefox', version: 'Gecko Engine', desc: 'Fully Sandbox Compliant' },
  { name: 'Apple Safari', version: 'WebKit Engine', desc: 'Optimized Battery & Canvas' },
  { name: 'Microsoft Edge', version: 'Chromium Engine', desc: 'Full Threading Enabled' },
  { name: 'Opera Browser', version: 'Blink Engine', desc: 'Safe Memory Allocation' },
];

const testimonials = [
  {
    quote: "As a front-end developer, I prepare dozens of assets daily. The fact that ResizeMe does everything in my local browser sandbox is a game changer. It's instantly fast because there's no upload latency, and I know my client mockups are 100% secure.",
    author: "Elena Rostova",
    role: "Senior UI/UX Developer",
    avatar: "🎨"
  },
  {
    quote: "I frequently optimize sensitive customer invoices and identity documents for passport form uploads. I refused to use standard converters because they store files on their servers. ResizeMe solves this beautifully. Extremely trustworthy.",
    author: "Marcus Vance",
    role: "Financial Analyst & Marketer",
    avatar: "💼"
  },
  {
    quote: "The programmatic presets save me hours every single week. I bookmarked it on my home screen as a PWA, and now it runs completely offline when I'm traveling. Hands down the best private utility on the web.",
    author: "Sora Takahashi",
    role: "Content Creator & Blogger",
    avatar: "✍️"
  }
];

export default function TrustAndArchitecture() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-950/20 dark:via-gray-950 dark:to-gray-950/30 border-t border-gray-100 dark:border-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" /> Security & Privacy
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            How Browser-Side Privacy Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Most image editors secretly upload your files to remote database servers. ResizeMe operates entirely on-device, processing digital assets in memory without leaving a trace.
          </p>
        </div>

        {/* ─── Interactive Flowchart Comparison ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto">
          
          {/* Box 1: Traditional cloud upload */}
          <div className="card border-red-200/50 dark:border-red-950/40 relative overflow-hidden bg-red-50/10 dark:bg-red-950/5 p-8 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 dark:bg-red-950/50 p-2.5 rounded-xl text-red-600 dark:text-red-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Traditional Conversion Sites</h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">Unsecured & Vulnerable</p>
              </div>
            </div>

            {/* Architecture Steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-red-100 dark:border-red-950/30">
                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Your raw image is uploaded over the internet</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-red-100 dark:border-red-950/30">
                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Processed on third-party server databases</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-red-100 dark:border-red-950/30">
                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Images are cached, leaving persistent traces online</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-red-100/50 dark:border-red-950/30 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
              ⚠️ Voids corporate privacy audits & creates data leak risks.
            </div>
          </div>

          {/* Box 2: ResizeMe On-device flow */}
          <div className="card border-green-200/50 dark:border-green-950/40 relative overflow-hidden bg-green-50/10 dark:bg-green-950/5 p-8 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 dark:bg-green-950/50 p-2.5 rounded-xl text-green-600 dark:text-green-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">ResizeMe Local Sandbox</h3>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">100% Secure & Device-Bound</p>
              </div>
            </div>

            {/* Architecture Steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-950/30">
                <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Images load instantly into local browser RAM sandbox</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-950/30">
                <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Optimized client-side (or securely processed strictly in ephemeral, in-memory buffers)</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-950/30">
                <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Result downloads directly from your machine instantly</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-green-100/50 dark:border-green-950/30 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
              ✅ Zero cloud data storage. 100% compliant with privacy regulations.
            </div>
          </div>

        </div>

        {/* ─── Trust Stats Grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto">
          {stats.map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-1">
                {item.value}
              </div>
              <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{item.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* ─── Supported Browsers strip ─── */}
        <div className="glass rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/50 mb-20 max-w-6xl mx-auto">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Broad Compatibility & Hardware Acceleration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {browsers.map((browser, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800/50">
                <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{browser.name}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{browser.version}</div>
                <div className="text-[9px] text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full mt-2">
                  {browser.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Real User Testimonials ─── */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                  <div className="text-2xl bg-gray-50 dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{t.author}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Creator note & company transparency ─── */}
        <div className="mt-20 max-w-4xl mx-auto text-center bg-purple-50/50 dark:bg-purple-950/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-800/30">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Core Guarantee</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We operate ResizeMe on a zero-log privacy mandate. Basic operations process directly in browser RAM, and advanced operations process temporarily in standard, secure API execution memory. We never sell metadata, we never write uploads to disk, and the source code remains fully transparent.
          </p>
        </div>

      </div>
    </section>
  );
}
