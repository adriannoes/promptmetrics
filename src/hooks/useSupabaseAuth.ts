
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log('useSupabaseAuth: Starting initialization...');

    // Start with loading = false, let onAuthStateChange handle everything
    setLoading(false);

    // Set up auth state listener - this will handle initial state too
    console.log('useSupabaseAuth: Setting up onAuthStateChange listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Supabase auth state change:', event, 'session exists:', !!session, 'user id:', session?.user?.id);
        
        // Always update session and user state immediately
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          setLoading(true);
          
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching profile:', error);
              if (error.code !== 'PGRST116') {
                setProfile(null);
              }
            } else {
              const typedProfile: Profile = {
                ...profileData,
                role: profileData.role as 'client' | 'admin'
              };
              console.log('Profile loaded:', typedProfile);
              setProfile(typedProfile);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
            setProfile(null);
          } finally {
            setLoading(false);
          }
        } else {
          console.log('No session - clearing auth state');
          setProfile(null);
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    );

    // Set a brief timeout to ensure auth is initialized
    const initTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth initialization timeout reached');
        setLoading(false);
      }
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      subscription.unsubscribe();
      console.log('useSupabaseAuth: Cleanup completed');
    };
  }, []);

  // Monitor state changes for debugging
  React.useEffect(() => {
    console.log('useSupabaseAuth state changed:', { 
      user: !!user, 
      session: !!session, 
      profile: !!profile, 
      loading 
    });
  }, [user, session, profile, loading]);

  return {
    user,
    session,
    profile,
    loading
  };
};
