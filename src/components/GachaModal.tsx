'use client';

import { useState } from 'react';
import { GACHA_BANNERS, GachaBanner, rollGacha, getDropRates, canAffordGacha, getPityCount, PITY_THRESHOLD } from '@/game/data/gacha';
import { SkinData, RARITY_COLORS } from '@/game/data/skins';
import { getPlayerData } from '@/utils/playerData';

interface GachaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GachaModal({ isOpen, onClose }: GachaModalProps) {
    const [selectedBanner, setSelectedBanner] = useState<GachaBanner>(GACHA_BANNERS[0]);
    const [result, setResult] = useState<SkinData | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [showRates, setShowRates] = useState(false);

    const playerData = getPlayerData();
    const pityCount = getPityCount(selectedBanner.id);
    const rates = getDropRates(selectedBanner.id);

    const handleRoll = async () => {
        if (!canAffordGacha(selectedBanner.id)) return;

        setIsRolling(true);
        setResult(null);

        // Animation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const wonSkin = rollGacha(selectedBanner.id);
        setResult(wonSkin);
        setIsRolling(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-700">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">🎰 ガチャ</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Gems display */}
                <div className="bg-slate-800 rounded-lg p-3 mb-4 flex justify-between items-center">
                    <span className="text-slate-400">所持ジェム</span>
                    <span className="text-xl font-bold text-purple-400">💎 {playerData.gems}</span>
                </div>

                {/* Banner selection */}
                <div className="flex gap-2 mb-4">
                    {GACHA_BANNERS.map(banner => (
                        <button
                            key={banner.id}
                            onClick={() => setSelectedBanner(banner)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${selectedBanner.id === banner.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {banner.nameJa}
                        </button>
                    ))}
                </div>

                {/* Banner info */}
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    <div className="text-white font-bold mb-1">{selectedBanner.nameJa}</div>
                    <div className="text-sm text-slate-400 mb-2">{selectedBanner.description}</div>
                    <div className="text-purple-400 font-bold">💎 {selectedBanner.cost.gems} / 1回</div>
                </div>

                {/* Pity counter */}
                <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">天井カウンター</span>
                        <span className="text-orange-400 font-bold">{pityCount} / {PITY_THRESHOLD}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all"
                            style={{ width: `${(pityCount / PITY_THRESHOLD) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        {PITY_THRESHOLD}回で★レジェンダリー確定
                    </div>
                </div>

                {/* Drop rates */}
                <button
                    onClick={() => setShowRates(!showRates)}
                    className="text-sm text-slate-400 hover:text-white mb-4"
                >
                    {showRates ? '▼' : '▶'} 排出確率
                </button>

                {showRates && (
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-4 grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(rates).map(([rarity, rate]) => (
                            <div key={rarity} className="flex justify-between">
                                <span style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }}>
                                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                                </span>
                                <span className="text-white">{rate.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Result display */}
                {(isRolling || result) && (
                    <div className="bg-slate-800 rounded-xl p-6 mb-4 text-center">
                        {isRolling ? (
                            <div className="animate-pulse">
                                <div className="text-4xl mb-2">🎲</div>
                                <div className="text-slate-400">抽選中...</div>
                            </div>
                        ) : result && (
                            <div className="animate-bounce-in">
                                <div
                                    className="text-5xl mb-3"
                                    style={{ textShadow: `0 0 20px ${RARITY_COLORS[result.rarity]}` }}
                                >
                                    {result.icon || '🎁'}
                                </div>
                                <div
                                    className="font-bold text-lg"
                                    style={{ color: RARITY_COLORS[result.rarity] }}
                                >
                                    {result.nameJa}
                                </div>
                                <div className="text-sm text-slate-400 capitalize">{result.rarity}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Roll button */}
                <button
                    onClick={handleRoll}
                    disabled={isRolling || !canAffordGacha(selectedBanner.id)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isRolling || !canAffordGacha(selectedBanner.id)
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:scale-105'
                        }`}
                >
                    {isRolling ? '抽選中...' : `ガチャを回す (💎${selectedBanner.cost.gems})`}
                </button>
            </div>
        </div>
    );
}
