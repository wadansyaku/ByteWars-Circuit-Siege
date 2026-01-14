/**
 * Skin Data Definitions
 * Cosmetic items that change unit appearance
 */

export type SkinRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface SkinData {
    id: string;
    name: string;
    nameJa: string;
    unitId: string;           // Target unit
    color: string;            // Main color (hex)
    glowColor?: string;       // Glow effect color
    icon?: string;            // Alternative icon emoji
    rarity: SkinRarity;
    price: { coins?: number; gems?: number };
    gachaOnly?: boolean;      // Only obtainable via gacha
}

// Rarity colors for UI
export const RARITY_COLORS: Record<SkinRarity, string> = {
    common: '#9CA3AF',     // gray
    rare: '#3B82F6',       // blue
    epic: '#A855F7',       // purple
    legendary: '#F59E0B',  // gold
};

// Rarity gacha weights (higher = more common)
export const RARITY_WEIGHTS: Record<SkinRarity, number> = {
    common: 60,
    rare: 25,
    epic: 12,
    legendary: 3,
};

export const SKINS: SkinData[] = [
    // ByteRunner Skins
    {
        id: 'byterunner_gold',
        name: 'Golden Runner',
        nameJa: 'ゴールドランナー',
        unitId: 'byterunner',
        color: '#FFD700',
        glowColor: 'rgba(255, 215, 0, 0.4)',
        rarity: 'rare',
        price: { coins: 500 },
    },
    {
        id: 'byterunner_neon',
        name: 'Neon Runner',
        nameJa: 'ネオンランナー',
        unitId: 'byterunner',
        color: '#00FFFF',
        glowColor: 'rgba(0, 255, 255, 0.4)',
        rarity: 'epic',
        price: { gems: 150 },
    },
    {
        id: 'byterunner_shadow',
        name: 'Shadow Runner',
        nameJa: 'シャドウランナー',
        unitId: 'byterunner',
        color: '#1F1F1F',
        glowColor: 'rgba(128, 0, 255, 0.4)',
        icon: '👤',
        rarity: 'legendary',
        gachaOnly: true,
        price: {},
    },

    // ShieldGolem Skins
    {
        id: 'shieldgolem_diamond',
        name: 'Diamond Golem',
        nameJa: 'ダイヤモンドゴーレム',
        unitId: 'shieldgolem',
        color: '#B9F2FF',
        glowColor: 'rgba(185, 242, 255, 0.4)',
        rarity: 'epic',
        price: { gems: 200 },
    },
    {
        id: 'shieldgolem_ruby',
        name: 'Ruby Golem',
        nameJa: 'ルビーゴーレム',
        unitId: 'shieldgolem',
        color: '#E0115F',
        glowColor: 'rgba(224, 17, 95, 0.4)',
        rarity: 'rare',
        price: { coins: 800 },
    },
    {
        id: 'shieldgolem_obsidian',
        name: 'Obsidian Golem',
        nameJa: '黒曜石ゴーレム',
        unitId: 'shieldgolem',
        color: '#0B1215',
        glowColor: 'rgba(75, 0, 130, 0.4)',
        icon: '🪨',
        rarity: 'legendary',
        gachaOnly: true,
        price: {},
    },

    // ArcSlinger Skins
    {
        id: 'arcslinger_flame',
        name: 'Flame Slinger',
        nameJa: 'フレイムスリンガー',
        unitId: 'arcslinger',
        color: '#FF4500',
        glowColor: 'rgba(255, 69, 0, 0.4)',
        rarity: 'rare',
        price: { coins: 600 },
    },
    {
        id: 'arcslinger_ice',
        name: 'Ice Slinger',
        nameJa: 'アイススリンガー',
        unitId: 'arcslinger',
        color: '#87CEEB',
        glowColor: 'rgba(135, 206, 235, 0.4)',
        rarity: 'epic',
        price: { gems: 180 },
    },

    // NovaBurst Skins
    {
        id: 'novaburst_plasma',
        name: 'Plasma Burst',
        nameJa: 'プラズマバースト',
        unitId: 'novaburst',
        color: '#FF00FF',
        glowColor: 'rgba(255, 0, 255, 0.4)',
        rarity: 'epic',
        price: { gems: 200 },
    },
    {
        id: 'novaburst_supernova',
        name: 'Supernova',
        nameJa: 'スーパーノヴァ',
        unitId: 'novaburst',
        color: '#FFFFFF',
        glowColor: 'rgba(255, 255, 200, 0.6)',
        icon: '⭐',
        rarity: 'legendary',
        gachaOnly: true,
        price: {},
    },

    // SyncDrone Skins
    {
        id: 'syncdrone_holo',
        name: 'Holographic Drone',
        nameJa: 'ホログラムドローン',
        unitId: 'syncdrone',
        color: '#00FF88',
        glowColor: 'rgba(0, 255, 136, 0.4)',
        rarity: 'rare',
        price: { coins: 550 },
    },

    // HexBit Skins
    {
        id: 'hexbit_inferno',
        name: 'Inferno Bit',
        nameJa: 'インフェルノビット',
        unitId: 'hexbit',
        color: '#FF0000',
        glowColor: 'rgba(255, 0, 0, 0.5)',
        icon: '🔥',
        rarity: 'epic',
        price: { gems: 180 },
    },
    {
        id: 'hexbit_void',
        name: 'Void Bit',
        nameJa: 'ヴォイドビット',
        unitId: 'hexbit',
        color: '#4B0082',
        glowColor: 'rgba(75, 0, 130, 0.5)',
        icon: '🌑',
        rarity: 'legendary',
        gachaOnly: true,
        price: {},
    },
];

/**
 * Get all skins for a specific unit
 */
export function getSkinsForUnit(unitId: string): SkinData[] {
    return SKINS.filter(skin => skin.unitId === unitId);
}

/**
 * Get skin by ID
 */
export function getSkinById(skinId: string): SkinData | undefined {
    return SKINS.find(skin => skin.id === skinId);
}

/**
 * Get purchasable skins (not gacha-only)
 */
export function getPurchasableSkins(): SkinData[] {
    return SKINS.filter(skin => !skin.gachaOnly);
}

/**
 * Get gacha-only skins
 */
export function getGachaOnlySkins(): SkinData[] {
    return SKINS.filter(skin => skin.gachaOnly);
}

/**
 * Get skins by rarity
 */
export function getSkinsByRarity(rarity: SkinRarity): SkinData[] {
    return SKINS.filter(skin => skin.rarity === rarity);
}
