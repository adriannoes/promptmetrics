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
      console.error('Error fetching analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain) {
      fetchAnalysis(domain);
    }
  }, [domain]);

  return {
    data,
    loading,
    error,
    refetch: (targetDomain: string) => fetchAnalysis(targetDomain)
  };
};