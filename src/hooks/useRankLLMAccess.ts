import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface RankLLMAccess {
  canAccess: boolean;
  method: 'n8n' | 'rankllm' | 'both';
  loading: boolean;
  error: string | null;
}

export const useRankLLMAccess = (): RankLLMAccess => {
  const { user } = useAuth();
  const [access, setAccess] = useState<RankLLMAccess>({
    canAccess: false,
    method: 'n8n',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!user) {
      setAccess({
        canAccess: false,
        method: 'n8n',
        loading: false,
        error: null
      });
      return;
    }

    checkRankLLMAccess();
  }, [user]);

  const checkRankLLMAccess = async () => {
    try {
      setAccess(prev => ({ ...prev, loading: true, error: null }));

      // Call the database function to check access
      const { data, error } = await supabase.rpc('can_access_rankllm', {
        user_id: user?.id
      });

      if (error) {
        throw error;
      }

      // Get the analysis method
      const { data: methodData, error: methodError } = await supabase.rpc('get_user_analysis_method', {
        user_id: user?.id
      });

      if (methodError) {
        throw methodError;
      }

      setAccess({
        canAccess: data === true,
        method: methodData || 'n8n',
        loading: false,
        error: null
      });

      logger.info('RankLLM access checked', { 
        canAccess: data, 
        method: methodData,
        userId: user?.id 
      });

    } catch (err) {
      logger.error('Error checking RankLLM access', err);
      setAccess({
        canAccess: false,
        method: 'n8n',
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to check access'
      });
    }
  };

  return access;
};
