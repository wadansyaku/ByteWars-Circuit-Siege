const STORAGE_KEYS = {
    UNLOCKED_STAGES: 'bytewars_unlocked_stages',
    SETTINGS: 'bytewars_settings',
    STATS: 'bytewars_stats',
};

export interface GameSettings {
    soundEnabled: boolean;
    volume: number;
}

export interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    totalUnitsDeployed: number;
}

// Stage unlocking
export function getUnlockedStages(): number[] {
    if (typeof window === 'undefined') return [1];

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.UNLOCKED_STAGES);
        if (stored) {
            const stages = JSON.parse(stored);
            if (Array.isArray(stages) && stages.length > 0) {
                return stages;
            }
        }
    } catch (e) {
        console.warn('Failed to load unlocked stages:', e);
    }

    return [1]; // Stage 1 is always unlocked
}

export function unlockStage(stageId: number): void {
    if (typeof window === 'undefined') return;

    try {
        const current = getUnlockedStages();
        if (!current.includes(stageId)) {
            const updated = [...current, stageId].sort((a, b) => a - b);
            localStorage.setItem(STORAGE_KEYS.UNLOCKED_STAGES, JSON.stringify(updated));
        }
    } catch (e) {
        console.warn('Failed to unlock stage:', e);
    }
}

export function isStageUnlocked(stageId: number): boolean {
    return getUnlockedStages().includes(stageId);
}

// Settings
export function getSettings(): GameSettings {
    if (typeof window === 'undefined') {
        return { soundEnabled: true, volume: 0.5 };
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load settings:', e);
    }

    return { soundEnabled: true, volume: 0.5 };
}

export function saveSettings(settings: GameSettings): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.warn('Failed to save settings:', e);
    }
}

// Stats
export function getStats(): GameStats {
    if (typeof window === 'undefined') {
        return { gamesPlayed: 0, gamesWon: 0, totalUnitsDeployed: 0 };
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.STATS);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load stats:', e);
    }

    return { gamesPlayed: 0, gamesWon: 0, totalUnitsDeployed: 0 };
}

export function updateStats(delta: Partial<GameStats>): void {
    if (typeof window === 'undefined') return;

    try {
        const current = getStats();
        const updated: GameStats = {
            gamesPlayed: current.gamesPlayed + (delta.gamesPlayed || 0),
            gamesWon: current.gamesWon + (delta.gamesWon || 0),
            totalUnitsDeployed: current.totalUnitsDeployed + (delta.totalUnitsDeployed || 0),
        };
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
    } catch (e) {
        console.warn('Failed to update stats:', e);
    }
}

// Reset all data
export function resetAllData(): void {
    if (typeof window === 'undefined') return;

    try {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
    } catch (e) {
        console.warn('Failed to reset data:', e);
    }
}
