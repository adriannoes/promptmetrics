
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useSupabaseAuth: Initializing simple auth...');
    
    // Get initial session immediately
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session:', !!session, error?.message);
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setProfile(null); // Clear profile for now to avoid DB issues
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('useSupabaseAuth current state:', { 
    user: !!user, 
    session: !!session, 
    loading 
  });

  return {
    user,
    session,
    profile,
    loading
  };
};
