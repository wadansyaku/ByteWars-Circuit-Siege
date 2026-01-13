import React, { useEffect, useState, useCallback } from 'react';
import { LeaderboardEntry, getLeaderboard, submitScore } from '../utils/leaderboard';

interface LeaderboardModalProps {
    stageId: number;
    isOpen: boolean;
    onClose: () => void;
    playerScore?: number; // If provided, shows submit form
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ stageId, isOpen, onClose, playerScore }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const loadLeaderboard = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getLeaderboard(stageId);
            setEntries(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [stageId]);

    useEffect(() => {
        if (isOpen) {
            loadLeaderboard();
        }
    }, [isOpen, loadLeaderboard]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerName.trim() || !playerScore) return;

        setIsSubmitting(true);
        try {
            await submitScore(stageId, playerName, playerScore);
            setHasSubmitted(true);
            await loadLeaderboard(); // Refresh list
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>🏆</span> Stage {stageId} Ranking
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Submission Form */}
                    {playerScore !== undefined && !hasSubmitted && (
                        <div className="mb-8 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <h3 className="text-emerald-400 font-bold mb-2 text-center">🎉 High Score!</h3>
                            <p className="text-slate-300 text-center text-sm mb-4">
                                You cleared the stage with score: <span className="text-white font-mono text-lg">{playerScore}</span>
                            </p>
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={12}
                                    placeholder="Enter Pilot Name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Ranking List */}
                    {isLoading ? (
                        <div className="text-center py-8 text-slate-500 animate-pulse">Loading data...</div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No records yet. Be the first!</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-400 border-b border-slate-700">
                                <tr>
                                    <th className="pb-2 pl-2">Rank</th>
                                    <th className="pb-2">Pilot</th>
                                    <th className="pb-2 text-right pr-2">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {entries.map((entry, index) => (
                                    <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 pl-2 font-mono text-slate-500 w-12">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </td>
                                        <td className="py-3 font-bold text-slate-200">
                                            {entry.player_name}
                                        </td>
                                        <td className="py-3 text-right pr-2 font-mono text-emerald-400">
                                            {entry.score}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
