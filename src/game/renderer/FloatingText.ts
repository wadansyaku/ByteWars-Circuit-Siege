export interface FloatingText {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
    life: number;
    maxLife: number;
    vy: number;
    size: number;
}

export class FloatingTextManager {
    texts: FloatingText[] = [];
    private nextId = 0;

    add(x: number, y: number, text: string, color: string, size: number = 14) {
        this.texts.push({
            id: this.nextId++,
            x,
            y,
            text,
            color,
            life: 1.0,
            maxLife: 1.0,
            vy: -1.0, // Float up speed
            size,
        });
    }

    update(deltaTime: number) {
        const dt = deltaTime / 1000;

        this.texts.forEach(t => {
            t.y += t.vy;
            t.life -= dt;
            t.vy *= 0.95; // Slow down
        });

        this.texts = this.texts.filter(t => t.life > 0);
    }
}
