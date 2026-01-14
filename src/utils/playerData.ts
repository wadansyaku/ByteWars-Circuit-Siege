/**
 * Player Data Management
 * Handles user's in-game currency, owned items, and premium status
 */

export interface GachaResult {
    bannerId: string;
    skinId: string;
    timestamp: number;
}

export interface PlayerData {
    coins: number;              // ゲーム内通貨（無料で獲得可能）
    gems: number;               // 課金通貨
    ownedSkins: string[];       // 所持スキンID
    equippedSkins: Record<string, string>; // unitId -> skinId
    isPremium: boolean;         // 広告非表示フラグ
    gachaHistory: GachaResult[];
}

const STORAGE_KEY = 'bytewars_player_data';

const DEFAULT_PLAYER_DATA: PlayerData = {
    coins: 0,
    gems: 0,
    ownedSkins: [],
    equippedSkins: {},
    isPremium: false,
    gachaHistory: [],
};

/**
 * Load player data from localStorage
 */
export function getPlayerData(): PlayerData {
    if (typeof window === 'undefined') return DEFAULT_PLAYER_DATA;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_PLAYER_DATA, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error('Failed to load player data:', e);
    }
    return DEFAULT_PLAYER_DATA;
}

/**
 * Save player data to localStorage
 */
export function savePlayerData(data: PlayerData): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save player data:', e);
    }
}

/**
 * Add coins to player
 */
export function addCoins(amount: number): PlayerData {
    const data = getPlayerData();
    data.coins += amount;
    savePlayerData(data);
    return data;
}

/**
 * Add gems to player
 */
export function addGems(amount: number): PlayerData {
    const data = getPlayerData();
    data.gems += amount;
    savePlayerData(data);
    return data;
}

/**
 * Spend coins (returns false if insufficient)
 */
export function spendCoins(amount: number): boolean {
    const data = getPlayerData();
    if (data.coins < amount) return false;
    data.coins -= amount;
    savePlayerData(data);
    return true;
}

/**
 * Spend gems (returns false if insufficient)
 */
export function spendGems(amount: number): boolean {
    const data = getPlayerData();
    if (data.gems < amount) return false;
    data.gems -= amount;
    savePlayerData(data);
    return true;
}

/**
 * Add skin to owned skins
 */
export function addSkin(skinId: string): PlayerData {
    const data = getPlayerData();
    if (!data.ownedSkins.includes(skinId)) {
        data.ownedSkins.push(skinId);
        savePlayerData(data);
    }
    return data;
}

/**
 * Check if player owns a skin
 */
export function ownsSkin(skinId: string): boolean {
    const data = getPlayerData();
    return data.ownedSkins.includes(skinId);
}

/**
 * Equip a skin for a unit
 */
export function equipSkin(unitId: string, skinId: string): PlayerData {
    const data = getPlayerData();
    data.equippedSkins[unitId] = skinId;
    savePlayerData(data);
    return data;
}

/**
 * Unequip skin for a unit (use default)
 */
export function unequipSkin(unitId: string): PlayerData {
    const data = getPlayerData();
    delete data.equippedSkins[unitId];
    savePlayerData(data);
    return data;
}

/**
 * Get equipped skin for a unit (or undefined for default)
 */
export function getEquippedSkin(unitId: string): string | undefined {
    const data = getPlayerData();
    return data.equippedSkins[unitId];
}

/**
 * Set premium status (ad-free)
 */
export function setPremium(isPremium: boolean): PlayerData {
    const data = getPlayerData();
    data.isPremium = isPremium;
    savePlayerData(data);
    return data;
}

/**
 * Check if player is premium
 */
export function isPremium(): boolean {
    return getPlayerData().isPremium;
}

/**
 * Record gacha result
 */
export function recordGacha(bannerId: string, skinId: string): PlayerData {
    const data = getPlayerData();
    data.gachaHistory.push({
        bannerId,
        skinId,
        timestamp: Date.now(),
    });
    savePlayerData(data);
    return data;
}

/**
 * Grant coins on stage clear (reward system)
 */
export function grantStageClearReward(stageId: number, isFirstClear: boolean): number {
    const baseReward = stageId * 10;
    const bonus = isFirstClear ? 50 : 0;
    const total = baseReward + bonus;
    addCoins(total);
    return total;
}
