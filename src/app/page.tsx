'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STAGES } from '@/game/data/stages';
import { isStageUnlocked } from '@/utils/storage';

export default function HomePage() {
  const [showStages, setShowStages] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-float">
          ByteWars
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 tracking-wider">
          CIRCUIT SIEGE
        </h2>
        <p className="text-slate-400 mt-4 max-w-md mx-auto">
          Deploy your digital army to destroy the enemy base.
          Manage energy, time cooldowns, and crush the opposition!
        </p>
      </div>

      {/* Main menu */}
      {!showStages && !showHowTo && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setShowStages(true)}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-bold text-xl shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 animate-glow"
          >
            🎮 Start Game
          </button>

          <button
            onClick={() => setShowHowTo(true)}
            className="w-full py-3 px-8 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:scale-105"
          >
            📖 How to Play
          </button>

          <div className="mt-4 text-center text-slate-500 text-sm">
            <p>Best played on PC or landscape mobile</p>
          </div>
        </div>
      )}

      {/* Stage selection */}
      {showStages && (
        <div className="w-full max-w-lg">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Select Stage</h3>
          <div className="grid gap-4">
            {STAGES.map((stage) => {
              const unlocked = isStageUnlocked(stage.id);
              return (
                <div
                  key={stage.id}
                  className={`
                    relative rounded-xl p-4 border-2 transition-all
                    ${unlocked
                      ? 'bg-slate-800/80 border-slate-600 hover:border-blue-500 hover:bg-slate-700/80 cursor-pointer'
                      : 'bg-slate-900/50 border-slate-700 opacity-50 cursor-not-allowed'}
                  `}
                >
                  {unlocked ? (
                    <Link href={`/play?stage=${stage.id}`} className="block">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">⚔️</div>
                        <div className="flex-1">
                          <div className="text-xl font-bold text-white">
                            Stage {stage.id}: {stage.name}
                          </div>
                          <div className="text-sm text-slate-400">{stage.description}</div>
                        </div>
                        <div className="text-blue-400 text-xl">→</div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🔒</div>
                      <div className="flex-1">
                        <div className="text-xl font-bold text-slate-500">
                          Stage {stage.id}: {stage.name}
                        </div>
                        <div className="text-sm text-slate-600">Complete previous stage to unlock</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowStages(false)}
            className="w-full mt-6 py-3 px-8 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-all"
          >
            ← Back
          </button>
        </div>
      )}

      {/* How to Play */}
      {showHowTo && (
        <div className="w-full max-w-lg bg-slate-800/80 rounded-xl p-6 border border-slate-600">
          <h3 className="text-2xl font-bold text-white mb-4">How to Play</h3>

          <div className="space-y-4 text-slate-300">
            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-bold text-white">Objective</div>
                <div className="text-sm">Destroy the enemy base before they destroy yours!</div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-bold text-white">Energy</div>
                <div className="text-sm">Spend energy to deploy units. Energy regenerates over time (1 per second).</div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <div className="font-bold text-white">Controls</div>
                <div className="text-sm">
                  <strong>PC:</strong> Click unit buttons or press 1-6 keys<br />
                  <strong>Mobile:</strong> Tap unit buttons
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-bold text-white">Cooldowns</div>
                <div className="text-sm">Each unit has a cooldown timer after deployment. Wait for it to reset!</div>
              </div>
            </div>

            <div className="border-t border-slate-600 pt-4 mt-4">
              <div className="font-bold text-white mb-2">Unit Types</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-green-400">⚡ ByteRunner</span> - Fast scout</div>
                <div><span className="text-blue-400">🛡️ ShieldGolem</span> - Heavy tank</div>
                <div><span className="text-pink-400">🎯 ArcSlinger</span> - Ranged</div>
                <div><span className="text-orange-400">💥 NovaBurst</span> - Area damage</div>
                <div><span className="text-purple-400">📡 SyncDrone</span> - Support aura</div>
                <div><span className="text-red-400">🔥 HexBit</span> - High DPS</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHowTo(false)}
            className="w-full mt-6 py-3 px-8 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-all"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-slate-600 text-sm">
        <p>© 2026 ByteWars: Circuit Siege | MIT License</p>
      </div>
    </main>
  );
}
