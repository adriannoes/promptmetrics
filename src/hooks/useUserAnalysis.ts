import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisData {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

export const useUserAnalysis = () => {
  const { profile } = useAuth();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysisData = async (domain: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching analysis data for domain:', domain);

      const { data, error: fetchError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', domain)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching analysis data:', fetchError);
        setError('Failed to fetch analysis data');
        return;
      }

      if (!data) {
        console.log('No analysis data found for domain:', domain);
        setAnalysisData(null);
        return;
      }

      console.log('Analysis data found:', data);
      setAnalysisData(data);
    } catch (err) {
      console.error('Analysis fetch exception:', err);
      setError('Failed to fetch analysis data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user has a domain
    const domain = profile?.organizations?.website_url;
    
    if (domain && profile?.role !== 'admin') {
      // Extract domain from URL if it contains protocol
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
      fetchAnalysisData(cleanDomain);
    } else if (!domain && profile?.role !== 'admin') {
      // User has no domain
      console.log('User has no domain configured');
      setAnalysisData(null);
      setLoading(false);
    }
  }, [profile]);

  const triggerNewAnalysis = async () => {
    const domain = profile?.organizations?.website_url;
    if (!domain) return;

    try {
      setLoading(true);
      
      // Call trigger-analysis edge function
      const response = await fetch('/functions/v1/trigger-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ 
          domain: domain.replace(/^https?:\/\//, '').replace(/^www\./, '') 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger analysis');
      }

      console.log('Analysis triggered successfully');
      // Optionally refresh data after a delay
      setTimeout(() => {
        if (domain) {
          fetchAnalysisData(domain.replace(/^https?:\/\//, '').replace(/^www\./, ''));
        }
      }, 5000);
      
    } catch (err) {
      console.error('Error triggering analysis:', err);
      setError('Failed to trigger new analysis');
    }
  };

  return {
    analysisData,
    loading,
    error,
    triggerNewAnalysis,
    hasData: !!analysisData,
    userDomain: profile?.organizations?.website_url
  };
}; 