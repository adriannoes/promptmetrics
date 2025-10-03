import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Allowed origins for CORS
const getAllowedOrigins = () => {
  const origins = [
    'https://f7f9381f-ef1d-491b-bfc3-dadb313a13c9.lovableproject.com',
    // Add production domain when available
  ];
  
  // Add localhost only in development
  if (Deno.env.get('ENVIRONMENT') !== 'production') {
    origins.push('http://localhost:5173');
  }
  
  return origins;
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = origin && allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

serve(async (req) => {
  console.log('📊 Get-analysis-data called:', req.method, req.url);
  
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

    const { domain } = await req.json();
    console.log('🔍 Fetching analysis data for domain:', domain);

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

    console.log('🔎 Searching for analysis data in database...');

    // Get the most recent analysis for the domain
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('domain', domain)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('💥 Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch analysis data', details: error }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!data) {
      console.log('📭 No analysis found for domain:', domain);
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: null, 
          message: 'No analysis found for this domain' 
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Analysis data found:', data.id);

    // Parse analysis_data if it's a string
    let analysisData = data.analysis_data;
    if (typeof analysisData === 'string') {
      try {
        analysisData = JSON.parse(analysisData);
      } catch (parseError) {
        console.error('⚠️ Failed to parse analysis_data:', parseError);
        // Continue with the raw string if parsing fails
      }
    }

    // Enhance the response with computed fields
    const enhancedData = {
      ...data,
      analysis_data: analysisData,
      // Add computed fields for easy access
      has_complete_data: !!(
        analysisData?.sentiment_trends && 
        analysisData?.ranking_data && 
        analysisData?.competitor_analysis
      ),
      last_updated: data.updated_at,
      analysis_age_hours: Math.floor(
        (new Date().getTime() - new Date(data.updated_at).getTime()) / (1000 * 60 * 60)
      )
    };

    console.log('📤 Returning enhanced analysis data');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: enhancedData,
        message: 'Analysis data retrieved successfully'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Error processing request:', error);
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