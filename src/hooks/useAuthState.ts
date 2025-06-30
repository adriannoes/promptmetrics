
import { useDemoAuth } from './useDemoAuth';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useAuthState = () => {
  const { user: demoUser, session: demoSession, profile: demoProfile } = useDemoAuth();
  const { user: supabaseUser, session: supabaseSession, profile: supabaseProfile, loading } = useSupabaseAuth();

  // Prioritize demo auth if active, otherwise use Supabase auth
  const user = demoUser || supabaseUser;
  const session = demoSession || supabaseSession;
  const profile = demoProfile || supabaseProfile;

  return {
    user,
    session,
    profile,
    loading
  };
};
