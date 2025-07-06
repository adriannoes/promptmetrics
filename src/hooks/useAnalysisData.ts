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
    console.log('🔍 useAnalysisData: Fetching analysis for domain:', targetDomain);
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

      console.log('📊 useAnalysisData: Query result:', { result, fetchError });

      if (fetchError) {
        throw fetchError;
      }

      setData(result);
      console.log('✅ useAnalysisData: Data set successfully:', result);
    } catch (err) {
      console.error('❌ useAnalysisData: Error fetching analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain) {
      console.log('🚀 useAnalysisData: useEffect triggered for domain:', domain);
      fetchAnalysis(domain);
    }
  }, [domain]);

  // Auto-refresh every 5 seconds when loading to check for new data
  useEffect(() => {
    if (domain && !data) {
      console.log('🔄 useAnalysisData: Setting up auto-refresh for domain:', domain);
      const interval = setInterval(() => {
        fetchAnalysis(domain);
      }, 5000);

      return () => {
        console.log('🛑 useAnalysisData: Clearing auto-refresh interval');
        clearInterval(interval);
      };
    }
  }, [domain, data]);

  return {
    data,
    loading,
    error,
    refetch: (targetDomain: string) => fetchAnalysis(targetDomain)
  };
};