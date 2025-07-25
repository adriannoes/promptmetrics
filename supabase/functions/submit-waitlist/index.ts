
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
  console.log('=== WAITLIST SUBMISSION HANDLER CALLED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('=== HANDLING CORS PREFLIGHT REQUEST ===');
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      } 
    });
  }

  if (req.method !== 'POST') {
    console.log('=== INVALID METHOD ===');
    console.log('Received method:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  console.log('=== PROCESSING POST REQUEST ===');

  try {
    // Use the correct Pipefy webhook URL
    const webhookUrl = 'https://ipaas.pipefy.com/api/v1/webhooks/1NlP7fuovl3qx5FSJsBBI/sync';
    console.log('=== WEBHOOK CONFIGURATION ===');
    console.log('Webhook URL:', webhookUrl);

    const formData: WaitlistFormData = await req.json();
    console.log('=== FORM DATA RECEIVED ===');
    console.log('Form data received:', { 
      name: formData.name, 
      email: formData.email, 
      phone: formData.phone?.substring(0, 5) + '...' // Partial phone for privacy
    });

    // Submit to webhook with timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log('=== SENDING REQUEST TO PIPEFY WEBHOOK ===');
      console.log('Making fetch request to:', webhookUrl);
      console.log('Request body:', JSON.stringify(formData));
      
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Edge-Function/1.0',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('=== WEBHOOK RESPONSE RECEIVED ===');
      console.log('Webhook response status:', webhookResponse.status);
      console.log('Webhook response status text:', webhookResponse.statusText);
      console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()));

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('=== WEBHOOK ERROR RESPONSE ===');
        console.error('Error text:', errorText);
        throw new Error(`Webhook request failed with status ${webhookResponse.status}: ${errorText}`);
      }

      const responseText = await webhookResponse.text();
      console.log('=== WEBHOOK SUCCESS RESPONSE ===');
      console.log('Response body:', responseText);

      return new Response(
        JSON.stringify({ success: true, message: 'Successfully added to waitlist' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('=== FETCH ERROR ===');
      console.error('Error name:', fetchError.name);
      console.error('Error message:', fetchError.message);
      console.error('Full error:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Webhook request timed out after 15 seconds');
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
