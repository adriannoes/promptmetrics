
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
      // Only redirect on login page and when we have both user and profile
      if (location.pathname !== '/login') return;
      if (loading || !user || !profile) return;

      console.log('Executing post-login redirect for user:', user.id);

      try {
        const { path, reason } = await getPostLoginRedirect(profile);
        console.log('Post-login redirect:', reason);
        navigate(path, { replace: true });
      } catch (error) {
        console.error('Error during post-login redirect:', error);
        navigate('/test', { replace: true });
      }
    };

    handleRedirect();
  }, [user, profile, loading, navigate, location.pathname]);
};
