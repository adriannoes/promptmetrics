import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://promptmetrics.vercel.app',
    'https://promptmetrics.com'
  ];

  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

serve(async (req) => {
  console.log('📊 Get-rankllm-data called:', req.method, req.url);
  
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ CORS preflight handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const { domain, limit = 10 } = await req.json();
    console.log('🔍 Fetching RankLLM data for domain:', domain);

    // Validate domain
    if (!domain || typeof domain !== 'string') {
      console.log('❌ Invalid domain provided');
      return new Response(
        JSON.stringify({ error: 'Domain is required and must be a string' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with service role for bypassing RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔎 Searching for RankLLM data in database...');

    // Get the most recent RankLLM results for the domain
    const { data, error } = await supabase
      .from('rankllm_results')
      .select('*')
      .eq('domain', domain)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('💥 Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch RankLLM data', details: error }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!data || data.length === 0) {
      console.log('📭 No RankLLM data found for domain:', domain);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No RankLLM analysis data found for this domain',
          data: null 
        }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ RankLLM data found:', data.length, 'results');

    // Format the data for frontend consumption
    const formattedData = data.map(result => ({
      id: result.id,
      domain: result.domain,
      query: result.query,
      model_used: result.model_used,
      ranking_data: result.ranking_data,
      status: result.status,
      created_at: result.created_at,
      updated_at: result.updated_at,
      // Extract summary metrics
      summary: {
        total_documents: result.ranking_data?.candidates?.length || 0,
        top_score: result.ranking_data?.candidates?.[0]?.score || 0,
        processing_time: result.ranking_data?.metrics?.processing_time_ms || 0,
        model_performance: result.ranking_data?.metrics || {}
      }
    }));

    // Calculate aggregate metrics
    const aggregateMetrics = {
      total_analyses: data.length,
      models_used: [...new Set(data.map(r => r.model_used))],
      average_processing_time: data.reduce((acc, r) => 
        acc + (r.ranking_data?.metrics?.processing_time_ms || 0), 0) / data.length,
      latest_analysis: data[0]?.created_at,
      success_rate: data.filter(r => r.status === 'completed').length / data.length
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formattedData,
        metrics: aggregateMetrics,
        message: `Found ${data.length} RankLLM analysis results`
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Error fetching RankLLM data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: errorMessage 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
