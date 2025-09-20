import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting para prevenir abuso
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests por minuto

// Validação de domínio mais rigorosa
const isValidDomain = (domain: string): boolean => {
  // Regex para validar domínio
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!domainRegex.test(domain)) {
    return false;
  }
  
  // Verificar tamanho máximo
  if (domain.length > 253) {
    return false;
  }
  
  // Verificar se não contém caracteres perigosos
  if (domain.includes('..') || domain.includes('--')) {
    return false;
  }
  
  return true;
};

// Rate limiting
const checkRateLimit = (clientId: string): boolean => {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId);
  
  if (!clientData) {
    rateLimitMap.set(clientId, { count: 1, lastReset: now });
    return true;
  }
  
  // Reset se passou a janela de tempo
  if (now - clientData.lastReset > RATE_LIMIT_WINDOW) {
    clientData.count = 1;
    clientData.lastReset = now;
    return true;
  }
  
  // Verificar se excedeu o limite
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  clientData.count++;
  return true;
};

// Limpeza periódica do rate limit
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.lastReset > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW * 2);

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

    // Rate limiting
    const clientId = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { domain } = await req.json();
    
    // Validação rigorosa do domínio
    if (!domain || typeof domain !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Domain is required and must be a string' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validação adicional do domínio
    if (!isValidDomain(domain)) {
      return new Response(
        JSON.stringify({ error: 'Invalid domain format' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use the N8N webhook URL from environment secrets
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('N8N webhook URL not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }), 
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Log apenas em desenvolvimento
    if (Deno.env.get('ENVIRONMENT') === 'development') {
      console.log('Triggering analysis for domain:', domain);
    }
    
    // Send domain to n8n webhook with additional test data
    const testPayload = {
      domain: domain,
      timestamp: new Date().toISOString(),
      source: 'promptmetrics-frontend',
      test_mode: true
    };

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
      
      if (responseText) {
        try {
          n8nResult = JSON.parse(responseText);
        } catch (parseError) {
          // Log apenas em desenvolvimento
          if (Deno.env.get('ENVIRONMENT') === 'development') {
            console.log('N8N response is not JSON, treating as text:', responseText);
          }
          n8nResult = { message: responseText };
        }
      }
    } catch (error) {
      console.error('Error reading n8n response:', error);
    }
    
    // Log apenas em desenvolvimento
    if (Deno.env.get('ENVIRONMENT') === 'development') {
      console.log('N8N workflow triggered successfully:', n8nResult);
    }

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
