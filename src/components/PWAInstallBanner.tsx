'use client';

import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Download, X, Sparkles, MonitorSmartphone } from 'lucide-react';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner only if app is installable and user hasn't dismissed it in this session
    const isDismissed = sessionStorage.getItem('resizeme_pwa_dismissed') === 'true';
    if (isInstallable && !isDismissed && !isInstalled) {
      // Delay slightly for premium feeling
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('resizeme_pwa_dismissed', 'true');
  };

  const handleInstall = async () => {
    const installed = await install();
    if (installed) {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-50 animate-slide-in-up">
      <div className="relative rounded-2xl p-0.5 shadow-2xl">
        {/* Glow boarder */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl opacity-90 blur-sm" />
        
        {/* Main body */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 border border-white/10 flex flex-col gap-4">
          
          {/* Close button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex gap-4 items-start pr-6">
            <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-3 rounded-xl text-white flex-shrink-0 shadow-md">
              <MonitorSmartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-gray-900 dark:text-white text-base">Install ResizeMe App</h4>
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full border border-green-200/30">
                  <Sparkles className="w-2.5 h-2.5" /> offline
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Add to your home screen for lightning-fast launch, offline capability, and seamless zero-upload local image compression.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Install Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-xs transition-colors"
            >
              Later
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
