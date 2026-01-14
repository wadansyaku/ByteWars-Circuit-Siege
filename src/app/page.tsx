'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STAGES } from '@/game/data/stages';
import { isStageUnlocked } from '@/utils/storage';
import { getPlayStats } from '@/utils/analytics';
import { ja } from '@/utils/i18n';
import ShopModal from '@/components/ShopModal';
import GachaModal from '@/components/GachaModal';

export default function HomePage() {
  const [showStages, setShowStages] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showGacha, setShowGacha] = useState(false);

  const stats = getPlayStats();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-float">
          {ja.title}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 tracking-wider">
          {ja.subtitle}
        </h2>
        <p className="text-slate-400 mt-4 max-w-md mx-auto">
          {ja.tagline}
        </p>
      </div>

      {/* Main menu */}
      {!showStages && !showHowTo && !showStats && !showShop && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setShowStages(true)}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-bold text-xl shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 animate-glow"
          >
            🎮 {ja.startGame}
          </button>

          <button
            onClick={() => setShowHowTo(true)}
            className="w-full py-3 px-8 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:scale-105"
          >
            📖 {ja.howToPlay}
          </button>

          <button
            onClick={() => setShowStats(true)}
            className="w-full py-3 px-8 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:scale-105"
          >
            📊 {ja.stats}
          </button>

          <button
            onClick={() => setShowShop(true)}
            className="w-full py-3 px-8 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:scale-105"
          >
            🛒 ショップ
          </button>

          <div className="mt-4 text-center text-slate-500 text-sm">
            <p>PC・スマホ対応</p>
          </div>
        </div>
      )}

      {/* Stage selection */}
      {showStages && (
        <div className="w-full max-w-lg">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">{ja.selectStage}</h3>
          <div className="grid gap-4">
            {STAGES.map((stage) => {
              const unlocked = isStageUnlocked(stage.id);
              const stageInfo = ja.stages[stage.id as keyof typeof ja.stages];
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
                            {ja.stage} {stage.id}: {stageInfo.name}
                          </div>
                          <div className="text-sm text-slate-400">{stageInfo.description}</div>
                        </div>
                        <div className="text-blue-400 text-xl">→</div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🔒</div>
                      <div className="flex-1">
                        <div className="text-xl font-bold text-slate-500">
                          {ja.stage} {stage.id}: {stageInfo.name}
                        </div>
                        <div className="text-sm text-slate-600">{ja.unlockHint}</div>
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
            ← {ja.back}
          </button>
        </div>
      )}

      {/* How to Play */}
      {showHowTo && (
        <div className="w-full max-w-lg bg-slate-800/80 rounded-xl p-6 border border-slate-600">
          <h3 className="text-2xl font-bold text-white mb-4">{ja.howToPlay}</h3>

          <div className="space-y-4 text-slate-300">
            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-bold text-white">{ja.objective}</div>
                <div className="text-sm">{ja.objectiveDesc}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-bold text-white">{ja.energyTitle}</div>
                <div className="text-sm">{ja.energyDesc}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <div className="font-bold text-white">{ja.controlsTitle}</div>
                <div className="text-sm">
                  {ja.controlsPC}<br />
                  {ja.controlsMobile}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-bold text-white">{ja.cooldownTitle}</div>
                <div className="text-sm">{ja.cooldownDesc}</div>
              </div>
            </div>

            <div className="border-t border-slate-600 pt-4 mt-4">
              <div className="font-bold text-white mb-2">{ja.unitTypes}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-green-400">⚡ {ja.units.byterunner.name}</span></div>
                <div><span className="text-blue-400">🛡️ {ja.units.shieldgolem.name}</span></div>
                <div><span className="text-pink-400">🎯 {ja.units.arcslinger.name}</span></div>
                <div><span className="text-orange-400">💥 {ja.units.novaburst.name}</span></div>
                <div><span className="text-purple-400">📡 {ja.units.syncdrone.name}</span></div>
                <div><span className="text-red-400">🔥 {ja.units.hexbit.name}</span></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHowTo(false)}
            className="w-full mt-6 py-3 px-8 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-all"
          >
            ← {ja.back}
          </button>
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <div className="w-full max-w-lg bg-slate-800/80 rounded-xl p-6 border border-slate-600">
          <h3 className="text-2xl font-bold text-white mb-6">{ja.stats}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {stats.winRate.toFixed(0)}%
              </div>
              <div className="text-sm text-slate-400">{ja.winRate}</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">
                {stats.totalGames}
              </div>
              <div className="text-sm text-slate-400">{ja.totalGames}</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-400">
                {stats.favoriteUnit
                  ? ja.units[stats.favoriteUnit as keyof typeof ja.units]?.name || '-'
                  : '-'}
              </div>
              <div className="text-sm text-slate-400">{ja.favoriteUnit}</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">
                {stats.totalPlayTimeMinutes}
              </div>
              <div className="text-sm text-slate-400">{ja.playTime}（{ja.minutes}）</div>
            </div>
          </div>

          <button
            onClick={() => setShowStats(false)}
            className="w-full mt-6 py-3 px-8 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-all"
          >
            ← {ja.back}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-slate-600 text-sm">
        <p>{ja.copyright} | {ja.license}</p>
      </div>

      {/* Shop Modal */}
      <ShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        onOpenGacha={() => {
          setShowShop(false);
          setShowGacha(true);
        }}
      />

      {/* Gacha Modal */}
      <GachaModal
        isOpen={showGacha}
        onClose={() => setShowGacha(false)}
      />
    </main>
  );
}
