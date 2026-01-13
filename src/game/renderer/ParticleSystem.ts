export interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
    type: 'explosion' | 'spark' | 'smoke' | 'heal';
}

export class ParticleSystem {
    particles: Particle[] = [];
    private nextId = 0;

    add(x: number, y: number, color: string, count: number, type: Particle['type']) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 0.5;

            this.particles.push({
                id: this.nextId++,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 1.0,
                color,
                size: Math.random() * 3 + 1,
                type,
            });
        }
    }

    update(deltaTime: number) {
        // deltaTime is in milliseconds
        const dt = deltaTime / 1000;

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;

            // Gravity and friction
            if (p.type === 'explosion' || p.type === 'spark') {
                p.vy += 0.1; // Gravity
                p.vx *= 0.95; // Friction
                p.vy *= 0.95;
            } else if (p.type === 'smoke') {
                p.vy -= 0.05; // Rise up
                p.size += 0.05; // Expand
            } else if (p.type === 'heal') {
                p.vy -= 0.02; // Float up slowly
            }
        });

        this.particles = this.particles.filter(p => p.life > 0);
    }
}
