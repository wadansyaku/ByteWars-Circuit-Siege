import { GameState } from './GameState';

export type GameLoopCallback = (deltaTime: number) => void;

export class GameLoop {
    private gameState: GameState;
    private animationFrameId: number | null = null;
    private lastTime: number = 0;
    private onUpdate?: GameLoopCallback;
    private onRender?: GameLoopCallback;

    // Target 60 FPS
    private readonly targetFrameTime = 1000 / 60;
    private accumulator: number = 0;

    constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    setCallbacks(onUpdate?: GameLoopCallback, onRender?: GameLoopCallback): void {
        this.onUpdate = onUpdate;
        this.onRender = onRender;
    }

    start(): void {
        if (this.animationFrameId !== null) return;

        this.lastTime = performance.now();
        this.gameState.start();
        this.tick();
    }

    stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.gameState.stop();
    }

    pause(): void {
        this.gameState.pause();
    }

    resume(): void {
        this.gameState.resume();
        this.lastTime = performance.now();
    }

    private tick = (): void => {
        const currentTime = performance.now();
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Cap delta time to prevent spiral of death
        if (deltaTime > 100) {
            deltaTime = 100;
        }

        this.accumulator += deltaTime;

        // Fixed timestep updates
        while (this.accumulator >= this.targetFrameTime) {
            if (!this.gameState.isPaused && this.gameState.result === 'ongoing') {
                this.gameState.update(this.targetFrameTime);
                this.onUpdate?.(this.targetFrameTime);
            }
            this.accumulator -= this.targetFrameTime;
        }

        // Render every frame
        this.onRender?.(deltaTime);

        // Continue loop if game is running
        if (this.gameState.isRunning || this.gameState.result === 'ongoing') {
            this.animationFrameId = requestAnimationFrame(this.tick);
        }
    };

    get isRunning(): boolean {
        return this.animationFrameId !== null;
    }
}
