'use client';

import { useEffect } from 'react';
import { isPremium } from '@/utils/playerData';

interface AdBannerProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    className?: string;
}

/**
 * Google AdSense Banner Component
 * Displays ads only for non-premium users
 */
export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
    const userIsPremium = isPremium();

    useEffect(() => {
        if (userIsPremium) return;

        try {
            // Initialize AdSense
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
            console.error('AdSense initialization error:', error);
        }
    }, [userIsPremium]);

    // Don't render for premium users
    if (userIsPremium) {
        return null;
    }

    // Check if AdSense client ID is set
    const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    if (!adClient) {
        // Development fallback
        return (
            <div className={`bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-slate-500 ${className}`}>
                <div className="text-xs">広告スペース</div>
                <div className="text-[10px] text-slate-600">(AdSense未設定)</div>
            </div>
        );
    }

    return (
        <ins
            className={`adsbygoogle ${className}`}
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
        />
    );
}

/**
 * Interstitial Ad Component (full screen between screens)
 */
export function InterstitialAd({ onClose }: { onClose: () => void }) {
    const userIsPremium = isPremium();

    useEffect(() => {
        if (userIsPremium) {
            onClose();
            return;
        }

        // Auto-close after 5 seconds
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [userIsPremium, onClose]);

    if (userIsPremium) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
            <div className="text-white text-sm mb-4">広告</div>

            <div className="w-full max-w-md aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                <AdBanner slot="interstitial" format="rectangle" />
            </div>

            <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
                スキップ
            </button>
        </div>
    );
}
