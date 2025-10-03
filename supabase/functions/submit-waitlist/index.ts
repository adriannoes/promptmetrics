
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Waitlist submission handler called');

  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  try {
    const webhookUrl = Deno.env.get('WAITLIST_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('WAITLIST_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const formData: WaitlistFormData = await req.json();
    console.log('Form data received:', { name: formData.name, email: formData.email });

    // Submit to webhook with timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Webhook response status:', webhookResponse.status);

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook request failed with status ${webhookResponse.status}: ${errorText}`);
      }

      // Parse the response from Pipefy
      const webhookResult = await webhookResponse.json();
      console.log('Webhook response:', webhookResult);

      // Check if Pipefy response indicates success
      if (webhookResult.status === 'received') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: webhookResult.message || 'Successfully added to waitlist' 
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      } else {
        throw new Error(webhookResult.message || 'Unexpected response from webhook');
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Webhook request timed out');
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error('Error in waitlist submission:', error);
    
    // Check if it's a webhook-specific error
    if (error.message.includes('Webhook request failed')) {
      return new Response(
        JSON.stringify({ 
          error: 'Waitlist service temporarily unavailable. Your information was received but processing failed. Please try again later or contact support.',
          details: 'Webhook service error'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit to waitlist. Please try again later.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
