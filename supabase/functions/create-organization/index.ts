import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string | null = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      userId = payload?.sub || null;
    } catch {
      // ignore
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json().catch(() => ({}));
    const domainRaw = body?.domain as string | undefined;
    if (!domainRaw) {
      return new Response(JSON.stringify({ error: 'domain is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const normalizedDomain = normalizeDomain(domainRaw);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: normalizedDomain, website_url: `https://${normalizedDomain}` })
      .select()
      .single();

    if (orgError || !org) {
      return new Response(JSON.stringify({ error: 'failed to create organization', details: orgError?.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Assign to profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ organization_id: org.id })
      .eq('id', userId);

    if (profileError) {
      return new Response(JSON.stringify({ error: 'failed to assign organization to profile', details: profileError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, organization_id: org.id, domain: normalizedDomain }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error', details: (e as any)?.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


