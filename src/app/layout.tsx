import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import { GoogleAnalytics } from '@next/third-parties/google';
import InteractiveDotsBackground from "@/components/ui/InteractiveDotsBackground";
import { ENABLE_INTERACTIVE_BACKGROUND } from "@/config/ui";
import AdBanner from "@/components/AdBanner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://resizeme.in'),
  title: {
    default: "ResizeMe - Private Image Tools That Run On Your Device",
    template: "%s | ResizeMe"
  },
  description: "Private browser-based image tools. Resize, crop, compress, and convert PNG, JPG, and WebP images instantly on your local device. No uploads required, 100% private.",
  keywords: ["private image resizer", "no upload image compressor", "local image converter", "browser-based image toolkit", "privacy-first image tools", "secure batch resize"],
  authors: [{ name: "ResizeMe Team" }],
  creator: "ResizeMe",
  publisher: "ResizeMe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resizeme.in',
    siteName: 'ResizeMe',
    title: 'ResizeMe - Private Image Tools That Run On Your Device',
    description: 'Resize, crop, compress, and convert images instantly with private browser-based tools.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'ResizeMe Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResizeMe - Private Image Tools That Run On Your Device',
    description: 'Resize, crop, compress, and convert images instantly.',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const footerAdSlot = process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT;
  const adsEnabled =
    process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' &&
    Boolean(publisherId) &&
    !publisherId?.includes('XXXX') &&
    !publisherId?.includes('INSERT_');
  const hasValidFooterSlot =
    Boolean(footerAdSlot) &&
    !footerAdSlot?.includes('XXXX') &&
    !footerAdSlot?.includes('INSERT_');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ResizeMe",
              url: "https://resizeme.in",
              logo: "https://resizeme.in/logo.png",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ResizeMe",
              url: "https://resizeme.in",
              description:
                "Private browser-based image tools for resizing, cropping, compressing, and converting images.",
              inLanguage: "en",
            }),
          }}
        />
        {/* Google AdSense */}
        {adsEnabled && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <PWAInstallBanner />
          {ENABLE_INTERACTIVE_BACKGROUND && <InteractiveDotsBackground />}
          <main className="min-h-screen relative z-10">
            {children}
          </main>

          {adsEnabled && hasValidFooterSlot && footerAdSlot && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full border-t border-gray-100 dark:border-gray-800/50 mt-12 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="text-center text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Advertisement</div>
              <AdBanner dataAdSlot={footerAdSlot} dataAdFormat="horizontal" />
            </div>
          )}

          <Footer />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
