/**
 * Gacha System
 * Randomized skin acquisition with weighted probabilities
 */

import { SKINS, SkinData, SkinRarity, RARITY_WEIGHTS } from './skins';
import { spendGems, addSkin, recordGacha, getPlayerData } from '@/utils/playerData';

export interface GachaBanner {
    id: string;
    name: string;
    nameJa: string;
    description: string;
    cost: { gems: number };
    featuredSkinIds?: string[];  // Higher rate for these
    featuredBoost: number;       // Multiplier for featured items
}

export const GACHA_BANNERS: GachaBanner[] = [
    {
        id: 'standard',
        name: 'Standard Gacha',
        nameJa: 'スタンダードガチャ',
        description: '全スキンが対象。レジェンダリー確率3%',
        cost: { gems: 100 },
        featuredBoost: 1,
    },
    {
        id: 'legendary_up',
        name: 'Legendary Rate Up',
        nameJa: 'レジェンダリー確率UP',
        description: 'レジェンダリー確率2倍！',
        cost: { gems: 150 },
        featuredBoost: 2,
    },
];

/**
 * Calculate drop rates for display
 */
export function getDropRates(bannerId: string): Record<SkinRarity, number> {
    const banner = GACHA_BANNERS.find(b => b.id === bannerId);
    const boost = banner?.featuredBoost || 1;

    const baseTotal = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
    const legendaryBoost = boost > 1 ? (RARITY_WEIGHTS.legendary * boost) - RARITY_WEIGHTS.legendary : 0;
    const total = baseTotal + legendaryBoost;

    return {
        common: (RARITY_WEIGHTS.common / total) * 100,
        rare: (RARITY_WEIGHTS.rare / total) * 100,
        epic: (RARITY_WEIGHTS.epic / total) * 100,
        legendary: ((RARITY_WEIGHTS.legendary * boost) / total) * 100,
    };
}

/**
 * Roll gacha - returns the won skin
 */
export function rollGacha(bannerId: string): SkinData | null {
    const banner = GACHA_BANNERS.find(b => b.id === bannerId);
    if (!banner) return null;

    // Check if player can afford
    const playerData = getPlayerData();
    if (playerData.gems < banner.cost.gems) {
        return null;
    }

    // Deduct gems
    if (!spendGems(banner.cost.gems)) {
        return null;
    }

    // Determine rarity first
    const rarity = rollRarity(banner.featuredBoost);

    // Get available skins of that rarity
    const availableSkins = SKINS.filter(s => s.rarity === rarity);
    if (availableSkins.length === 0) {
        // Fallback to any skin if none of that rarity
        const fallback = SKINS[Math.floor(Math.random() * SKINS.length)];
        recordGacha(bannerId, fallback.id);
        addSkin(fallback.id);
        return fallback;
    }

    // Random skin from that rarity
    const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];

    // Record and grant
    recordGacha(bannerId, wonSkin.id);
    addSkin(wonSkin.id);

    return wonSkin;
}

/**
 * Roll for rarity using weighted random
 */
function rollRarity(legendaryBoost: number = 1): SkinRarity {
    const weights = { ...RARITY_WEIGHTS };
    weights.legendary *= legendaryBoost;

    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * total;

    for (const [rarity, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) {
            return rarity as SkinRarity;
        }
    }

    return 'common';
}

/**
 * Roll gacha multiple times (10-pull)
 */
export function rollGachaMulti(bannerId: string, count: number = 10): SkinData[] {
    const results: SkinData[] = [];

    for (let i = 0; i < count; i++) {
        const result = rollGacha(bannerId);
        if (result) {
            results.push(result);
        } else {
            break; // Not enough gems
        }
    }

    return results;
}

/**
 * Get banner by ID
 */
export function getBannerById(bannerId: string): GachaBanner | undefined {
    return GACHA_BANNERS.find(b => b.id === bannerId);
}

/**
 * Check if player can afford gacha
 */
export function canAffordGacha(bannerId: string): boolean {
    const banner = GACHA_BANNERS.find(b => b.id === bannerId);
    if (!banner) return false;
    return getPlayerData().gems >= banner.cost.gems;
}

/**
 * Get pity counter (guaranteed after X pulls without legendary)
 */
export function getPityCount(bannerId: string): number {
    const playerData = getPlayerData();
    const bannerHistory = playerData.gachaHistory.filter(h => h.bannerId === bannerId);

    let count = 0;
    for (let i = bannerHistory.length - 1; i >= 0; i--) {
        const skin = SKINS.find(s => s.id === bannerHistory[i].skinId);
        if (skin?.rarity === 'legendary') {
            break;
        }
        count++;
    }

    return count;
}

// Pity threshold (guaranteed legendary after this many pulls)
export const PITY_THRESHOLD = 50;
