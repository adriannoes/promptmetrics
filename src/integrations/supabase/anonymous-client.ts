// Anonymous Supabase client for public operations (no authentication required)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://racfoelvuhdifnekjsro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0";

// Anonymous client specifically for public operations like waitlist submission
export const anonymousSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  // Remove custom global headers to avoid CORS issues
});