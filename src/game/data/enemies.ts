import { EnemyStats } from '../types';

// 4 Original Enemy Types
export const ENEMIES: EnemyStats[] = [
    {
        id: 'glitch',
        name: 'Glitch',
        hp: 60,
        maxHp: 60,
        attack: 10,
        attackSpeed: 1.2,
        range: 15,
        speed: 1.5,
        color: '#94A3B8', // gray
        icon: '👾',
        spawnWeight: 4, // most common
    },
    {
        id: 'fortress',
        name: 'Fortress',
        hp: 300,
        maxHp: 300,
        attack: 20,
        attackSpeed: 0.7,
        range: 20,
        speed: 0.8,
        color: '#475569', // dark gray
        icon: '🧱',
        spawnWeight: 2,
    },
    {
        id: 'zapper',
        name: 'Zapper',
        hp: 80,
        maxHp: 80,
        attack: 25,
        attackSpeed: 1.0,
        range: 120,
        speed: 1.2,
        color: '#FBBF24', // yellow
        icon: '⚡',
        spawnWeight: 2,
    },
    {
        id: 'rush',
        name: 'Rush',
        hp: 40,
        maxHp: 40,
        attack: 15,
        attackSpeed: 1.5,
        range: 12,
        speed: 4.0,
        color: '#EF4444', // bright red
        icon: '💨',
        spawnWeight: 1,
    },
    {
        id: 'cyber_overlord',
        name: 'Cyber Overlord',
        hp: 800,
        maxHp: 800,
        attack: 40,
        attackSpeed: 2.0,
        range: 20,
        speed: 0.8,
        color: '#F43F5E',
        icon: '👹',
        spawnWeight: 0, // Rare/Special
        isBoss: true,
    },
];

export const getEnemyById = (id: string): EnemyStats | undefined => {
    return ENEMIES.find((enemy) => enemy.id === id);
};

export const selectRandomEnemy = (allowedIds: string[]): EnemyStats | undefined => {
    const allowed = ENEMIES.filter((e) => allowedIds.includes(e.id));
    if (allowed.length === 0) return undefined;

    const totalWeight = allowed.reduce((sum, e) => sum + e.spawnWeight, 0);
    let random = Math.random() * totalWeight;

    for (const enemy of allowed) {
        random -= enemy.spawnWeight;
        if (random <= 0) return enemy;
    }

    return allowed[0];
};
