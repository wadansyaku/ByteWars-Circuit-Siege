import { Unit, Base } from '../entities/Entity';
import { StageData, GameStateSnapshot } from '../types';
import { GAME_CONFIG } from '../data/config';
import { PLAYER_UNITS, getUnitById } from '../data/units';
import { selectRandomEnemy } from '../data/enemies';
import { ParticleSystem } from '../renderer/ParticleSystem';
import { FloatingTextManager } from '../renderer/FloatingText';
import { AudioManager } from '../audio/AudioManager';

export class GameState {
    // Bases
    public playerBase: Base;
    public enemyBase: Base;

    // Units
    public playerUnits: Unit[] = [];
    public enemyUnits: Unit[] = [];

    // Resources
    public energy: number;
    public maxEnergy: number;
    public energyRegenAccumulator: number = 0;

    // Cooldowns (in milliseconds)
    public cooldowns: Map<string, number> = new Map();

    // Game state
    public isRunning: boolean = false;
    public isPaused: boolean = false;
    public result: 'ongoing' | 'win' | 'lose' = 'ongoing';

    // Stage info
    public stageData: StageData;
    public currentWave: number = 0;
    public spawnAccumulator: number = 0;
    public enemiesSpawnedThisWave: number = 0;

    // Visual systems
    public particles: ParticleSystem;
    public floatingTexts: FloatingTextManager;
    public screenShake: number = 0;

    // Timing
    public frameCount: number = 0;
    public lastFrameTime: number = 0;

    constructor(stageData: StageData) {
        this.stageData = stageData;
        this.playerBase = new Base('player', stageData.playerBaseHp);
        this.enemyBase = new Base('enemy', stageData.enemyBaseHp);
        this.energy = GAME_CONFIG.initialEnergy;
        this.maxEnergy = GAME_CONFIG.maxEnergy;

        this.particles = new ParticleSystem();
        this.floatingTexts = new FloatingTextManager();

        // Initialize cooldowns for all units
        PLAYER_UNITS.forEach((unit) => {
            this.cooldowns.set(unit.id, 0);
        });
    }

    reset(): void {
        this.playerUnits = [];
        this.enemyUnits = [];
        this.playerBase = new Base('player', this.stageData.playerBaseHp);
        this.enemyBase = new Base('enemy', this.stageData.enemyBaseHp);
        this.energy = GAME_CONFIG.initialEnergy;
        this.energyRegenAccumulator = 0;
        this.currentWave = 0;
        this.spawnAccumulator = 0;
        this.enemiesSpawnedThisWave = 0;
        this.frameCount = 0;
        this.result = 'ongoing';
        this.isPaused = false;
        this.particles = new ParticleSystem();
        this.floatingTexts = new FloatingTextManager();
        this.screenShake = 0;

        PLAYER_UNITS.forEach((unit) => {
            this.cooldowns.set(unit.id, 0);
        });
    }

    start(): void {
        this.isRunning = true;
        this.isPaused = false;
        this.lastFrameTime = performance.now();
    }

    pause(): void {
        this.isPaused = true;
    }

    resume(): void {
        this.isPaused = false;
        this.lastFrameTime = performance.now();
    }

    stop(): void {
        this.isRunning = false;
    }

    canSpawnUnit(unitId: string): boolean {
        const unit = getUnitById(unitId);
        if (!unit) return false;

        const cooldown = this.cooldowns.get(unitId) || 0;
        return this.energy >= unit.cost && cooldown <= 0 && this.result === 'ongoing';
    }

    spawnPlayerUnit(unitId: string): boolean {
        const unitStats = getUnitById(unitId);
        if (!unitStats || !this.canSpawnUnit(unitId)) return false;

        // Deduct energy
        this.energy -= unitStats.cost;

        // Set cooldown (convert seconds to milliseconds)
        this.cooldowns.set(unitId, unitStats.cooldown * 1000);

        // Create unit at player base position
        const unit = new Unit(unitStats, 'player', GAME_CONFIG.playerBaseX + GAME_CONFIG.baseWidth + 10);
        this.playerUnits.push(unit);

        AudioManager.getInstance().playSe('spawn');
        return true;
    }

    spawnEnemyUnit(): void {
        if (this.currentWave >= this.stageData.totalWaves) return;
        if (this.enemiesSpawnedThisWave >= this.stageData.maxEnemiesPerWave) {
            // Next wave
            this.currentWave++;
            this.enemiesSpawnedThisWave = 0;
            return;
        }

        const enemyStats = selectRandomEnemy(this.stageData.enemyTypes);
        if (!enemyStats) return;

        const unit = new Unit(enemyStats, 'enemy', GAME_CONFIG.enemyBaseX - GAME_CONFIG.baseWidth - 10);
        this.enemyUnits.push(unit);
        this.enemiesSpawnedThisWave++;
    }

    update(deltaTime: number): void {
        if (this.isPaused || this.result !== 'ongoing') return;

        this.frameCount++;

        // Energy regeneration
        this.energyRegenAccumulator += GAME_CONFIG.energyRegenRate * (deltaTime / 1000);
        while (this.energyRegenAccumulator >= 1 && this.energy < this.maxEnergy) {
            this.energy++;
            this.energyRegenAccumulator--;
        }
        if (this.energy >= this.maxEnergy) {
            this.energyRegenAccumulator = 0;
        }

        // Update cooldowns
        this.cooldowns.forEach((value, key) => {
            if (value > 0) {
                this.cooldowns.set(key, Math.max(0, value - deltaTime));
            }
        });

        // Enemy spawning
        this.spawnAccumulator += deltaTime / 1000;
        if (this.spawnAccumulator >= this.stageData.spawnInterval) {
            this.spawnAccumulator = 0;
            this.spawnEnemyUnit();
        }

        // Apply aura buffs
        this.applyAuraBuffs();

        // Update units
        this.updateUnits(this.playerUnits, this.enemyUnits, this.enemyBase);
        this.updateUnits(this.enemyUnits, this.playerUnits, this.playerBase);

        // Remove dead units
        this.playerUnits = this.playerUnits.filter((u) => u.isAlive);
        this.enemyUnits = this.enemyUnits.filter((u) => u.isAlive);

        // Update hit flash timers
        this.updateHitFlash();

        // Update visual systems
        this.particles.update(deltaTime);
        this.floatingTexts.update(deltaTime);
        if (this.screenShake > 0) {
            this.screenShake = Math.max(0, this.screenShake - deltaTime / 16);
        }

        // Check win/lose conditions
        this.checkGameOver();
    }

    private applyAuraBuffs(): void {
        // Reset all attack speeds first
        [...this.playerUnits, ...this.enemyUnits].forEach((unit) => {
            unit.resetAttackSpeed();
        });

        // Apply aura buffs from support units
        this.playerUnits.forEach((unit) => {
            if (unit.special === 'aura' && unit.auraBuff && unit.isAlive) {
                // Buff nearby player units
                this.playerUnits.forEach((ally) => {
                    if (ally.id !== unit.id && Math.abs(ally.position.x - unit.position.x) <= 100) {
                        ally.applyAuraBuff(unit.auraBuff!);
                    }
                });
            }
        });
    }

    private updateUnits(attackers: Unit[], defenders: Unit[], enemyBase: Base): void {
        for (const attacker of attackers) {
            if (!attacker.isAlive) continue;

            // Handle summon unit lifespan
            if (attacker.updateLife()) {
                attacker.hp = 0;
                continue;
            }

            attacker.updateCooldown();

            // Find targets in range
            let targetUnit: Unit | null = null;
            let minDistance = Infinity;

            for (const defender of defenders) {
                if (!defender.isAlive) continue;
                const distance = Math.abs(attacker.position.x - defender.position.x);
                if (distance < minDistance) {
                    minDistance = distance;
                    targetUnit = defender;
                }
            }

            // Check base distance
            const baseDistance = Math.abs(attacker.position.x - enemyBase.centerX);

            // Attack logic
            if (targetUnit && minDistance <= attacker.range) {
                attacker.isAttacking = true;
                if (attacker.canAttack()) {
                    this.performAttack(attacker, targetUnit);
                }
            } else if (baseDistance <= attacker.range && !targetUnit) {
                attacker.isAttacking = true;
                if (attacker.canAttack()) {
                    const damage = attacker.attack;
                    enemyBase.takeDamage(damage);
                    this.screenShake = 5; // Shake screen on base hit
                    this.particles.add(enemyBase.centerX, GAME_CONFIG.canvasHeight - 60, '#EF4444', 5, 'spark');
                    this.floatingTexts.add(enemyBase.centerX, GAME_CONFIG.canvasHeight - 100, `-${damage}`, '#EF4444', 20);
                    AudioManager.getInstance().playSe('explosion');
                    attacker.startAttack();
                }
            } else {
                attacker.isAttacking = false;
                attacker.move();
            }
        }
    }

    private performAttack(attacker: Unit, target: Unit): void {
        if (attacker.special === 'aoe' && attacker.aoeRadius) {
            // AOE attack - damage all enemies in radius
            const enemies = attacker.faction === 'player' ? this.enemyUnits : this.playerUnits;
            enemies.forEach((enemy) => {
                if (Math.abs(enemy.position.x - target.position.x) <= attacker.aoeRadius!) {
                    this.dealDamage(enemy, attacker.attack);
                }
            });
        } else {
            this.dealDamage(target, attacker.attack);
        }
        attacker.startAttack();
    }

    private dealDamage(target: Unit, amount: number): void {
        target.takeDamage(amount);

        // Visual effects
        this.particles.add(target.position.x, target.position.y - 20, target.color, 3, 'spark');
        this.floatingTexts.add(target.position.x, target.position.y - 40, `-${amount}`, '#FFFFFF', 16);
        AudioManager.getInstance().playSe('hit');

        if (!target.isAlive) {
            this.particles.add(target.position.x, target.position.y - 20, target.color, 10, 'explosion');
            AudioManager.getInstance().playSe('explosion');
        }
    }

    private updateHitFlash(): void {
        [...this.playerUnits, ...this.enemyUnits].forEach((unit) => {
            if (unit.hitFlashTimer > 0) unit.hitFlashTimer--;
        });

        if (this.playerBase.hitFlashTimer > 0) this.playerBase.hitFlashTimer--;
        if (this.enemyBase.hitFlashTimer > 0) this.enemyBase.hitFlashTimer--;
    }

    private checkGameOver(): void {
        if (!this.playerBase.isAlive) {
            this.result = 'lose';
            this.isRunning = false;
        } else if (!this.enemyBase.isAlive) {
            this.result = 'win';
            this.isRunning = false;
        }
    }

    getSnapshot(): GameStateSnapshot {
        return {
            playerBaseHp: this.playerBase.hp,
            playerBaseMaxHp: this.playerBase.maxHp,
            enemyBaseHp: this.enemyBase.hp,
            enemyBaseMaxHp: this.enemyBase.maxHp,
            energy: Math.floor(this.energy),
            maxEnergy: this.maxEnergy,
            cooldowns: Object.fromEntries(this.cooldowns),
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            result: this.result,
            currentWave: this.currentWave,
            totalWaves: this.stageData.totalWaves,
        };
    }
}
