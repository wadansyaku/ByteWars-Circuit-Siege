import { Unit, Base } from '../entities/Entity';
import { GameState } from '../engine/GameState';
import { GAME_CONFIG, COLORS, FONT } from '../data/config';

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private dpr: number;
    private scale: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        this.ctx = ctx;
        this.dpr = window.devicePixelRatio || 1;
        this.setupCanvas();
    }

    private setupCanvas(): void {
        const rect = this.canvas.getBoundingClientRect();
        this.scale = rect.width / GAME_CONFIG.canvasWidth;

        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;

        this.ctx.scale(this.dpr * this.scale, this.dpr * this.scale);
        this.ctx.textBaseline = 'middle';
    }

    resize(): void {
        this.setupCanvas();
    }

    render(gameState: GameState): void {
        const { ctx } = this;
        const { canvasWidth, canvasHeight } = GAME_CONFIG;

        // Clear canvas
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Apply screen shake
        ctx.save();
        if (gameState.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * gameState.screenShake * 2;
            const shakeY = (Math.random() - 0.5) * gameState.screenShake * 2;
            ctx.translate(shakeX, shakeY);
        }

        // Draw background
        this.drawBackground(gameState.stageData.background);

        // Draw ground
        this.drawGround();

        // Draw bases
        this.drawBase(gameState.playerBase);
        this.drawBase(gameState.enemyBase);

        // Draw units
        gameState.playerUnits.forEach((unit) => this.drawUnit(unit));
        gameState.enemyUnits.forEach((unit) => this.drawUnit(unit));

        // Draw particles
        gameState.particles.particles.forEach((p) => {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Draw floating text
        ctx.textAlign = 'center';
        gameState.floatingTexts.texts.forEach((t) => {
            ctx.globalAlpha = t.life / t.maxLife;
            ctx.fillStyle = t.color;
            ctx.font = `bold ${t.size}px ${FONT.family}`;
            ctx.fillText(t.text, t.x, t.y);
        });
        ctx.globalAlpha = 1.0;

        // Restore context from screen shake
        ctx.restore();
    }

    private drawBackground(gradient: string): void {
        const { ctx } = this;
        const { canvasWidth, canvasHeight } = GAME_CONFIG;

        // Parse gradient or use solid color
        if (gradient.startsWith('linear-gradient')) {
            const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            grad.addColorStop(0, '#1e293b');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = gradient;
        }
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw grid lines for cyber aesthetic
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
        ctx.lineWidth = 1;

        for (let x = 0; x < canvasWidth; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }

        for (let y = 0; y < canvasHeight; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }

    private drawGround(): void {
        const { ctx } = this;
        const { canvasWidth, canvasHeight, unitLaneY } = GAME_CONFIG;

        // Ground plane
        ctx.fillStyle = COLORS.ground;
        ctx.fillRect(0, unitLaneY + 40, canvasWidth, canvasHeight - unitLaneY - 40);

        // Ground line
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, unitLaneY + 40);
        ctx.lineTo(canvasWidth, unitLaneY + 40);
        ctx.stroke();
    }

    private drawBase(base: Base): void {
        const { ctx } = this;
        const { position, width, height, faction, hp, maxHp, hitFlashTimer } = base;

        // Base body with glow effect
        const color = faction === 'player' ? COLORS.playerBase : COLORS.enemyBase;
        const glowColor = faction === 'player' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';

        // Glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 20;

        // Hit flash
        if (hitFlashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = color;
        }

        // Draw base as stylized tower
        ctx.beginPath();
        ctx.moveTo(position.x, position.y + height);
        ctx.lineTo(position.x, position.y + 20);
        ctx.lineTo(position.x + width / 2, position.y);
        ctx.lineTo(position.x + width, position.y + 20);
        ctx.lineTo(position.x + width, position.y + height);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;

        // HP bar above base
        this.drawHpBar(
            position.x - 10,
            position.y - 20,
            width + 20,
            10,
            hp,
            maxHp,
            faction === 'player' ? COLORS.hpBarPlayer : COLORS.hpBarEnemy
        );

        // Base label
        ctx.fillStyle = COLORS.text;
        ctx.font = `bold ${FONT.sizes.small}px ${FONT.family}`;
        ctx.textAlign = 'center';
        ctx.fillText(faction === 'player' ? 'YOUR BASE' : 'ENEMY BASE', position.x + width / 2, position.y - 28);
    }

    private drawUnit(unit: Unit): void {
        const { ctx } = this;
        const { position, color, icon, hp, maxHp, faction, hitFlashTimer, range, isAttacking, isBoss } = unit;

        const size = isBoss ? 50 : 30; // Bosses are larger
        const x = position.x;
        const y = position.y;

        // Glow effect for player units and bosses
        if (faction === 'player' || isBoss) {
            ctx.shadowColor = color;
            ctx.shadowBlur = isBoss ? 20 : 10;
        }

        // Hit flash
        if (hitFlashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = color;
        }

        // Unit body - rounded rectangle
        ctx.beginPath();
        ctx.roundRect(x - size / 2, y - size / 2, size, size, 6);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Unit icon
        ctx.font = `${FONT.sizes.medium}px ${FONT.family}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, x, y);

        // HP bar below unit
        this.drawHpBar(
            x - size / 2,
            y + size / 2 + 4,
            size,
            4,
            hp,
            maxHp,
            faction === 'player' ? COLORS.hpBarPlayer : COLORS.hpBarEnemy
        );

        // Attack indicator
        if (isAttacking && faction === 'player') {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(x, y, range, -0.5, 0.5);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Direction indicator
        ctx.fillStyle = color;
        ctx.beginPath();
        const arrowX = x + (faction === 'player' ? size / 2 + 5 : -size / 2 - 5);
        const arrowDir = faction === 'player' ? 1 : -1;
        ctx.moveTo(arrowX, y);
        ctx.lineTo(arrowX - 4 * arrowDir, y - 4);
        ctx.lineTo(arrowX - 4 * arrowDir, y + 4);
        ctx.closePath();
        ctx.fill();
    }

    private drawHpBar(
        x: number,
        y: number,
        width: number,
        height: number,
        hp: number,
        maxHp: number,
        color: string
    ): void {
        const { ctx } = this;
        const hpPercent = Math.max(0, hp / maxHp);

        // Background
        ctx.fillStyle = COLORS.hpBarBg;
        ctx.fillRect(x, y, width, height);

        // HP fill
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * hpPercent, height);

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
    }
}
