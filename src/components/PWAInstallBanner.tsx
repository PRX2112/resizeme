'use client';

import { usePWA } from '@/hooks/usePWA';
import { Download, MonitorSmartphone, Check } from 'lucide-react';

export default function PWAInstallButton({ className = '' }: { className?: string }) {
  const { isInstallable, isInstalled, install } = usePWA();

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        <Check className="w-3.5 h-3.5 text-green-500" />
        <span>PWA App Installed</span>
      </div>
    );
  }

  if (!isInstallable) return null;

  return (
    <button
      onClick={() => install()}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors shadow-sm ${className}`}
      title="Install ResizeMe as a standalone desktop/mobile app for offline usage"
    >
      <MonitorSmartphone className="w-3.5 h-3.5 text-primary" />
      <span>Install Offline App</span>
    </button>
  );
}
