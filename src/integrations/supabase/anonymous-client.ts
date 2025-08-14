// Anonymous Supabase client for public operations (no authentication required)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL || "https://<project-ref>.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || "anon-key-placeholder";

// Anonymous client specifically for public operations like waitlist submission
export const anonymousSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  // Remove custom global headers to avoid CORS issues
});