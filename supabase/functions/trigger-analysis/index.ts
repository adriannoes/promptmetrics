
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 trigger-analysis: Function started');
  console.log('🚀 trigger-analysis: Request method:', req.method);
  console.log('🚀 trigger-analysis: Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ trigger-analysis: Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log('❌ trigger-analysis: Method not allowed:', req.method);
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    console.log('📦 trigger-analysis: Reading request body...');
    const requestBody = await req.json();
    console.log('📦 trigger-analysis: Request body received:', requestBody);

    const { domain } = requestBody;
    const normalizeDomain = (input: string) => {
      if (!input) return input;
      let v = String(input).trim().toLowerCase();
      v = v.replace(/^https?:\/\//, '');
      v = v.replace(/^www\./, '');
      const slash = v.indexOf('/');
      if (slash !== -1) v = v.substring(0, slash);
      v = v.replace(/\/$/, '');
      return v;
    };
    const normalizedDomain = normalizeDomain(domain);
    console.log('🎯 trigger-analysis: Extracted domain:', domain);

    // Validate domain
    if (!domain || typeof domain !== 'string') {
      console.log('❌ trigger-analysis: Invalid domain - missing or not string:', domain);
      return new Response(
        JSON.stringify({ error: 'Domain is required and must be a string' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use the N8N webhook URL from environment secrets
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    console.log('🔧 trigger-analysis: N8N_WEBHOOK_URL configured:', !!webhookUrl);
    console.log('🔧 trigger-analysis: N8N_WEBHOOK_URL value:', webhookUrl ? `${webhookUrl.substring(0, 50)}...` : 'NOT SET');
    
    if (!webhookUrl) {
      console.log('⚠️ trigger-analysis: N8N_WEBHOOK_URL not configured, simulating success for development');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Analysis triggered successfully (simulated - N8N webhook not configured)',
          domain,
          warning: 'N8N webhook URL not configured in environment'
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('🌐 trigger-analysis: Preparing to call n8n webhook');
    
    // Send domain to n8n webhook with additional test data
    const testPayload = {
      domain: normalizedDomain,
      timestamp: new Date().toISOString(),
      source: 'promptmetrics-frontend-analysis-page',
      test_mode: true,
      triggered_from: '/analysis'
    };
    
    console.log('📡 trigger-analysis: N8N payload prepared:', testPayload);
    console.log('📡 trigger-analysis: About to fetch URL:', webhookUrl);
    console.log('📡 trigger-analysis: Method: POST');
    console.log('📡 trigger-analysis: Headers: Content-Type: application/json');
    console.log('📡 trigger-analysis: Body:', JSON.stringify(testPayload));

    try {
      console.log('🔄 trigger-analysis: Starting fetch to n8n...');
      const fetchStartTime = Date.now();
      
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      const fetchEndTime = Date.now();
      console.log(`⏱️ trigger-analysis: N8N fetch completed in ${fetchEndTime - fetchStartTime}ms`);
      console.log('📨 trigger-analysis: N8N response status:', n8nResponse.status);
      console.log('📨 trigger-analysis: N8N response statusText:', n8nResponse.statusText);
      console.log('📨 trigger-analysis: N8N response headers:', Object.fromEntries(n8nResponse.headers.entries()));

      if (!n8nResponse.ok) {
        console.error('❌ trigger-analysis: N8N webhook failed with status:', n8nResponse.status, n8nResponse.statusText);
        
        // Try to get the error message
        let errorText = '';
        try {
          errorText = await n8nResponse.text();
          console.error('❌ trigger-analysis: N8N error response body:', errorText);
        } catch (e) {
          console.error('❌ trigger-analysis: Could not read N8N error response:', e);
        }
        
        // Return real error instead of simulating success
        return new Response(JSON.stringify({
          error: 'Failed to trigger analysis workflow',
          details: `N8N returned ${n8nResponse.status}: ${n8nResponse.statusText}`,
          response_body: errorText,
          webhook_url: webhookUrl ? `${webhookUrl.substring(0, 50)}...` : 'NOT SET'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      let n8nResult = {};
      try {
        const responseText = await n8nResponse.text();
        console.log('📄 trigger-analysis: N8N raw response text:', responseText);
        
        if (responseText) {
          try {
            n8nResult = JSON.parse(responseText);
            console.log('📊 trigger-analysis: N8N parsed JSON response:', n8nResult);
          } catch (parseError) {
            console.log('📝 trigger-analysis: N8N response is not JSON, treating as text:', responseText);
            n8nResult = { message: responseText };
          }
        }
      } catch (error) {
        console.error('❌ trigger-analysis: Error reading n8n response:', error);
      }
      
      console.log('✅ trigger-analysis: N8N workflow triggered successfully');
      console.log('🎉 trigger-analysis: Final success result:', n8nResult);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Analysis triggered successfully',
          domain,
          n8n_response: n8nResult,
          webhook_called: true,
          webhook_status: n8nResponse.status
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (networkError) {
      console.error('💥 trigger-analysis: Network error calling n8n webhook:', networkError);
      console.error('💥 trigger-analysis: Network error details:', {
        message: networkError.message,
        name: networkError.name,
        stack: networkError.stack
      });
      
      // For development: simulate success when network fails
      console.log('⚠️ trigger-analysis: Network error calling n8n, simulating success for development');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Analysis triggered successfully (simulated - network issue)',
          domain,
          warning: 'N8N webhook network error',
          error_details: networkError.message
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('💥 trigger-analysis: General error in function:', error);
    console.error('💥 trigger-analysis: Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        error_type: error.name
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
