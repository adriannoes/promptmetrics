import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

export const useRealTimeAnalysis = () => {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching analyses:', error);
        return;
      }

      setRecentAnalyses(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentAnalyses();

    // Set up real-time subscription
    const channel = supabase
      .channel('all-analysis-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analysis_results'
        },
        (payload) => {
          console.log('Real-time analysis update:', payload);
          fetchRecentAnalyses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    recentAnalyses,
    loading,
    refetch: fetchRecentAnalyses
  };
};