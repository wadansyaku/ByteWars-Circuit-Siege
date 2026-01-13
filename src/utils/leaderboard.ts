import { getSupabase } from './supabase';

export interface LeaderboardEntry {
    id: string;
    stage_id: number;
    player_name: string;
    score: number; // For now score = game time (lower is better) or clear score
    created_at: string;
}

// Mock data storage key
const MOCK_STORAGE_KEY = 'bytewars_mock_leaderboard';

const getMockData = (): LeaderboardEntry[] => {
    if (typeof window === 'undefined') return [];
    const start = localStorage.getItem(MOCK_STORAGE_KEY);
    return start ? JSON.parse(start) : [];
};

const saveMockData = (data: LeaderboardEntry[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

export const getLeaderboard = async (stageId: number, limit = 10): Promise<LeaderboardEntry[]> => {
    const supabase = getSupabase();

    if (supabase) {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('stage_id', stageId)
            .order('score', { ascending: false }) // Assuming higher score is better. If time, use true.
            .limit(limit);

        if (error) {
            console.error('Supabase error:', error);
            return [];
        }
        return data || [];
    } else {
        // Mock implementation
        await new Promise(r => setTimeout(r, 500)); // Simulate delay
        const allData = getMockData();
        return allData
            .filter(e => e.stage_id === stageId)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
};

export const submitScore = async (stageId: number, playerName: string, score: number): Promise<void> => {
    const supabase = getSupabase();

    if (supabase) {
        const { error } = await supabase
            .from('leaderboard')
            .insert([
                { stage_id: stageId, player_name: playerName, score: score }
            ]);

        if (error) {
            console.error('Supabase submit error:', error);
            throw error;
        }
    } else {
        // Mock implementation
        await new Promise(r => setTimeout(r, 500));
        const allData = getMockData();
        const newEntry: LeaderboardEntry = {
            id: Math.random().toString(36).substr(2, 9),
            stage_id: stageId,
            player_name: playerName,
            score: score,
            created_at: new Date().toISOString()
        };
        allData.push(newEntry);
        saveMockData(allData);
    }
};
