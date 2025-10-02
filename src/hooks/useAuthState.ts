
import { useDemoAuth } from './useDemoAuth';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useAuthState = () => {
  const { user: demoUser, session: demoSession, profile: demoProfile, userRole: demoUserRole } = useDemoAuth();
  const { user: supabaseUser, session: supabaseSession, profile: supabaseProfile, userRole: supabaseUserRole, loading } = useSupabaseAuth();

  // Prioritize demo auth if active, otherwise use Supabase auth
  const user = demoUser || supabaseUser;
  const session = demoSession || supabaseSession;
  const profile = demoProfile || supabaseProfile;
  const userRole = demoUserRole || supabaseUserRole;

  console.log('🔐 useAuthState:', {
    demoUser: !!demoUser,
    supabaseUser: !!supabaseUser,
    demoProfile: !!demoProfile,
    supabaseProfile: !!supabaseProfile,
    demoUserRole: demoUserRole?.role,
    supabaseUserRole: supabaseUserRole?.role,
    loading,
    finalUser: !!user,
    finalProfile: !!profile,
    finalUserRole: userRole?.role,
    userEmail: user?.email,
    profileEmail: profile?.email
  });

  return {
    user,
    session,
    profile,
    userRole,
    loading
  };
};
