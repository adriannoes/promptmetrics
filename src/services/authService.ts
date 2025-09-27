
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { auditService } from '@/services/auditService';

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

    // Log audit event
    await auditService.logSignup(sanitizedEmail, !error);

    return { error };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: { message: 'An unexpected error occurred during signup' } };
  }
};

export const signIn = async (email: string, password: string) => {
  logger.auth('Starting login process', { email: email.substring(0, 3) + '***' });
  
  // Input validation
  if (!email || !email.includes('@')) {
    logger.auth('Invalid email format');
    return { error: { message: 'Please enter a valid email address' } };
  }
  
  if (!password) {
    logger.auth('Password is empty');
    return { error: { message: 'Password is required' } };
  }

  const sanitizedEmail = email.trim().toLowerCase();
  logger.auth('Email sanitized successfully');

  try {
    // Temporarily disable rate limiting check to debug login issue
    logger.auth('Skipping rate limit check (temporarily disabled)');
    /*
    logger.auth('Checking rate limit...');
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('is_rate_limited', { p_email: sanitizedEmail });

    if (rateLimitError) {
      logger.error('Rate limit check error', rateLimitError);
    } else if (rateLimitData) {
      logger.auth('User is rate limited');
      return { error: { message: 'Too many failed login attempts. Please try again in 15 minutes.' } };
    }
    */

    logger.auth('Attempting Supabase login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password
    });

    logger.auth('Supabase login response', { 
      hasUser: !!data?.user, 
      hasSession: !!data?.session, 
      hasError: !!error
    });

    const success = !error;
    logger.auth('Login success', { success });

    // Log audit event
    await auditService.logLogin(sanitizedEmail, success);
    
    try {
      logger.auth('Logging login attempt...');
      await supabase.rpc('log_login_attempt', {
        p_email: sanitizedEmail,
        p_success: success
      });
    } catch (logError) {
      logger.error('Failed to log login attempt', logError);
    }
    
    if (error) {
      logger.error('Login failed', { error: error.message });
    } else {
      logger.auth('Login successful!');
    }
    
    return { error };
  } catch (error) {
    logger.error('Signin exception', error);
    
    try {
      await supabase.rpc('log_login_attempt', {
        p_email: sanitizedEmail,
        p_success: false
      });
    } catch (logError) {
      logger.error('Failed to log login attempt', logError);
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
    logger.auth('Bypassing authentication for demo user...');
    
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

    // Bypass Supabase auth and directly trigger the auth state change
    // This simulates a successful login without actual authentication
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
    logger.error('Demo signin error', error);
    return { error: { message: 'An unexpected error occurred during demo signin' } };
  }
};

export const signOut = async () => {
  try {
    logger.auth('Starting signout process...');
    
    // Clear demo user session if exists
    logger.auth('Dispatching demo-logout event');
    window.dispatchEvent(new CustomEvent('demo-logout'));
    
    logger.auth('Calling supabase.auth.signOut()');
    await supabase.auth.signOut();
    
    logger.auth('Signout successful, redirecting to home');
    // Force redirect to home page after successful signout
    window.location.href = '/';
  } catch (error) {
    logger.error('Signout error', error);
    // Even if there's an error, try to redirect to clear the state
    logger.auth('Error occurred, forcing redirect to home');
    window.location.href = '/';
  }
};
