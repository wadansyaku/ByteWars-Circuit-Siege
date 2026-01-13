import { GameConfig } from '../types';

export const GAME_CONFIG: GameConfig = {
    canvasWidth: 1200,
    canvasHeight: 400,
    playerBaseX: 50,
    enemyBaseX: 1150,
    baseWidth: 60,
    baseHeight: 120,
    unitLaneY: 280, // vertical position for units
    initialEnergy: 5,
    maxEnergy: 10,
    energyRegenRate: 1, // energy per second
};

// Visual constants
export const COLORS = {
    playerBase: '#22C55E',
    enemyBase: '#EF4444',
    background: '#0F172A',
    ground: '#1E293B',
    hpBarBg: '#374151',
    hpBarPlayer: '#22C55E',
    hpBarEnemy: '#EF4444',
    energyBar: '#3B82F6',
    text: '#F1F5F9',
    buttonBg: '#1E293B',
    buttonHover: '#334155',
    buttonDisabled: '#4B5563',
};

export const FONT = {
    family: 'system-ui, -apple-system, sans-serif',
    sizes: {
        small: 12,
        medium: 16,
        large: 24,
        xlarge: 32,
    },
};
