import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://racfoelvuhdifnekjsro.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
}
)