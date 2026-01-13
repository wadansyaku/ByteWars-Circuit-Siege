import { StageData } from '../types';

// 3 Stages with progressive difficulty
export const STAGES: StageData[] = [
    {
        id: 1,
        name: 'Gateway Protocol',
        description: 'Tutorial stage. Learn the basics of unit deployment.',
        enemyBaseHp: 500,
        playerBaseHp: 500,
        spawnInterval: 3.5,
        enemyTypes: ['glitch'],
        maxEnemiesPerWave: 2,
        totalWaves: 10,
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    },
    {
        id: 2,
        name: 'Firewall Breach',
        description: 'Heavy units appear. Prepare your defenses.',
        enemyBaseHp: 800,
        playerBaseHp: 600,
        spawnInterval: 2.8,
        enemyTypes: ['glitch', 'fortress'],
        maxEnemiesPerWave: 3,
        totalWaves: 12,
        background: 'linear-gradient(180deg, #1e3a5f 0%, #0c1929 100%)',
    },
    {
        id: 3,
        name: 'System Override',
        description: 'All enemy types active. Maximum difficulty.',
        enemyBaseHp: 1200,
        playerBaseHp: 700,
        spawnInterval: 2.2,
        enemyTypes: ['glitch', 'fortress', 'zapper', 'rush'],
        maxEnemiesPerWave: 4,
        totalWaves: 15,
        background: 'linear-gradient(180deg, #3f1e1e 0%, #1a0a0a 100%)',
    },
    {
        id: 4,
        name: 'Neural Network',
        description: 'Fast enemies incoming! Prepare your defenses.',
        enemyBaseHp: 1500,
        playerBaseHp: 1000,
        spawnInterval: 2.5,
        enemyTypes: ['rush', 'glitch'],
        maxEnemiesPerWave: 6,
        totalWaves: 15,
        background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
    },
    {
        id: 5,
        name: 'Data Core',
        description: 'Heavy armor detected. High damage required.',
        enemyBaseHp: 2000,
        playerBaseHp: 1200,
        spawnInterval: 4.0,
        enemyTypes: ['fortress', 'zapper'],
        maxEnemiesPerWave: 4,
        totalWaves: 12,
        background: 'linear-gradient(180deg, #064e3b 0%, #022c22 100%)',
    },
    {
        id: 6,
        name: 'System Root',
        description: 'The source of corruption. Defeat the Overlord!',
        enemyBaseHp: 5000,
        playerBaseHp: 2000,
        spawnInterval: 3.0,
        enemyTypes: ['glitch', 'fortress', 'rush', 'cyber_overlord'],
        maxEnemiesPerWave: 3,
        totalWaves: 10,
        background: 'linear-gradient(180deg, #450a0a 0%, #000000 100%)',
    },
];

export const getStageById = (id: number): StageData | undefined => {
    return STAGES.find((stage) => stage.id === id);
};

export const getNextStage = (currentId: number): StageData | undefined => {
    return STAGES.find((stage) => stage.id === currentId + 1);
};
