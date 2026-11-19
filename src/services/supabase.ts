import { createClient } from '@supabase/supabase-js';
import { safeStorage } from '@/utils/safeStorage';

// Safe environment variable retrieval
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock-kfc-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-placeholder';

export const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
