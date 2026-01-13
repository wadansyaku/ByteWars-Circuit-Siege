'use client';

import { useRef, useEffect } from 'react';
import { GameState } from '@/game/engine/GameState';
import { GameLoop } from '@/game/engine/GameLoop';
import { CanvasRenderer } from '@/game/renderer/CanvasRenderer';
import { StageData, GameStateSnapshot } from '@/game/types';
import { GAME_CONFIG } from '@/game/data/config';

interface GameCanvasProps {
    stageData: StageData;
    onStateChange: (snapshot: GameStateSnapshot) => void;
    onGameEnd: (result: 'win' | 'lose') => void;
    gameStateRef: React.MutableRefObject<GameState | null>;
    gameLoopRef: React.MutableRefObject<GameLoop | null>;
}

export default function GameCanvas({
    stageData,
    onStateChange,
    onGameEnd,
    gameStateRef,
    gameLoopRef,
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<CanvasRenderer | null>(null);
    const isInitializedRef = useRef(false);

    // Initialize game
    useEffect(() => {
        if (!canvasRef.current) return;

        const gameState = new GameState(stageData);
        const gameLoop = new GameLoop(gameState);
        const renderer = new CanvasRenderer(canvasRef.current);

        gameStateRef.current = gameState;
        gameLoopRef.current = gameLoop;
        rendererRef.current = renderer;

        // Set up game loop callbacks
        gameLoop.setCallbacks(
            // Update callback
            () => {
                const snapshot = gameState.getSnapshot();
                onStateChange(snapshot);

                if (snapshot.result !== 'ongoing') {
                    onGameEnd(snapshot.result as 'win' | 'lose');
                }
            },
            // Render callback
            () => {
                renderer.render(gameState);
            }
        );

        // Start the game
        gameLoop.start();
        isInitializedRef.current = true;

        return () => {
            gameLoop.stop();
        };
    }, [stageData, onStateChange, onGameEnd, gameStateRef, gameLoopRef]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            rendererRef.current?.resize();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate aspect ratio for responsive canvas
    const aspectRatio = GAME_CONFIG.canvasHeight / GAME_CONFIG.canvasWidth;

    return (
        <div className="w-full relative" style={{ paddingBottom: `${aspectRatio * 100}%` }}>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
                style={{
                    background: '#0F172A',
                    imageRendering: 'pixelated',
                }}
            />
        </div>
    );
}
