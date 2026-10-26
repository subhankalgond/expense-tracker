import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ledgerbrutalist.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo-placeholder-key';
// Determines whether the current configuration points to an active live project
export const isConfiguredSupabase = Boolean(supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('ledgerbrutalist.supabase.co') &&
    !supabaseAnonKey.includes('demo-placeholder-key') &&
    !supabaseAnonKey.includes('your-anon-key'));
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
