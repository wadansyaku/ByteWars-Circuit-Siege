import { Faction, Position, UnitStats, EnemyStats } from '../types';
import { GAME_CONFIG } from '../data/config';

let nextEntityId = 1;

export class Unit {
    public id: number;
    public faction: Faction;
    public position: Position;
    public hp: number;
    public maxHp: number;
    public attack: number;
    public baseAttackSpeed: number;
    public attackSpeed: number;
    public range: number;
    public speed: number;
    public color: string;
    public icon: string;
    public name: string;

    // Special abilities
    public special?: 'aoe' | 'aura' | 'summon';
    public aoeRadius?: number;
    public auraBuff?: number;
    public summonDuration?: number;
    public remainingLife?: number; // for summon units
    public isBoss: boolean = false;

    // Combat state
    public attackCooldown: number = 0;
    public isAttacking: boolean = false;
    public target: Unit | Base | null = null;
    public hitFlashTimer: number = 0;

    constructor(stats: UnitStats | EnemyStats, faction: Faction, x: number) {
        this.id = nextEntityId++;
        this.faction = faction;
        this.position = { x, y: GAME_CONFIG.unitLaneY };
        this.hp = stats.hp;
        this.maxHp = stats.maxHp;
        this.attack = stats.attack;
        this.baseAttackSpeed = stats.attackSpeed;
        this.attackSpeed = stats.attackSpeed;
        this.range = stats.range;
        this.speed = stats.speed;
        this.color = stats.color;
        this.icon = stats.icon;
        this.name = stats.name;

        // Handle unit-specific properties
        if ('special' in stats) {
            this.special = stats.special;
            this.aoeRadius = stats.aoeRadius;
            this.auraBuff = stats.auraBuff;
            this.summonDuration = stats.summonDuration;
            if (stats.summonDuration) {
                this.remainingLife = stats.summonDuration;
            }
        }

        if (stats.isBoss) {
            this.isBoss = true;
        }
    }

    get isAlive(): boolean {
        return this.hp > 0;
    }

    get direction(): number {
        return this.faction === 'player' ? 1 : -1;
    }

    move(): void {
        if (!this.isAttacking && this.isAlive) {
            this.position.x += this.speed * this.direction;
        }
    }

    takeDamage(amount: number): void {
        this.hp = Math.max(0, this.hp - amount);
        this.hitFlashTimer = 10; // frames for hit flash effect
    }

    updateCooldown(): void {
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }

    updateLife(): boolean {
        // Returns true if unit should be removed due to life expiry
        if (this.remainingLife !== undefined) {
            this.remainingLife--;
            return this.remainingLife <= 0;
        }
        return false;
    }

    canAttack(): boolean {
        return this.attackCooldown <= 0 && this.isAlive;
    }

    startAttack(): void {
        // Convert attacks per second to frames between attacks (at 60fps)
        this.attackCooldown = Math.floor(60 / this.attackSpeed);
        this.isAttacking = true;
    }

    applyAuraBuff(multiplier: number): void {
        this.attackSpeed = this.baseAttackSpeed * multiplier;
    }

    resetAttackSpeed(): void {
        this.attackSpeed = this.baseAttackSpeed;
    }
}

export class Base {
    public faction: Faction;
    public hp: number;
    public maxHp: number;
    public position: Position;
    public width: number;
    public height: number;
    public hitFlashTimer: number = 0;

    constructor(faction: Faction, hp: number) {
        this.faction = faction;
        this.hp = hp;
        this.maxHp = hp;
        this.width = GAME_CONFIG.baseWidth;
        this.height = GAME_CONFIG.baseHeight;

        if (faction === 'player') {
            this.position = { x: GAME_CONFIG.playerBaseX, y: GAME_CONFIG.unitLaneY - 60 };
        } else {
            this.position = { x: GAME_CONFIG.enemyBaseX, y: GAME_CONFIG.unitLaneY - 60 };
        }
    }

    get isAlive(): boolean {
        return this.hp > 0;
    }

    get centerX(): number {
        return this.position.x + this.width / 2;
    }

    takeDamage(amount: number): void {
        this.hp = Math.max(0, this.hp - amount);
        this.hitFlashTimer = 15;
    }
}
