
import React from 'react';
import { useDemoAuth } from './useDemoAuth';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useAuthState = () => {
  const { user: demoUser, session: demoSession, profile: demoProfile, loading: demoLoading } = useDemoAuth();
  const { user: supabaseUser, session: supabaseSession, profile: supabaseProfile, loading: supabaseLoading } = useSupabaseAuth();

  // Prioritize demo auth if active, otherwise use Supabase auth
  const user = demoUser || supabaseUser;
  const session = demoSession || supabaseSession;
  const profile = demoProfile || supabaseProfile;
  
  // If demo user is active, use demo loading state, otherwise use Supabase loading
  const loading = demoUser ? demoLoading : supabaseLoading;

  return {
    user,
    session,
    profile,
    loading
  };
};
