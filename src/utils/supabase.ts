import { SupabaseClient, createClient } from '@supabase/supabase-js';

// Environment variables should be set in .env.local or production environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        // console.warn('Supabase credentials missing. Running in mock mode.');
        return null;
    }

    if (!supabaseInstance) {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseInstance;
};
