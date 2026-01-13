'use client';

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import HUD from '@/components/HUD';
import ResultModal from '@/components/ResultModal';
import { GameState } from '@/game/engine/GameState';
import { GameLoop } from '@/game/engine/GameLoop';
import { GameStateSnapshot } from '@/game/types';
import { getStageById, getNextStage, STAGES } from '@/game/data/stages';
import { unlockStage, updateStats } from '@/utils/storage';
import { GAME_CONFIG } from '@/game/data/config';

// Dynamic import for GameCanvas to avoid SSR issues
const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-[3/1] bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-white text-xl">Loading game...</div>
        </div>
    ),
});

function PlayPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stageId = parseInt(searchParams.get('stage') || '1', 10);
    const stageData = getStageById(stageId) || STAGES[0];

    const gameStateRef = useRef<GameState | null>(null);
    const gameLoopRef = useRef<GameLoop | null>(null);

    const [snapshot, setSnapshot] = useState<GameStateSnapshot>({
        playerBaseHp: stageData.playerBaseHp,
        playerBaseMaxHp: stageData.playerBaseHp,
        enemyBaseHp: stageData.enemyBaseHp,
        enemyBaseMaxHp: stageData.enemyBaseHp,
        energy: GAME_CONFIG.initialEnergy,
        maxEnergy: GAME_CONFIG.maxEnergy,
        cooldowns: {},
        isRunning: false,
        isPaused: false,
        result: 'ongoing',
        currentWave: 0,
        totalWaves: stageData.totalWaves,
    });

    const [showResult, setShowResult] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);

    // Handle state updates from game
    const handleStateChange = useCallback((newSnapshot: GameStateSnapshot) => {
        setSnapshot(newSnapshot);
    }, []);

    // Handle game end
    const handleGameEnd = useCallback((result: 'win' | 'lose') => {
        setGameResult(result);
        setShowResult(true);

        // Update stats
        updateStats({
            gamesPlayed: 1,
            gamesWon: result === 'win' ? 1 : 0,
        });

        // Unlock next stage if won
        if (result === 'win') {
            const nextStage = getNextStage(stageId);
            if (nextStage) {
                unlockStage(nextStage.id);
            }
        }
    }, [stageId]);

    // Unit spawn handler
    const handleSpawnUnit = useCallback((unitId: string) => {
        if (gameStateRef.current) {
            gameStateRef.current.spawnPlayerUnit(unitId);
        }
    }, []);

    // Pause handler
    const handlePause = useCallback(() => {
        if (gameLoopRef.current) {
            gameLoopRef.current.pause();
            setSnapshot((prev) => ({ ...prev, isPaused: true }));
        }
    }, []);

    // Resume handler
    const handleResume = useCallback(() => {
        if (gameLoopRef.current) {
            gameLoopRef.current.resume();
            setSnapshot((prev) => ({ ...prev, isPaused: false }));
        }
    }, []);

    // Retry handler
    const handleRetry = useCallback(() => {
        setShowResult(false);
        setGameResult(null);

        if (gameStateRef.current && gameLoopRef.current) {
            gameStateRef.current.reset();
            gameLoopRef.current.start();
        }
    }, []);

    // Next stage handler
    const handleNextStage = useCallback(() => {
        const nextStage = getNextStage(stageId);
        if (nextStage) {
            router.push(`/play?stage=${nextStage.id}`);
        }
    }, [stageId, router]);

    // Menu handler
    const handleMenu = useCallback(() => {
        router.push('/');
    }, [router]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Unit deployment with 1-6 keys
            const unitKeys = ['1', '2', '3', '4', '5', '6'];
            const unitIds = ['byterunner', 'shieldgolem', 'arcslinger', 'novaburst', 'syncdrone', 'hexbit'];
            const keyIndex = unitKeys.indexOf(e.key);

            if (keyIndex !== -1) {
                handleSpawnUnit(unitIds[keyIndex]);
                return;
            }

            // Pause with P or Escape
            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                if (snapshot.isPaused) {
                    handleResume();
                } else {
                    handlePause();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSpawnUnit, handlePause, handleResume, snapshot.isPaused]);

    const hasNextStage = !!getNextStage(stageId);

    return (
        <main className="min-h-screen p-4 flex flex-col items-center">
            {/* Back button */}
            <div className="w-full max-w-5xl mb-4">
                <button
                    onClick={handleMenu}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                    ← Back to Menu
                </button>
            </div>

            {/* Game container */}
            <div className="w-full max-w-5xl space-y-4">
                {/* Canvas */}
                <GameCanvas
                    stageData={stageData}
                    onStateChange={handleStateChange}
                    onGameEnd={handleGameEnd}
                    gameStateRef={gameStateRef}
                    gameLoopRef={gameLoopRef}
                />

                {/* HUD */}
                <HUD
                    snapshot={snapshot}
                    stageId={stageId}
                    stageName={stageData.name}
                    onSpawnUnit={handleSpawnUnit}
                    onPause={handlePause}
                    onResume={handleResume}
                />
            </div>

            {/* Result modal */}
            {showResult && gameResult && (
                <ResultModal
                    result={gameResult}
                    stageId={stageId}
                    stageName={stageData.name}
                    onRetry={handleRetry}
                    onNextStage={handleNextStage}
                    onMenu={handleMenu}
                    hasNextStage={hasNextStage}
                />
            )}

            {/* Keyboard hints */}
            <div className="hidden sm:block fixed bottom-4 left-4 text-slate-600 text-xs">
                <div>Keys 1-6: Deploy units | P: Pause</div>
            </div>
        </main>
    );
}

export default function PlayPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </main>
        }>
            <PlayPageContent />
        </Suspense>
    );
}
