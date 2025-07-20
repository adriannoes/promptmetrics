
import { useState, useEffect } from 'react';
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Supabase auth state change:', event, session?.user?.id);
        
        // Always update session and user state immediately
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
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
              setProfile(typedProfile);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
            setProfile(null);
          }
        } else {
          // Clear profile immediately when user is null
          console.log('Clearing Supabase profile - user signed out');
          setProfile(null);
        }
        
        // Always set loading to false after processing auth change
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial Supabase session check:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If no session, set loading to false immediately
      if (!session && mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading
  };
};
