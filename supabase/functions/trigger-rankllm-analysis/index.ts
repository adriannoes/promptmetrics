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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

serve(async (req) => {
  console.log('🎯 Trigger-rankllm-analysis called:', req.method, req.url);
  
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

    const { domain, query, documents, model = 'monot5', top_k } = await req.json();
    console.log('📥 Received RankLLM request:', { domain, query, documents: documents?.length, model });

    // Validate required fields
    if (!domain || !query || !documents || !Array.isArray(documents)) {
      console.log('❌ Missing required fields');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: domain, query, documents' 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate documents structure
    for (const doc of documents) {
      if (!doc.id || !doc.content) {
        return new Response(
          JSON.stringify({ 
            error: 'Each document must have id and content fields' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Get RankLLM service URL from environment
    const rankllmServiceUrl = Deno.env.get('RANKLLM_SERVICE_URL');
    if (!rankllmServiceUrl) {
      console.log('❌ RankLLM service URL not configured');
      return new Response(
        JSON.stringify({ error: 'RankLLM service not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🚀 Calling RankLLM service:', rankllmServiceUrl);

    // Call RankLLM service
    const rankllmResponse = await fetch(`${rankllmServiceUrl}/rerank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        documents,
        model,
        top_k,
        domain
      })
    });

    if (!rankllmResponse.ok) {
      const errorText = await rankllmResponse.text();
      console.error('💥 RankLLM service error:', rankllmResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'RankLLM service error', 
          details: errorText 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const rankllmResult = await rankllmResponse.json();
    console.log('✅ RankLLM service response received');

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('💾 Saving RankLLM results to database...');

    // Save results to rankllm_results table
    const { data, error } = await supabase
      .from('rankllm_results')
      .insert({
        domain,
        query,
        model_used: model,
        ranking_data: rankllmResult.ranking_data,
        status: 'completed'
      })
      .select()
      .single();

    if (error) {
      console.error('💥 Database error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save RankLLM results', 
          details: error 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ RankLLM results saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        message: 'RankLLM analysis completed and saved',
        result: rankllmResult
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Error processing RankLLM request:', error);
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
