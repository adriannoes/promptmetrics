
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // Start as loading to evitar redirects precoces antes de reidratar a sessão
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile with organization
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      setLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations (
            id,
            name,
            website_url
          )
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      const typedProfile: Profile = {
        ...profileData,
        role: profileData.role as 'client' | 'admin'
      };

      console.log('Profile loaded with organization:', typedProfile);
      setProfile(typedProfile);
      return typedProfile;
    } catch (error) {
      console.error('Profile fetch exception:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useSupabaseAuth: Initializing auth with profile...');
    setLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session:', !!session, error?.message);
      if (session) {
        setSession(session);
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('useSupabaseAuth current state:', { 
    user: !!user, 
    session: !!session,
    profile: !!profile,
    hasOrganization: !!profile?.organization_id,
    loading 
  });

  return {
    user,
    session,
    profile,
    loading
  };
};
