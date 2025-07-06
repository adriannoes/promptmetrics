// Edge Function for Supabase - Runs on Deno runtime
// TypeScript errors below are expected as this runs in Deno, not Node.js

// @ts-ignore - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno runtime imports  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🎯 Receive-analysis called:', req.method, req.url);
  
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

    const payload = await req.json();
    console.log('📥 Received raw payload:', JSON.stringify(payload, null, 2));

    // n8n sends data as array, extract first item
    let analysisPayload = payload;
    if (Array.isArray(payload)) {
      console.log('📦 Payload is array, extracting first item...');
      analysisPayload = payload[0];
      console.log('📦 Extracted payload:', JSON.stringify(analysisPayload, null, 2));
    }

    // Validate required fields
    if (!analysisPayload.domain || !analysisPayload.analysis_data) {
      console.log('❌ Missing required fields in payload:', {
        domain: analysisPayload.domain,
        analysis_data: !!analysisPayload.analysis_data
      });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: domain, analysis_data' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      // @ts-ignore - Deno global object
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore - Deno global object
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('💾 Attempting to save to database...');
    console.log('💾 Data structure:', {
      domain: analysisPayload.domain,
      status: analysisPayload.status || 'completed',
      analysis_data_keys: Object.keys(analysisPayload.analysis_data || {})
    });

    // Insert or update analysis result
    const { data, error } = await supabase
      .from('analysis_results')
      .upsert({
        domain: analysisPayload.domain,
        status: analysisPayload.status || 'completed',
        analysis_data: analysisPayload.analysis_data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'domain',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('💥 Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis', details: error }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Analysis saved successfully:', {
      id: data.id,
      domain: data.domain,
      status: data.status,
      analysis_data_keys: Object.keys(data.analysis_data || {})
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id, 
        domain: data.domain,
        message: 'Analysis received and saved successfully' 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});