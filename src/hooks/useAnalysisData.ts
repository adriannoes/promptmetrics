
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisDataStructure } from '@/types/analysis';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: AnalysisDataStructure;
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
      console.log('📊 useAnalysisData: Fetching analysis for domain:', targetDomain);
      
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

      console.log('📊 useAnalysisData: Raw result from Supabase:', result);

      if (result) {
        const analysisData = result.analysis_data as unknown as AnalysisDataStructure;
        console.log('📊 useAnalysisData: Analysis data structure:', {
          domain: result.domain,
          status: result.status,
          hasAnalysisData: !!result.analysis_data,
          analysisDataKeys: result.analysis_data && typeof result.analysis_data === 'object' ? Object.keys(result.analysis_data) : [],
          sentiment_trends: analysisData?.sentiment_trends?.length || 0,
          competitor_analysis: !!analysisData?.competitor_analysis,
          prompt_analysis: !!analysisData?.prompt_analysis
        });
      }

      setData(result ? { ...result, analysis_data: result.analysis_data as unknown as AnalysisDataStructure } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analysis';
      setError(errorMessage);
      console.error('❌ useAnalysisData: Error fetching analysis:', err);
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
