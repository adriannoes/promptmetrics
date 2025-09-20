
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPostLoginRedirect } from '@/services/redirectService';

export const usePostLoginRedirect = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      console.log('🚀 usePostLoginRedirect: Current state:', { 
        pathname: location.pathname, 
        loading, 
        hasUser: !!user, 
        hasProfile: !!profile,
        userEmail: user?.email,
        profileEmail: profile?.email 
      });
      
      // Only redirect on login page and when we have both user and profile
      if (location.pathname !== '/login') {
        console.log('🚀 usePostLoginRedirect: Not on login page, skipping redirect');
        return;
      }
      if (loading || !user || !profile) {
        console.log('🚀 usePostLoginRedirect: Missing requirements for redirect');
        return;
      }

      console.log('🚀 usePostLoginRedirect: Executing post-login redirect for user:', user.id);

      try {
        const { path, reason } = await getPostLoginRedirect(profile);
        console.log('🚀 usePostLoginRedirect: Redirect decision:', { path, reason });
        navigate(path, { replace: true });
        console.log('🚀 usePostLoginRedirect: Navigation completed to:', path);
      } catch (error) {
        console.error('🚀 usePostLoginRedirect: Error during redirect:', error);
        navigate('/test', { replace: true });
      }
    };

    handleRedirect();
  }, [user, profile, loading, navigate, location.pathname]);
};
