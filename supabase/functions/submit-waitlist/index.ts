
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Waitlist submission handler called');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
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
    console.log('Webhook URL:', webhookUrl);

    // Submit to webhook with timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log('Sending request to webhook...');
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
      console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()));

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook request failed with status ${webhookResponse.status}: ${errorText}`);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Successfully added to waitlist' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Webhook request timed out');
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error('Error in waitlist submission:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit to waitlist', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
