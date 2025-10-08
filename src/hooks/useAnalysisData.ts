import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
  has_complete_data?: boolean;
  last_updated?: string;
  analysis_age_hours?: number;
}

export const useAnalysisData = (domain?: string) => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchAnalysis = useCallback(async (targetDomain: string) => {
    if (!targetDomain.trim()) {
      logger.debug('Skipping fetch - empty domain');
      setError('Domínio não fornecido');
      setLoading(false);
      return;
    }

    logger.api(`Fetching analysis for domain via edge function: ${targetDomain}`);
    setLoading(true);
    setError(null);

    // Add timeout for the request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: A análise está demorando mais que o esperado')), 30000);
    });

    try {
      // Use the new get-analysis-data edge function with timeout
      const fetchPromise = supabase.functions.invoke('get-analysis-data', {
        body: { domain: targetDomain }
      });

      const { data: result, error: fetchError } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      logger.debug('Edge function result received', { result: !!result, hasError: !!fetchError });

      if (fetchError) {
        if (fetchError.message?.includes('Timeout')) {
          throw new Error('A análise está demorando mais que o esperado. Tente novamente em alguns minutos.');
        }
        throw fetchError;
      }

      if (result?.success) {
        setData(result.data);
        logger.debug('Data set successfully from edge function', { dataId: result.data?.id || 'no-data' });
      } else {
        const errorMessage = result?.error || 'Erro desconhecido na busca de dados';
        throw new Error(errorMessage);
      }
    } catch (err) {
      logger.error('Error fetching analysis via edge function', err);

      let errorMessage = 'Falha ao buscar dados de análise';

      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (err.message.includes('Timeout')) {
          errorMessage = err.message;
        } else if (err.message.includes('não encontrado')) {
          errorMessage = 'Domínio não encontrado ou não possui dados de análise.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []); // Remove isRefreshing dependency to avoid loops

  // Debounced fetch when domain changes
  useEffect(() => {
    if (domain && domain.trim()) {
      logger.debug('useEffect triggered for domain', { domain });
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce the fetch to avoid rapid calls
      timeoutRef.current = setTimeout(() => {
        fetchAnalysis(domain);
      }, 300);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else if (!domain) {
      // Clear data when domain is empty
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, [domain, fetchAnalysis]);

  // Controlled auto-refresh only when no data exists and not currently loading
  useEffect(() => {
    if (domain && !data && !loading) {
      logger.debug('Setting up controlled auto-refresh for domain', { domain });
      
      const interval = setInterval(() => {
        // Only fetch if still no data and not loading
        if (!data && !loading) {
          logger.debug('Auto-refresh tick for domain', { domain });
          fetchAnalysis(domain);
        }
      }, 15000); // Increased to 15 seconds to be less aggressive

      return () => {
        logger.debug('Clearing auto-refresh interval');
        clearInterval(interval);
      };
    }
  }, [domain, data, loading, fetchAnalysis]);

  const refetch = useCallback((targetDomain: string) => {
    setIsRefreshing(true);
    return fetchAnalysis(targetDomain).finally(() => {
      setIsRefreshing(false);
    });
  }, [fetchAnalysis]);

  return {
    data,
    loading,
    error,
    isRefreshing,
    refetch
  };
};