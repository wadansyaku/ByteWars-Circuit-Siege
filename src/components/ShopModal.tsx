'use client';

import { useState } from 'react';
import { PRODUCTS, formatPrice, createCheckoutSession, isStripeConfigured } from '@/utils/stripe';
import { SKINS, SkinData, RARITY_COLORS, getSkinsForUnit } from '@/game/data/skins';
import { getPlayerData, spendCoins, spendGems, addSkin, equipSkin, ownsSkin, getEquippedSkin } from '@/utils/playerData';
import { PLAYER_UNITS } from '@/game/data/units';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenGacha: () => void;
}

type TabType = 'gems' | 'skins' | 'equipped';

export default function ShopModal({ isOpen, onClose, onOpenGacha }: ShopModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('gems');
    const [selectedUnit, setSelectedUnit] = useState<string>(PLAYER_UNITS[0].id);
    const [purchasing, setPurchasing] = useState<string | null>(null);

    const playerData = getPlayerData();
    const unitSkins = getSkinsForUnit(selectedUnit);

    const handleBuyGems = async (productId: string) => {
        setPurchasing(productId);

        if (!isStripeConfigured()) {
            // Demo mode - grant gems directly
            const product = PRODUCTS.find(p => p.id === productId);
            if (product?.gems) {
                // Simulate purchase
                await new Promise(r => setTimeout(r, 1000));
                import('@/utils/playerData').then(({ addGems }) => addGems(product.gems!));
                alert(`🎉 ${product.nameJa}を購入しました！（デモモード）`);
            }
            if (product?.isPremium) {
                import('@/utils/playerData').then(({ setPremium }) => setPremium(true));
                alert(`🎉 プレミアムを購入しました！（デモモード）`);
            }
            setPurchasing(null);
            return;
        }

        const url = await createCheckoutSession(productId);
        if (url) {
            window.location.href = url;
        }
        setPurchasing(null);
    };

    const handleBuySkin = (skin: SkinData) => {
        if (ownsSkin(skin.id)) return;

        if (skin.price.coins) {
            if (spendCoins(skin.price.coins)) {
                addSkin(skin.id);
                alert(`🎉 ${skin.nameJa}を購入しました！`);
            } else {
                alert('コインが足りません');
            }
        } else if (skin.price.gems) {
            if (spendGems(skin.price.gems)) {
                addSkin(skin.id);
                alert(`🎉 ${skin.nameJa}を購入しました！`);
            } else {
                alert('ジェムが足りません');
            }
        }
    };

    const handleEquipSkin = (unitId: string, skinId: string | null) => {
        if (skinId) {
            equipSkin(unitId, skinId);
        } else {
            import('@/utils/playerData').then(({ unequipSkin }) => unequipSkin(unitId));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-slate-700">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">🛒 ショップ</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">×</button>
                </div>

                {/* Currency display */}
                <div className="p-4 bg-slate-800/50 flex gap-4 justify-center">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400">🪙</span>
                        <span className="font-bold text-white">{playerData.coins.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-purple-400">💎</span>
                        <span className="font-bold text-white">{playerData.gems.toLocaleString()}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                    {(['gems', 'skins', 'equipped'] as TabType[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'text-white border-b-2 border-blue-500'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab === 'gems' ? '💎 ジェム購入' : tab === 'skins' ? '🎨 スキン' : '✨ 装備中'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {/* Gems Tab */}
                    {activeTab === 'gems' && (
                        <div className="space-y-3">
                            {/* Gacha button */}
                            <button
                                onClick={onOpenGacha}
                                className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:scale-105 transition-transform"
                            >
                                🎰 ガチャを回す
                            </button>

                            <div className="text-slate-400 text-sm text-center my-4">── ジェムパック ──</div>

                            {PRODUCTS.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => handleBuyGems(product.id)}
                                    disabled={purchasing === product.id}
                                    className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex justify-between items-center transition-colors"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-white">{product.nameJa}</div>
                                        <div className="text-sm text-slate-400">{product.description}</div>
                                    </div>
                                    <div className="text-green-400 font-bold">
                                        {purchasing === product.id ? '処理中...' : formatPrice(product.price)}
                                    </div>
                                </button>
                            ))}

                            {!isStripeConfigured() && (
                                <div className="text-center text-xs text-slate-500 mt-4">
                                    ⚠️ Stripe未設定（デモモード）
                                </div>
                            )}
                        </div>
                    )}

                    {/* Skins Tab */}
                    {activeTab === 'skins' && (
                        <div className="space-y-4">
                            {/* Unit selector */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {PLAYER_UNITS.map(unit => (
                                    <button
                                        key={unit.id}
                                        onClick={() => setSelectedUnit(unit.id)}
                                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${selectedUnit === unit.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {unit.icon} {unit.name}
                                    </button>
                                ))}
                            </div>

                            {/* Skins list */}
                            <div className="grid gap-3">
                                {unitSkins.length === 0 ? (
                                    <div className="text-slate-500 text-center py-8">
                                        このユニットのスキンはまだありません
                                    </div>
                                ) : (
                                    unitSkins.map(skin => {
                                        const owned = ownsSkin(skin.id);
                                        const equipped = getEquippedSkin(skin.unitId) === skin.id;

                                        return (
                                            <div
                                                key={skin.id}
                                                className="p-4 bg-slate-800 rounded-xl flex items-center gap-4"
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                                    style={{ backgroundColor: skin.color + '30', border: `2px solid ${skin.color}` }}
                                                >
                                                    {skin.icon || PLAYER_UNITS.find(u => u.id === skin.unitId)?.icon}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-bold text-white">{skin.nameJa}</div>
                                                    <div
                                                        className="text-sm capitalize"
                                                        style={{ color: RARITY_COLORS[skin.rarity] }}
                                                    >
                                                        {skin.rarity}
                                                    </div>
                                                </div>

                                                {owned ? (
                                                    <button
                                                        onClick={() => handleEquipSkin(skin.unitId, equipped ? null : skin.id)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${equipped
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                            }`}
                                                    >
                                                        {equipped ? '装備中' : '装備'}
                                                    </button>
                                                ) : skin.gachaOnly ? (
                                                    <span className="text-sm text-purple-400">ガチャ限定</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBuySkin(skin)}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white"
                                                    >
                                                        {skin.price.coins ? `🪙${skin.price.coins}` : `💎${skin.price.gems}`}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Equipped Tab */}
                    {activeTab === 'equipped' && (
                        <div className="space-y-3">
                            {PLAYER_UNITS.map(unit => {
                                const equippedSkinId = getEquippedSkin(unit.id);
                                const equippedSkin = equippedSkinId ? SKINS.find(s => s.id === equippedSkinId) : null;

                                return (
                                    <div key={unit.id} className="p-4 bg-slate-800 rounded-xl flex items-center gap-4">
                                        <div className="text-3xl">{unit.icon}</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white">{unit.name}</div>
                                            <div className="text-sm text-slate-400">
                                                {equippedSkin ? equippedSkin.nameJa : 'デフォルト'}
                                            </div>
                                        </div>
                                        {equippedSkin && (
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: equippedSkin.color }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
