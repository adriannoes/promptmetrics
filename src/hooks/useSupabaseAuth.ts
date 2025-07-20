
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

    // Handle manual logout events
    const handleForceLogout = () => {
      if (!mounted) return;
      
      console.log('Force logout event received - clearing Supabase auth state');
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Supabase auth state change:', event, 'session exists:', !!session, 'user id:', session?.user?.id);
        
        // Always update session and user state immediately
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          // Only fetch profile for authenticated users
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
              // Type assert the role to ensure it matches our Profile type
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
          }
        } else {
          // Clear profile immediately when user is null
          console.log('No session detected - clearing Supabase auth state');
          setProfile(null);
          setUser(null);
          setSession(null);
          
          // Ensure loading is set to false after logout
          setTimeout(() => {
            if (mounted) {
              setLoading(false);
            }
          }, 500);
        }
        
        // Always set loading to false after processing auth change
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Add force logout event listener
    window.addEventListener('force-logout', handleForceLogout);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial Supabase session check:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If no session, set loading to false immediately
      if (!session && mounted) {
        console.log('No initial session, setting loading to false');
        setLoading(false);
      }
    });

    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
      window.removeEventListener('force-logout', handleForceLogout);
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
