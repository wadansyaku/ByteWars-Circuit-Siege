// Core type definitions for ByteWars: Circuit Siege

export type Faction = 'player' | 'enemy';

export interface Position {
    x: number;
    y: number;
}

export interface UnitStats {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    attackSpeed: number; // attacks per second
    range: number; // pixels
    speed: number; // pixels per frame at 60fps
    cost: number;
    cooldown: number; // seconds
    color: string;
    icon: string; // SVG path or emoji
    description: string;
    special?: 'aoe' | 'aura' | 'summon';
    aoeRadius?: number;
    auraBuff?: number; // attack speed multiplier for allies
    summonDuration?: number; // frames
    isBoss?: boolean;
}

export interface EnemyStats {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    attackSpeed: number;
    range: number;
    speed: number;
    color: string;
    icon: string;
    spawnWeight: number; // relative spawn frequency
    isBoss?: boolean;
}

export interface StageData {
    id: number;
    name: string;
    description: string;
    enemyBaseHp: number;
    playerBaseHp: number;
    spawnInterval: number; // seconds between spawns
    enemyTypes: string[]; // enemy IDs that can spawn
    maxEnemiesPerWave: number;
    totalWaves: number;
    background: string; // color or gradient
}

export interface GameConfig {
    canvasWidth: number;
    canvasHeight: number;
    playerBaseX: number;
    enemyBaseX: number;
    baseWidth: number;
    baseHeight: number;
    unitLaneY: number;
    initialEnergy: number;
    maxEnergy: number;
    energyRegenRate: number; // energy per second
}

export interface GameStateSnapshot {
    playerBaseHp: number;
    playerBaseMaxHp: number;
    enemyBaseHp: number;
    enemyBaseMaxHp: number;
    energy: number;
    maxEnergy: number;
    cooldowns: Record<string, number>; // remaining cooldown in ms
    isRunning: boolean;
    isPaused: boolean;
    result: 'ongoing' | 'win' | 'lose';
    currentWave: number;
    totalWaves: number;
}
