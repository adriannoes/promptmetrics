
import { supabase } from '@/integrations/supabase/client';

export const signUp = async (email: string, password: string, fullName: string, inviteCode: string) => {
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

export const signIn = async (email: string, password: string) => {
  // Input validation
  if (!email || !email.includes('@')) {
    return { error: { message: 'Please enter a valid email address' } };
  }
  
  if (!password) {
    return { error: { message: 'Password is required' } };
  }

  const sanitizedEmail = email.trim().toLowerCase();

  try {
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

export const signInWithGoogle = async () => {
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

export const signInWithDemo = async () => {
  try {
    console.log('Initiating demo login...');
    
    // Create a mock session for the demo user
    const demoUser = {
      id: '82a96621-2849-4dee-a70f-8da2616823be',
      email: 'demo@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        full_name: 'Demo User'
      }
    };

    // Dispatch demo login event
    window.dispatchEvent(new CustomEvent('demo-login', { 
      detail: { 
        user: demoUser,
        session: {
          user: demoUser,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_at: Date.now() + 3600000, // 1 hour from now
          token_type: 'bearer'
        }
      }
    }));
    
    return { error: null };
  } catch (error) {
    console.error('Demo signin error:', error);
    return { error: { message: 'An unexpected error occurred during demo signin' } };
  }
};

export const signOut = async () => {
  try {
    console.log('Starting signout process...');
    
    // Clear demo user session first
    console.log('Dispatching demo logout event');
    window.dispatchEvent(new CustomEvent('demo-logout'));
    
    // Sign out from Supabase
    console.log('Signing out from Supabase...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase signout error:', error);
      return false;
    }
    
    console.log('Signout completed successfully');
    return true;
  } catch (error) {
    console.error('Signout error:', error);
    return false;
  }
};
