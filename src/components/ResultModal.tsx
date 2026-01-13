'use client';

import { useState } from 'react';
import { ja } from '@/utils/i18n';
import { LeaderboardModal } from './LeaderboardModal';

interface ResultModalProps {
    result: 'win' | 'lose';
    stageId: number;
    stageName: string;
    score?: number; // Game completion time in seconds
    onRetry: () => void;
    onNextStage: () => void;
    onMenu: () => void;
    hasNextStage: boolean;
}

export default function ResultModal({
    result,
    stageId,
    score,
    onRetry,
    onNextStage,
    onMenu,
    hasNextStage,
}: ResultModalProps) {
    const isWin = result === 'win';
    const stageInfo = ja.stages[stageId as keyof typeof ja.stages];
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div
                className={`
          max-w-md w-full rounded-2xl p-8 text-center
          ${isWin
                        ? 'bg-gradient-to-b from-green-900/90 to-slate-900/90 border border-green-500/50'
                        : 'bg-gradient-to-b from-red-900/90 to-slate-900/90 border border-red-500/50'}
        `}
                style={{
                    boxShadow: isWin
                        ? '0 0 50px rgba(34, 197, 94, 0.3)'
                        : '0 0 50px rgba(239, 68, 68, 0.3)',
                }}
            >
                {/* Result icon */}
                <div className="text-7xl mb-4 animate-bounce">
                    {isWin ? '🎉' : '💀'}
                </div>

                {/* Result text */}
                <h2
                    className={`text-4xl font-bold mb-2 ${isWin ? 'text-green-400' : 'text-red-400'}`}
                >
                    {isWin ? ja.victory : ja.defeat}
                </h2>

                {/* Stage info */}
                <p className="text-slate-300 mb-6">
                    {ja.stage} {stageId}: {stageInfo?.name}
                </p>

                {/* Score info */}
                {isWin && score && (
                    <p className="text-emerald-400 font-bold text-xl mb-4">
                        Clear Time: {score}s
                    </p>
                )}

                {/* Message */}
                <p className="text-slate-400 mb-8">
                    {isWin ? ja.victoryMessage : ja.defeatMessage}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    {isWin && (
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-bold text-lg transition-colors flex justify-center items-center gap-2"
                        >
                            <span>🏆</span> Ranking
                        </button>
                    )}

                    {isWin && hasNextStage && (
                        <button
                            onClick={onNextStage}
                            className="w-full py-3 px-6 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-lg transition-colors"
                        >
                            {ja.nextStage} →
                        </button>
                    )}

                    <button
                        onClick={onRetry}
                        className={`
              w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition-colors
              ${isWin
                                ? 'bg-slate-700 hover:bg-slate-600'
                                : 'bg-blue-600 hover:bg-blue-500'}
            `}
                    >
                        {isWin ? ja.playAgain : ja.retry}
                    </button>

                    <button
                        onClick={onMenu}
                        className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold transition-colors"
                    >
                        {ja.backToMenu}
                    </button>
                </div>
            </div>

            {/* Leaderboard Modal */}
            <LeaderboardModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                stageId={stageId}
                playerScore={isWin ? score : undefined}
            />
        </div>
    );
}
