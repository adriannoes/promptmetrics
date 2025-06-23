
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

    // Submit to webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log('Webhook response status:', webhookResponse.status);

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully added to waitlist' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

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
