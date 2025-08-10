
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractDomain } from '@/utils/domain';
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

// Helper function to create a timeout promise
const createTimeoutPromise = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Query timeout after ${ms}ms`)), ms);
  });
};

// Helper function to add retry logic
const retryQuery = async (queryFn: () => Promise<any>, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Query attempt ${attempt}/${maxRetries}`);
      const startTime = Date.now();
      
      // Race between the query and timeout
      const result = await Promise.race([
        queryFn(),
        createTimeoutPromise(10000) // 10 second timeout
      ]);
      
      const endTime = Date.now();
      console.log(`✅ Query completed in ${endTime - startTime}ms`);
      
      return result;
    } catch (error) {
      console.error(`❌ Query attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error; // Last attempt, throw the error
      }
      
      // Wait before retrying (exponential backoff)
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

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
      console.log('🔄 Real-time: About to update data:', newData);
      setData(newData);
      setLastUpdated(new Date());
      setHasNewData(true);
      console.log('🔄 Real-time: Data updated successfully for domain:', newData.domain);
    }, 300); // 300ms debounce
  }, []);

  // Fetch analysis data with retry logic and timeout
  const fetchAnalysis = useCallback(async (targetDomain: string, silent = false) => {
    const normalizedDomain = extractDomain(targetDomain);
    // Evitar múltiplas chamadas muito próximas (rate limiting)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) { // 2 segundos mínimo
      console.log('🚫 Rate limited - skipping fetch');
      return;
    }
    lastFetchTimeRef.current = now;

    if (!silent) {
      console.log('🔄 Setting loading to TRUE');
      setLoading(true);
    }
    setError(null);

    try {
      console.log('📊 useRealTimeAnalysis: Fetching analysis for domain:', normalizedDomain);
      
      // Create the query function for retry logic
      const queryFunction = async () => {
        console.log('📊 useRealTimeAnalysis: About to query Supabase...');
        
        // Try specific domain first
         const specificQuery = supabase
          .from('analysis_results')
          .select('*')
           .eq('domain', normalizedDomain)
          .order('updated_at', { ascending: false })
          .limit(1);

        console.log('📊 useRealTimeAnalysis: Executing specific domain query...');
        const { data: result, error: fetchError } = await specificQuery.maybeSingle();
        
        console.log('📊 useRealTimeAnalysis: Specific query completed');
        console.log('📊 useRealTimeAnalysis: Query result:', { result, fetchError });

        if (fetchError) {
          console.error('❌ Supabase specific query error:', fetchError);
          throw fetchError;
        }

        // If no data found for specific domain, get latest analysis
        if (!result) {
          console.log('📊 useRealTimeAnalysis: No data for specific domain, fetching latest analysis');
          
          const latestQuery = supabase
            .from('analysis_results')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1);

          console.log('📊 useRealTimeAnalysis: Executing latest query...');
          const { data: latestResult, error: latestError } = await latestQuery.maybeSingle();
          
          console.log('📊 useRealTimeAnalysis: Latest query completed');
          console.log('📊 Latest result fallback:', latestResult);

          if (latestError) {
            console.error('❌ Supabase latest query error:', latestError);
            throw latestError;
          }

          return latestResult;
        }

        return result;
      };

      // Execute query with retry logic
      const result = await retryQuery(queryFunction);

      if (result) {
        console.log('✅ Setting data in useRealTimeAnalysis:', {
          domain: result.domain,
          status: result.status,
          hasAnalysisData: !!result.analysis_data,
          analysisDataType: typeof result.analysis_data,
          analysisDataKeys: result.analysis_data && typeof result.analysis_data === 'object' ? Object.keys(result.analysis_data) : 'not an object'
        });
        
        setData(result);
        setLastUpdated(new Date());
        console.log('📊 Data successfully set - should trigger re-render');
        
        // Update localStorage and URL if we found a different domain
        if (result.domain !== normalizedDomain) {
          console.log('📊 useRealTimeAnalysis: Found analysis for domain:', result.domain);
          localStorage.setItem('lastAnalyzedDomain', result.domain);
          
          // Update URL if we're not already on the correct domain
          if (window.location.pathname === '/my-rank') {
            window.history.replaceState({}, '', `/my-rank?domain=${encodeURIComponent(result.domain)}`);
          }
        }
      } else {
        console.log('📭 No analysis data found - setting data to null');
        setData(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analysis';
      console.error('❌ Error in fetchAnalysis:', err);
      setError(errorMessage);
    } finally {
      if (!silent) {
        console.log('🔄 Setting loading to FALSE');
        setLoading(false);
      }
    }
  }, []);

  // Setup Real-time subscription
  const setupRealTimeSubscription = useCallback((targetDomain: string) => {
    const normalizedDomain = extractDomain(targetDomain);
    // Cleanup existing subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    console.log('🔌 Setting up Real-time subscription for:', normalizedDomain);

    const channel = supabase
      .channel(`analysis_results:${normalizedDomain}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analysis_results',
          filter: `domain=eq.${normalizedDomain}`,
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
          console.log('⏰ Polling fetch triggered');
          fetchAnalysis(targetDomain, true); // silent fetch
        }
      }, isConnected ? 30000 : 10000);

      pollingIntervalRef.current = interval;
      console.log(`⏰ Polling setup: ${isConnected ? '30s' : '10s'} interval`);
    }
  }, [isConnected, data, fetchAnalysis]);

  // Main effect for domain changes
  useEffect(() => {
    if (!domain) {
      console.log('⚠️ No domain provided to useRealTimeAnalysis');
      return;
    }

    console.log('🎯 useRealTimeAnalysis: Setting up for domain:', domain);
    
    // Initial fetch
    fetchAnalysis(domain);
    
    // Setup real-time subscription
    setupRealTimeSubscription(domain);

    return () => {
      console.log('🧹 Cleaning up useRealTimeAnalysis');
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
  }, [domain]); // Removed circular dependencies

  // Separate effect for polling that doesn't cause loops
  useEffect(() => {
    if (!domain) return;
    
    // Setup polling after initial mount and when connection status changes
    const timeoutId = setTimeout(() => {
      setupPolling(domain);
    }, 100); // Small delay to avoid immediate conflicts

    return () => {
      clearTimeout(timeoutId);
    };
  }, [domain, isConnected]); // Only depend on domain and connection status

  // Mark new data as read
  const markAsRead = useCallback(() => {
    setHasNewData(false);
  }, []);

  // Debug log current state
  useEffect(() => {
    console.log('🔍 useRealTimeAnalysis state update:', {
      domain,
      hasData: !!data,
      loading,
      error,
      isConnected,
      dataId: data?.id,
      dataDomain: data?.domain,
      dataStatus: data?.status
    });
  }, [domain, data, loading, error, isConnected]);

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
