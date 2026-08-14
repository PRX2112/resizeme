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

    const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

    // Comprehensive guard: Never render empty container boxes, placeholders, or broken borders
    // while AdSense is disabled, pending approval, or using placeholder keys.
    const isInvalid =
        !PUBLISHER_ID ||
        !ADS_ENABLED ||
        !dataAdSlot ||
        PUBLISHER_ID.includes('XXXX') ||
        PUBLISHER_ID.includes('INSERT_') ||
        dataAdSlot.includes('XXXX') ||
        dataAdSlot.includes('INSERT_');

    useEffect(() => {
        // Only initialize the ad once, and ensure we're in the browser with valid credentials
        if (
            typeof window !== 'undefined' &&
            !isInvalid &&
            !hasInitialized.current &&
            adRef.current
        ) {
            try {
                // @ts-ignore - The adsbygoogle array is injected globally by the AdSense script
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                hasInitialized.current = true;
            } catch (error) {
                console.error('AdSense initialization error:', error);
            }
        }
    }, [isInvalid]);

    if (isInvalid) {
        return null;
    }

    return (
        <div className={`w-full overflow-hidden flex justify-center ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client={PUBLISHER_ID}
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive.toString()}
            />
        </div>
    );
}
