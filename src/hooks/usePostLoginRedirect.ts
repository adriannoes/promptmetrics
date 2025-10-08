
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPostLoginRedirect } from '@/services/redirectService';

export const usePostLoginRedirect = () => {
  const { user, profile, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      
      // Only redirect on login page and when we have both user and profile
      if (location.pathname !== '/login') {
        return;
      }
      if (loading || !user || !profile) {
        return;
      }


      try {
        const { path } = await getPostLoginRedirect(profile, userRole);
        navigate(path, { replace: true });
      } catch (error) {
        console.error('🚀 usePostLoginRedirect: Error during redirect:', error);
        navigate('/test', { replace: true });
      }
    };

    handleRedirect();
  }, [user, profile, userRole, loading, navigate, location.pathname]);
};
