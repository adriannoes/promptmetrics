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

// Helper function to log errors to Pipefy
const reportErrorToPipefy = async (error: any, context: any) => {
  try {
    const pipefyWebhook = 'https://ipaas.pipefy.com/api/v1/webhooks/M9MMr5ClE4WJorSyUgaBD/sync';
    
    await fetch(pipefyWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Edge Function Error - receive-analysis`,
        description: `Error occurred in receive-analysis function: ${error.message}`,
        fields: {
          error_type: 'Edge Function Error',
          error_message: error.message,
          error_stack: error.stack || 'N/A',
          function_name: 'receive-analysis',
          timestamp: new Date().toISOString(),
          context: JSON.stringify(context),
          additional_info: JSON.stringify({
            user_agent: context.user_agent || 'N/A',
            method: context.method || 'N/A',
            url: context.url || 'N/A'
          })
        }
      })
    });
  } catch (reportError) {
    console.error('💥 Failed to report error to Pipefy:', reportError);
  }
};

serve(async (req) => {
  console.log('🎯 Receive-analysis called:', req.method, req.url);
  
  const requestContext = {
    method: req.method,
    url: req.url,
    user_agent: req.headers.get('user-agent') || 'unknown',
    timestamp: new Date().toISOString()
  };
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ CORS preflight handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      const error = new Error(`Method ${req.method} not allowed`);
      await reportErrorToPipefy(error, requestContext);
      
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    let payload;
    try {
      payload = await req.json();
      console.log('📥 Received raw payload:', JSON.stringify(payload, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON payload:', parseError);
      await reportErrorToPipefy(parseError, { ...requestContext, step: 'JSON parsing' });
      
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // n8n sends data as array, extract first item
    let analysisPayload = payload;
    if (Array.isArray(payload)) {
      console.log('📦 Payload is array, extracting first item...');
      analysisPayload = payload[0];
      console.log('📦 Extracted payload:', JSON.stringify(analysisPayload, null, 2));
    }

    // Validate required fields
    if (!analysisPayload || !analysisPayload.domain || !analysisPayload.analysis_data) {
      console.log('❌ Missing required fields in payload:', {
        domain: analysisPayload?.domain,
        analysis_data: !!analysisPayload?.analysis_data
      });
      
      const validationError = new Error('Missing required fields: domain, analysis_data');
      await reportErrorToPipefy(validationError, { 
        ...requestContext, 
        step: 'Payload validation',
        received_payload: analysisPayload
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: domain, analysis_data',
          received_fields: Object.keys(analysisPayload || {})
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    let supabase;
    try {
      supabase = createClient(
        // @ts-ignore - Deno global object
        Deno.env.get('SUPABASE_URL') ?? '',
        // @ts-ignore - Deno global object
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
    } catch (supabaseError) {
      console.error('❌ Failed to initialize Supabase client:', supabaseError);
      await reportErrorToPipefy(supabaseError, { ...requestContext, step: 'Supabase initialization' });
      
      return new Response(
        JSON.stringify({ error: 'Database connection failed' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
      await reportErrorToPipefy(error, { 
        ...requestContext, 
        step: 'Database operation',
        domain: analysisPayload.domain,
        operation: 'upsert analysis_results'
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save analysis', 
          details: error.message,
          code: error.code
        }), 
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
    
    // Report unexpected errors to Pipefy
    await reportErrorToPipefy(error, { ...requestContext, step: 'Unexpected error' });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});