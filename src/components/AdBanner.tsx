'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
}

export default function AdBanner({
    dataAdSlot,
    dataAdFormat = 'auto',
    dataFullWidthResponsive = true,
    className = '',
}: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Only initialize the ad once, and ensure we're in the browser
        if (
            typeof window !== 'undefined' &&
            process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' &&
            process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID &&
            !hasInitialized.current &&
            adRef.current
        ) {
            try {
                // @ts-ignore - The adsbygoogle array is injected globally by the AdSense script
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                hasInitialized.current = true;
            } catch (error) {
                console.error('AdSense initialization failed:', error);
            }
        }
    }, []);

    const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

    // Do not expose empty or placeholder ad slots during site review.
    if (!PUBLISHER_ID || !ADS_ENABLED || !dataAdSlot || dataAdSlot.includes('INSERT_')) {
        return null;
    }

    return (
        <div className={`w-full overflow-hidden flex justify-center ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '250px', width: '100%' }}
                data-ad-client={PUBLISHER_ID}
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive.toString()}
            />
        </div>
    );
}
