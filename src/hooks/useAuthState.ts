
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Handle demo login events
    const handleDemoLogin = async (event: CustomEvent) => {
      if (!mounted) return;
      
      console.log('Demo login event received');
      const { user: demoUser, session: demoSession } = event.detail;
      
      setUser(demoUser);
      setSession(demoSession);
      
      // Fetch the actual demo profile from the database
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', 'demo@example.com')
          .single();
        
        if (error) {
          console.error('Error fetching demo profile:', error);
          // Fallback to mock profile
          const demoProfile: Profile = {
            id: '82a96621-2849-4dee-a70f-8da2616823be',
            full_name: 'Demo User',
            email: 'demo@example.com',
            role: 'client',
            organization_id: null,
            invite_code: 'DEMO2024',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(demoProfile);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Demo profile fetch error:', error);
        // Fallback to mock profile
        const demoProfile: Profile = {
          id: '82a96621-2849-4dee-a70f-8da2616823be',
          full_name: 'Demo User',
          email: 'demo@example.com',
          role: 'client',
          organization_id: null,
          invite_code: 'DEMO2024',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(demoProfile);
      }
      
      setLoading(false);
    };

    // Handle demo logout events
    const handleDemoLogout = () => {
      if (!mounted) return;
      
      console.log('Demo logout event received');
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
    };

    // Add demo login/logout event listeners
    window.addEventListener('demo-login', handleDemoLogin as EventListener);
    window.addEventListener('demo-logout', handleDemoLogout as EventListener);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.id);
        
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
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
            setProfile(null);
          }
        } else {
          // Clear profile immediately when user is null
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
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // If no session, set loading to false immediately
      if (!session && mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      window.removeEventListener('demo-login', handleDemoLogin as EventListener);
      window.removeEventListener('demo-logout', handleDemoLogout as EventListener);
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
