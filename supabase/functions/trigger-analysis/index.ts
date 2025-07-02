import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Get the n8n webhook URL from environment
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Send domain to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain })
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

    const n8nResult = await n8nResponse.json().catch(() => ({}));
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