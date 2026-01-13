export class AudioManager {
    private static instance: AudioManager;
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;
    private volume: number = 0.3;

    private constructor() {
        // Lazy init via user interaction usually needed, handled in init()
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public init(): void {
        if (typeof window !== 'undefined' && !this.ctx) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (this.ctx) {
            if (this.isMuted) {
                this.ctx.suspend();
            } else {
                this.ctx.resume();
            }
        }
        return this.isMuted;
    }

    public setVolume(vol: number): void {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    public playSe(type: 'shoot' | 'hit' | 'explosion' | 'spawn' | 'button'): void {
        if (this.isMuted || !this.ctx) return;

        // Resume context if suspended (browser requirement)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Simple synthesized sounds
        const now = this.ctx.currentTime;

        switch (type) {
            case 'shoot':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(this.volume * 0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'hit':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gain.gain.setValueAtTime(this.volume * 0.5, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'explosion':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
                gain.gain.setValueAtTime(this.volume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'spawn':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(800, now + 0.2);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(this.volume, now + 0.1);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;

            case 'button':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(this.volume * 0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
        }
    }
}
