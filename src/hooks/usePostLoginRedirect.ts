
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPostLoginRedirect } from '@/services/redirectService';

export const usePostLoginRedirect = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      // Don't redirect if still loading or no user
      if (loading || !user || !profile) return;

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
  }, [user, profile, loading, navigate]);
};
