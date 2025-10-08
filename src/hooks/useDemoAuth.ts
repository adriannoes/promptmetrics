
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/auth';

export const useDemoAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    let mounted = true;

    // Handle demo login events
    const handleDemoLogin = async (event: CustomEvent) => {
      if (!mounted) return;
      
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
            organization_id: null,
            invite_code: 'DEMO2024',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(demoProfile);
          
          // Set mock userRole for demo
          const demoRole: UserRole = {
            id: 'demo-role-id',
            user_id: '82a96621-2849-4dee-a70f-8da2616823be',
            role: 'client',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUserRole(demoRole);
        } else {
          setProfile(profileData);
          
          // Fetch userRole for demo user
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', profileData.id)
            .single();
          
          if (roleData) {
            setUserRole(roleData);
          } else {
            // Fallback demo role
            const demoRole: UserRole = {
              id: 'demo-role-id',
              user_id: profileData.id,
              role: 'client',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserRole(demoRole);
          }
        }
      } catch (error) {
        console.error('Demo profile fetch error:', error);
        // Fallback to mock profile
        const demoProfile: Profile = {
          id: '82a96621-2849-4dee-a70f-8da2616823be',
          full_name: 'Demo User',
          email: 'demo@example.com',
          organization_id: null,
          invite_code: 'DEMO2024',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(demoProfile);
        
        const demoRole: UserRole = {
          id: 'demo-role-id',
          user_id: '82a96621-2849-4dee-a70f-8da2616823be',
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserRole(demoRole);
      }
    };

    // Handle demo logout events
    const handleDemoLogout = () => {
      if (!mounted) return;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole(null);
    };

    // Add demo login/logout event listeners
    window.addEventListener('demo-login', handleDemoLogin as any);
    window.addEventListener('demo-logout', handleDemoLogout as any);

    return () => {
      mounted = false;
      window.removeEventListener('demo-login', handleDemoLogin as any);
      window.removeEventListener('demo-logout', handleDemoLogout as any);
    };
  }, []);

  return {
    user,
    session,
    profile,
    userRole
  };
};
