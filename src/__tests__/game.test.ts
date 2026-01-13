/**
 * Unit tests for ByteWars: Circuit Siege
 * Testing core combat calculations and game logic
 */

import { Unit, Base } from '../game/entities/Entity';
import { PLAYER_UNITS, getUnitById } from '../game/data/units';
import { ENEMIES, getEnemyById, selectRandomEnemy } from '../game/data/enemies';

describe('Unit System', () => {
    describe('getUnitById', () => {
        it('should return correct unit by ID', () => {
            const unit = getUnitById('byterunner');
            expect(unit).toBeDefined();
            expect(unit?.name).toBe('ByteRunner');
            expect(unit?.cost).toBe(2);
        });

        it('should return undefined for unknown ID', () => {
            const unit = getUnitById('nonexistent');
            expect(unit).toBeUndefined();
        });
    });

    describe('Unit creation', () => {
        it('should create unit with correct stats', () => {
            const stats = PLAYER_UNITS[0]; // ByteRunner
            const unit = new Unit(stats, 'player', 100);

            expect(unit.hp).toBe(80);
            expect(unit.maxHp).toBe(80);
            expect(unit.attack).toBe(15);
            expect(unit.faction).toBe('player');
            expect(unit.position.x).toBe(100);
        });

        it('should correctly determine direction based on faction', () => {
            const stats = PLAYER_UNITS[0];
            const playerUnit = new Unit(stats, 'player', 100);
            const enemyUnit = new Unit(stats, 'enemy', 100);

            expect(playerUnit.direction).toBe(1); // moves right
            expect(enemyUnit.direction).toBe(-1); // moves left
        });
    });

    describe('Combat calculations', () => {
        it('should correctly reduce HP when taking damage', () => {
            const stats = PLAYER_UNITS[1]; // ShieldGolem with 400 HP
            const unit = new Unit(stats, 'player', 100);

            unit.takeDamage(100);
            expect(unit.hp).toBe(300);
            expect(unit.isAlive).toBe(true);

            unit.takeDamage(300);
            expect(unit.hp).toBe(0);
            expect(unit.isAlive).toBe(false);
        });

        it('should not reduce HP below 0', () => {
            const stats = PLAYER_UNITS[0]; // ByteRunner with 80 HP
            const unit = new Unit(stats, 'player', 100);

            unit.takeDamage(1000);
            expect(unit.hp).toBe(0);
            expect(unit.isAlive).toBe(false);
        });

        it('should trigger hit flash on damage', () => {
            const stats = PLAYER_UNITS[0];
            const unit = new Unit(stats, 'player', 100);

            expect(unit.hitFlashTimer).toBe(0);
            unit.takeDamage(10);
            expect(unit.hitFlashTimer).toBe(10);
        });
    });
});

describe('Enemy System', () => {
    describe('getEnemyById', () => {
        it('should return correct enemy by ID', () => {
            const enemy = getEnemyById('glitch');
            expect(enemy).toBeDefined();
            expect(enemy?.name).toBe('Glitch');
            expect(enemy?.hp).toBe(60);
        });
    });

    describe('selectRandomEnemy', () => {
        it('should only select from allowed enemies', () => {
            // Run multiple times to ensure weighted selection works
            for (let i = 0; i < 10; i++) {
                const selected = selectRandomEnemy(['glitch']);
                expect(selected?.id).toBe('glitch');
            }
        });

        it('should return undefined for empty allowed list', () => {
            const selected = selectRandomEnemy([]);
            expect(selected).toBeUndefined();
        });
    });
});

describe('Base System', () => {
    it('should create base with correct HP', () => {
        const playerBase = new Base('player', 500);
        const enemyBase = new Base('enemy', 1000);

        expect(playerBase.hp).toBe(500);
        expect(playerBase.maxHp).toBe(500);
        expect(enemyBase.hp).toBe(1000);
        expect(enemyBase.maxHp).toBe(1000);
    });

    it('should correctly handle damage', () => {
        const base = new Base('player', 500);

        base.takeDamage(200);
        expect(base.hp).toBe(300);
        expect(base.isAlive).toBe(true);

        base.takeDamage(300);
        expect(base.hp).toBe(0);
        expect(base.isAlive).toBe(false);
    });
});

describe('Data Integrity', () => {
    it('should have 6 player units', () => {
        expect(PLAYER_UNITS.length).toBe(6);
    });

    it('should have 4 enemy types', () => {
        expect(ENEMIES.length).toBe(4);
    });

    it('all units should have valid costs', () => {
        PLAYER_UNITS.forEach((unit) => {
            expect(unit.cost).toBeGreaterThan(0);
            expect(unit.cost).toBeLessThanOrEqual(10);
        });
    });

    it('all units should have unique IDs', () => {
        const ids = PLAYER_UNITS.map((u) => u.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
