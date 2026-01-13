'use client';

import { GameStateSnapshot } from '@/game/types';
import { PLAYER_UNITS } from '@/game/data/units';

interface UnitButtonProps {
    unitId: string;
    name: string;
    icon: string;
    cost: number;
    color: string;
    cooldown: number;
    cooldownRemaining: number;
    energy: number;
    disabled: boolean;
    onSpawn: (unitId: string) => void;
    keyHint: string;
}

function UnitButton({
    unitId,
    name,
    icon,
    cost,
    color,
    cooldown,
    cooldownRemaining,
    energy,
    disabled,
    onSpawn,
    keyHint,
}: UnitButtonProps) {
    const cooldownPercent = cooldownRemaining / (cooldown * 1000);
    const canAfford = energy >= cost;
    const isReady = cooldownRemaining <= 0;
    const isDisabled = disabled || !canAfford || !isReady;

    return (
        <button
            onClick={() => onSpawn(unitId)}
            disabled={isDisabled}
            className={`
        relative flex flex-col items-center justify-center
        w-16 h-20 sm:w-20 sm:h-24 rounded-lg
        transition-all duration-150 select-none
        ${isDisabled
                    ? 'bg-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 hover:scale-105 active:scale-95 cursor-pointer'}
        border-2 ${isDisabled ? 'border-slate-600' : 'border-slate-500'}
      `}
            style={{
                boxShadow: isDisabled ? 'none' : `0 0 10px ${color}40`,
            }}
        >
            {/* Cooldown overlay */}
            {!isReady && (
                <div
                    className="absolute inset-0 bg-slate-900/70 rounded-lg"
                    style={{
                        clipPath: `inset(${(1 - cooldownPercent) * 100}% 0 0 0)`
                    }}
                />
            )}

            {/* Icon */}
            <span className="text-2xl sm:text-3xl">{icon}</span>

            {/* Name */}
            <span className="text-[10px] sm:text-xs text-slate-300 mt-1 truncate w-full text-center px-1">
                {name}
            </span>

            {/* Cost */}
            <span
                className={`text-xs font-bold ${canAfford ? 'text-blue-400' : 'text-red-400'}`}
            >
                ⚡{cost}
            </span>

            {/* Key hint */}
            <span className="absolute top-1 right-1 text-[10px] text-slate-500 hidden sm:block">
                {keyHint}
            </span>

            {/* Cooldown timer */}
            {!isReady && (
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    {Math.ceil(cooldownRemaining / 1000)}s
                </span>
            )}
        </button>
    );
}

interface HUDProps {
    snapshot: GameStateSnapshot;
    stageId: number;
    stageName: string;
    onSpawnUnit: (unitId: string) => void;
    onPause: () => void;
    onResume: () => void;
}

export default function HUD({
    snapshot,
    stageId,
    stageName,
    onSpawnUnit,
    onPause,
    onResume,
}: HUDProps) {
    const {
        playerBaseHp,
        playerBaseMaxHp,
        enemyBaseHp,
        enemyBaseMaxHp,
        energy,
        maxEnergy,
        cooldowns,
        isPaused,
        currentWave,
        totalWaves,
    } = snapshot;

    const playerHpPercent = (playerBaseHp / playerBaseMaxHp) * 100;
    const enemyHpPercent = (enemyBaseHp / enemyBaseMaxHp) * 100;
    const energyPercent = (energy / maxEnergy) * 100;

    return (
        <div className="w-full space-y-4">
            {/* Top bar - Stage info and HP */}
            <div className="flex justify-between items-center gap-4 flex-wrap">
                {/* Player HP */}
                <div className="flex-1 min-w-[200px]">
                    <div className="text-sm text-green-400 mb-1">Your Base</div>
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                            style={{ width: `${playerHpPercent}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        {playerBaseHp} / {playerBaseMaxHp}
                    </div>
                </div>

                {/* Stage info */}
                <div className="text-center">
                    <div className="text-sm text-slate-400">Stage {stageId}</div>
                    <div className="text-lg font-bold text-white">{stageName}</div>
                    <div className="text-xs text-slate-400">
                        Wave {Math.min(currentWave + 1, totalWaves)} / {totalWaves}
                    </div>
                </div>

                {/* Enemy HP */}
                <div className="flex-1 min-w-[200px]">
                    <div className="text-sm text-red-400 mb-1 text-right">Enemy Base</div>
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300 ml-auto"
                            style={{ width: `${enemyHpPercent}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-400 mt-1 text-right">
                        {enemyBaseHp} / {enemyBaseMaxHp}
                    </div>
                </div>
            </div>

            {/* Energy bar */}
            <div className="bg-slate-800 rounded-lg p-3">
                <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-bold text-lg">⚡</span>
                    <div className="flex-1">
                        <div className="h-6 bg-slate-700 rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-150"
                                style={{ width: `${energyPercent}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-sm drop-shadow-lg">
                                    {energy} / {maxEnergy}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pause button */}
                    <button
                        onClick={isPaused ? onResume : onPause}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold transition-colors"
                    >
                        {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                    </button>
                </div>
            </div>

            {/* Unit buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
                {PLAYER_UNITS.map((unit, index) => (
                    <UnitButton
                        key={unit.id}
                        unitId={unit.id}
                        name={unit.name}
                        icon={unit.icon}
                        cost={unit.cost}
                        color={unit.color}
                        cooldown={unit.cooldown}
                        cooldownRemaining={cooldowns[unit.id] || 0}
                        energy={energy}
                        disabled={isPaused}
                        onSpawn={onSpawnUnit}
                        keyHint={`${index + 1}`}
                    />
                ))}
            </div>

            {/* Pause overlay */}
            {isPaused && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
                    <div className="text-4xl font-bold text-white animate-pulse">PAUSED</div>
                </div>
            )}
        </div>
    );
}
