import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CompleteAnalysisResult } from '@/types/analysis';

interface AnalysisResult {
  id: string;
  domain: string;
  status: 'processing' | 'completed' | 'failed' | string; // Allow string for flexibility
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface UseRealTimeAnalysisReturn {
  data: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date | null;
  refetch: (targetDomain: string) => Promise<void>;
  hasNewData: boolean;
  markAsRead: () => void;
}

export const useRealTimeAnalysis = (domain?: string): UseRealTimeAnalysisReturn => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasNewData, setHasNewData] = useState(false);
  
  // Refs para debouncing e gerenciamento de subscription
  const channelRef = useRef<RealtimeChannel | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);

  // Debounced update function
  const debouncedUpdate = useCallback((newData: AnalysisResult) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setData(newData);
      setLastUpdated(new Date());
      setHasNewData(true);
      console.log('🔄 Real-time: Data updated for domain:', newData.domain);
    }, 300); // 300ms debounce
  }, []);

  // Fetch analysis data
  const fetchAnalysis = useCallback(async (targetDomain: string, silent = false) => {
    // Evitar múltiplas chamadas muito próximas (rate limiting)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) { // 2 segundos mínimo
      return;
    }
    lastFetchTimeRef.current = now;

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      console.log('📊 useRealTimeAnalysis: Fetching analysis for domain:', targetDomain);
      
      // First try to get analysis for the specific domain
      let { data: result, error: fetchError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', targetDomain)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      // If no data found for specific domain, get the most recent analysis
      if (!result) {
        console.log('📊 useRealTimeAnalysis: No data for specific domain, fetching latest analysis');
        
        const { data: latestResult, error: latestError } = await supabase
          .from('analysis_results')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestError) {
          throw latestError;
        }

        result = latestResult;
        
        // Update localStorage with the found domain
        if (result) {
          console.log('📊 useRealTimeAnalysis: Found latest analysis for domain:', result.domain);
          localStorage.setItem('lastAnalyzedDomain', result.domain);
          
          // Update URL if we're not already on the correct domain
          if (window.location.pathname === '/my-rank') {
            window.history.replaceState({}, '', `/my-rank?domain=${encodeURIComponent(result.domain)}`);
          }
        }
      }

      if (result) {
        setData(result);
        setLastUpdated(new Date());
        console.log('📊 Fetched analysis data for:', result.domain);
      } else {
        setData(null);
        console.log('📭 No analysis data found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analysis';
      setError(errorMessage);
      console.error('❌ Error fetching analysis:', err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  // Setup Real-time subscription
  const setupRealTimeSubscription = useCallback((targetDomain: string) => {
    // Cleanup existing subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    console.log('🔌 Setting up Real-time subscription for:', targetDomain);

    const channel = supabase
      .channel(`analysis_results:${targetDomain}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analysis_results',
          filter: `domain=eq.${targetDomain}`,
        },
        (payload) => {
          console.log('🔔 Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newData = payload.new as AnalysisResult;
            debouncedUpdate(newData);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
  }, [debouncedUpdate]);

  // Setup optimized polling as fallback
  const setupPolling = useCallback((targetDomain: string) => {
    // Clear existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Only poll if not connected to real-time or no data yet
    if (!isConnected || !data) {
      const interval = setInterval(() => {
        // Polling otimizado: 
        // - 10s se não conectado ao real-time
        // - 30s se conectado mas sem dados ainda
        // - Para de polling se tem dados e está conectado
        if (!isConnected || !data) {
          fetchAnalysis(targetDomain, true); // silent fetch
        }
      }, isConnected ? 30000 : 10000);

      pollingIntervalRef.current = interval;
      console.log(`⏰ Polling setup: ${isConnected ? '30s' : '10s'} interval`);
    }
  }, [isConnected, data, fetchAnalysis]);

  // Main effect for domain changes
  useEffect(() => {
    if (!domain) return;

    console.log('🎯 useRealTimeAnalysis: Setting up for domain:', domain);
    
    // Initial fetch
    fetchAnalysis(domain);
    
    // Setup real-time subscription
    setupRealTimeSubscription(domain);
    
    // Setup polling fallback
    setupPolling(domain);

    return () => {
      // Cleanup
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [domain, fetchAnalysis, setupRealTimeSubscription, setupPolling]);

  // Update polling when connection status changes
  useEffect(() => {
    if (domain) {
      setupPolling(domain);
    }
  }, [isConnected, data, domain, setupPolling]);

  // Mark new data as read
  const markAsRead = useCallback(() => {
    setHasNewData(false);
  }, []);

  return {
    data,
    loading,
    error,
    isConnected,
    lastUpdated,
    refetch: fetchAnalysis,
    hasNewData,
    markAsRead,
  };
};