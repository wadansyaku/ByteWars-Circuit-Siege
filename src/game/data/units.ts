import { UnitStats } from '../types';

// 6 Original Player Units
export const PLAYER_UNITS: UnitStats[] = [
    {
        id: 'byterunner',
        name: 'ByteRunner',
        hp: 80,
        maxHp: 80,
        attack: 15,
        attackSpeed: 1.5,
        range: 15,
        speed: 3.0,
        cost: 2,
        cooldown: 2,
        color: '#4ADE80', // green
        icon: '⚡',
        description: 'Fast and cheap scout unit. Low HP but quick deployment.',
    },
    {
        id: 'shieldgolem',
        name: 'ShieldGolem',
        hp: 400,
        maxHp: 400,
        attack: 25,
        attackSpeed: 0.8,
        range: 20,
        speed: 1.0,
        cost: 5,
        cooldown: 8,
        color: '#60A5FA', // blue
        icon: '🛡️',
        description: 'Heavy tank with massive HP. Slow but durable.',
    },
    {
        id: 'arcslinger',
        name: 'ArcSlinger',
        hp: 120,
        maxHp: 120,
        attack: 20,
        attackSpeed: 1.2,
        range: 150,
        speed: 1.5,
        cost: 3,
        cooldown: 4,
        color: '#F472B6', // pink
        icon: '🎯',
        description: 'Ranged attacker. Strikes from a safe distance.',
    },
    {
        id: 'novaburst',
        name: 'NovaBurst',
        hp: 150,
        maxHp: 150,
        attack: 40,
        attackSpeed: 0.6,
        range: 100,
        speed: 1.2,
        cost: 6,
        cooldown: 10,
        color: '#FB923C', // orange
        icon: '💥',
        description: 'Area damage specialist. Hits all enemies in blast radius.',
        special: 'aoe',
        aoeRadius: 60,
    },
    {
        id: 'syncdrone',
        name: 'SyncDrone',
        hp: 100,
        maxHp: 100,
        attack: 10,
        attackSpeed: 1.0,
        range: 80,
        speed: 1.5,
        cost: 4,
        cooldown: 6,
        color: '#A78BFA', // purple
        icon: '📡',
        description: 'Support unit. Boosts attack speed of nearby allies.',
        special: 'aura',
        auraBuff: 1.3, // 30% attack speed boost
    },
    {
        id: 'hexbit',
        name: 'HexBit',
        hp: 60,
        maxHp: 60,
        attack: 50,
        attackSpeed: 2.0,
        range: 25,
        speed: 2.5,
        cost: 5,
        cooldown: 5,
        color: '#F87171', // red
        icon: '🔥',
        description: 'High DPS but short-lived. Burns out after 8 seconds.',
        special: 'summon',
        summonDuration: 480, // 8 seconds at 60fps
    },
];

export const getUnitById = (id: string): UnitStats | undefined => {
    return PLAYER_UNITS.find((unit) => unit.id === id);
};
