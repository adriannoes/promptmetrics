import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'admin';
  invite_code?: string;
  organization_id?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, inviteCode: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile without setTimeout to prevent race conditions
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching profile:', error);
              // If profile doesn't exist, user might be in the middle of signup
              if (error.code !== 'PGRST116') {
                throw error;
              }
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          }
        } else {
          setProfile(null);
        }
        
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
      if (!session && mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, inviteCode: string) => {
    // Input validation
    if (!email || !email.includes('@')) {
      return { error: { message: 'Please enter a valid email address' } };
    }
    
    if (!password || password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters long' } };
    }
    
    if (!fullName || fullName.trim().length < 2) {
      return { error: { message: 'Please enter your full name (at least 2 characters)' } };
    }
    
    if (!inviteCode || inviteCode.trim().length === 0) {
      return { error: { message: 'Invitation code is required' } };
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedFullName = fullName.trim();
    const sanitizedInviteCode = inviteCode.trim().toUpperCase();

    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName,
            invite_code: sanitizedInviteCode
          }
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: { message: 'An unexpected error occurred during signup' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Input validation
    if (!email || !email.includes('@')) {
      return { error: { message: 'Please enter a valid email address' } };
    }
    
    if (!password) {
      return { error: { message: 'Password is required' } };
    }

    // Sanitize email
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      // Check rate limiting
      const { data: rateLimitData, error: rateLimitError } = await supabase
        .rpc('is_rate_limited', { p_email: sanitizedEmail });

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
      } else if (rateLimitData) {
        return { error: { message: 'Too many failed login attempts. Please try again in 15 minutes.' } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      // Log the login attempt
      const success = !error;
      try {
        await supabase.rpc('log_login_attempt', {
          p_email: sanitizedEmail,
          p_success: success
        });
      } catch (logError) {
        console.error('Failed to log login attempt:', logError);
      }
      
      return { error };
    } catch (error) {
      console.error('Signin error:', error);
      
      // Log failed attempt
      try {
        await supabase.rpc('log_login_attempt', {
          p_email: sanitizedEmail,
          p_success: false
        });
      } catch (logError) {
        console.error('Failed to log login attempt:', logError);
      }
      
      return { error: { message: 'An unexpected error occurred during signin' } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Google signin error:', error);
      return { error: { message: 'An unexpected error occurred during Google signin' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
