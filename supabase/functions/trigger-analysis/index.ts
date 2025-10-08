import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const { domain } = await req.json();
    console.log('Triggering analysis for domain:', domain);

    // Validate domain
    if (!domain || typeof domain !== 'string') {
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
    
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'N8N webhook URL not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Triggering n8n webhook with URL:', webhookUrl);
    
    // Send domain to n8n webhook with additional test data
    const testPayload = {
      domain: domain,
      timestamp: new Date().toISOString(),
      source: 'promptmetrics-frontend',
      test_mode: true
    };
    
    console.log('Sending test payload to n8n:', testPayload);

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    if (!n8nResponse.ok) {
      console.error('Failed to trigger n8n workflow:', n8nResponse.status, n8nResponse.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to trigger analysis workflow' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let n8nResult = {};
    try {
      const responseText = await n8nResponse.text();
      console.log('N8N raw response:', responseText);
      
      if (responseText) {
        try {
          n8nResult = JSON.parse(responseText);
        } catch (_parseError) {
          console.log('N8N response is not JSON, treating as text:', responseText);
          n8nResult = { message: responseText };
        }
      }
    } catch (error) {
      console.error('Error reading n8n response:', error);
    }
    
    console.log('N8N workflow triggered successfully:', n8nResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Analysis triggered successfully',
        domain 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error triggering analysis:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});