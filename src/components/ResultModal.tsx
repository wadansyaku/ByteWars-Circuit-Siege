'use client';

interface ResultModalProps {
    result: 'win' | 'lose';
    stageId: number;
    stageName: string;
    onRetry: () => void;
    onNextStage: () => void;
    onMenu: () => void;
    hasNextStage: boolean;
}

export default function ResultModal({
    result,
    stageId,
    stageName,
    onRetry,
    onNextStage,
    onMenu,
    hasNextStage,
}: ResultModalProps) {
    const isWin = result === 'win';

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
                    {isWin ? 'VICTORY!' : 'DEFEATED'}
                </h2>

                {/* Stage info */}
                <p className="text-slate-300 mb-6">
                    Stage {stageId}: {stageName}
                </p>

                {/* Message */}
                <p className="text-slate-400 mb-8">
                    {isWin
                        ? 'Great job! You destroyed the enemy base!'
                        : 'Your base was destroyed. Try again!'}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    {isWin && hasNextStage && (
                        <button
                            onClick={onNextStage}
                            className="w-full py-3 px-6 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-lg transition-colors"
                        >
                            Next Stage →
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
                        {isWin ? 'Play Again' : 'Retry'}
                    </button>

                    <button
                        onClick={onMenu}
                        className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold transition-colors"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
