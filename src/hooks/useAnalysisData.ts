import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

export const useAnalysisData = (domain?: string) => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (targetDomain: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: fetchError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', targetDomain)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analysis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain) {
      fetchAnalysis(domain);
    }
  }, [domain]);

  // Auto-refresh every 5 seconds when no data exists
  useEffect(() => {
    if (domain && !data && !loading) {
      const interval = setInterval(() => {
        fetchAnalysis(domain);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [domain, data, loading]);

  return {
    data,
    loading,
    error,
    refetch: (targetDomain: string) => fetchAnalysis(targetDomain)
  };
};