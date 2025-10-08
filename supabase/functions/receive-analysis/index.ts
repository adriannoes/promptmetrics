import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getAllowedOrigins, getCorsHeaders } from './cors-helpers.ts';

serve(async (req) => {
  console.log('🎯 Receive-analysis called:', req.method, req.url);
  
  const env = Deno.env.get('ENVIRONMENT') || null;
  const allowedOrigins = getAllowedOrigins(env);
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin, allowedOrigins);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ CORS preflight handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Webhook authentication - validate secret
    const webhookSecret = Deno.env.get('N8N_WEBHOOK_SECRET');
    const receivedSecret = req.headers.get('X-Webhook-Secret');

    if (!webhookSecret || receivedSecret !== webhookSecret) {
      console.log('❌ Unauthorized webhook call - invalid or missing secret');
      return new Response(JSON.stringify({ error: 'Unauthorized webhook call' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log('✅ Webhook authenticated successfully');

    const payload = await req.json();
    console.log('📥 Received analysis payload:', JSON.stringify(payload, null, 2));

    // Validate required fields
    if (!payload.domain || !payload.analysis_data) {
      console.log('❌ Missing required fields');
      return new Response(JSON.stringify({ error: 'Missing required fields: domain, analysis_data' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('💾 Attempting to save to database...');

    // Insert or update analysis result
    const { data, error } = await supabase
      .from('analysis_results')
      .upsert({
        domain: payload.domain,
        status: payload.status || 'completed',
        analysis_data: payload.analysis_data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'domain',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('💥 Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save analysis', details: error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log('✅ Analysis saved successfully:', data);

    return new Response(JSON.stringify({ success: true, id: data.id, message: 'Analysis received and saved' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('💥 Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal server error', details: errorMessage }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});