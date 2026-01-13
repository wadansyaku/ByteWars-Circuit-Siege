// User activity logging for analytics and experience improvement

const STORAGE_KEY = 'bytewars_analytics';

export interface GameEvent {
    type: 'game_start' | 'game_end' | 'unit_deploy' | 'stage_unlock' | 'session_start';
    timestamp: number;
    data?: Record<string, unknown>;
}

export interface AnalyticsData {
    sessionCount: number;
    totalPlayTime: number; // in seconds
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    unitsDeployed: Record<string, number>; // unitId -> count
    stagesCompleted: number[];
    favoriteUnit: string | null;
    lastPlayedAt: number;
    events: GameEvent[];
}

const defaultAnalytics: AnalyticsData = {
    sessionCount: 0,
    totalPlayTime: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    unitsDeployed: {},
    stagesCompleted: [],
    favoriteUnit: null,
    lastPlayedAt: 0,
    events: [],
};

export function getAnalytics(): AnalyticsData {
    if (typeof window === 'undefined') return defaultAnalytics;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...defaultAnalytics, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.warn('Failed to load analytics:', e);
    }

    return defaultAnalytics;
}

function saveAnalytics(data: AnalyticsData): void {
    if (typeof window === 'undefined') return;

    try {
        // Keep only last 100 events to prevent storage bloat
        const trimmedData = {
            ...data,
            events: data.events.slice(-100),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedData));
    } catch (e) {
        console.warn('Failed to save analytics:', e);
    }
}

export function logEvent(event: GameEvent): void {
    const analytics = getAnalytics();
    analytics.events.push(event);
    analytics.lastPlayedAt = Date.now();
    saveAnalytics(analytics);
}

export function logSessionStart(): void {
    const analytics = getAnalytics();
    analytics.sessionCount++;
    logEvent({ type: 'session_start', timestamp: Date.now() });
}

export function logGameStart(stageId: number): void {
    logEvent({
        type: 'game_start',
        timestamp: Date.now(),
        data: { stageId },
    });
}

export function logGameEnd(stageId: number, result: 'win' | 'lose', duration: number): void {
    const analytics = getAnalytics();

    analytics.gamesPlayed++;
    if (result === 'win') {
        analytics.gamesWon++;
        if (!analytics.stagesCompleted.includes(stageId)) {
            analytics.stagesCompleted.push(stageId);
        }
    } else {
        analytics.gamesLost++;
    }

    analytics.totalPlayTime += duration;

    logEvent({
        type: 'game_end',
        timestamp: Date.now(),
        data: { stageId, result, duration },
    });

    saveAnalytics(analytics);
}

export function logUnitDeploy(unitId: string): void {
    const analytics = getAnalytics();

    analytics.unitsDeployed[unitId] = (analytics.unitsDeployed[unitId] || 0) + 1;

    // Update favorite unit
    let maxCount = 0;
    let favorite: string | null = null;
    for (const [id, count] of Object.entries(analytics.unitsDeployed)) {
        if (count > maxCount) {
            maxCount = count;
            favorite = id;
        }
    }
    analytics.favoriteUnit = favorite;

    saveAnalytics(analytics);

    logEvent({
        type: 'unit_deploy',
        timestamp: Date.now(),
        data: { unitId },
    });
}

export function getPlayStats(): {
    winRate: number;
    totalGames: number;
    favoriteUnit: string | null;
    totalPlayTimeMinutes: number;
} {
    const analytics = getAnalytics();

    return {
        winRate: analytics.gamesPlayed > 0 ? (analytics.gamesWon / analytics.gamesPlayed) * 100 : 0,
        totalGames: analytics.gamesPlayed,
        favoriteUnit: analytics.favoriteUnit,
        totalPlayTimeMinutes: Math.floor(analytics.totalPlayTime / 60),
    };
}
