// Edge Function for Supabase - Runs on Deno runtime
// TypeScript errors below are expected as this runs in Deno, not Node.js

// @ts-ignore - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno runtime imports  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to generate automatic colors for data that doesn't have them
const generateAutoColors = (items: string[]): string[] => {
  const defaultColors = [
    '#50C878', '#4B7BFF', '#FF4B4B', '#FFB84D', '#9D4EDD', 
    '#06D6A0', '#F72585', '#4CC9F0', '#FB8500', '#219EBC'
  ];
  return items.map((_, index) => defaultColors[index % defaultColors.length]);
};

// Helper function to extract unique competitors from data
const extractCompetitors = (analysisData: any): string[] => {
  const competitors = new Set<string>();
  
  // Extract from sentiment_trends
  if (analysisData.sentiment_trends && Array.isArray(analysisData.sentiment_trends)) {
    analysisData.sentiment_trends.forEach((item: any) => {
      Object.keys(item).forEach(key => {
        if (key !== 'month' && key !== 'Mês') {
          competitors.add(key);
        }
      });
    });
  }
  
  // Extract from ranking_data
  if (analysisData.ranking_data && Array.isArray(analysisData.ranking_data)) {
    analysisData.ranking_data.forEach((item: any) => {
      Object.keys(item).forEach(key => {
        if (key !== 'month' && key !== 'Mês') {
          competitors.add(key);
        }
      });
    });
  }
  
  // Extract from overall_sentiment
  if (analysisData.overall_sentiment && Array.isArray(analysisData.overall_sentiment)) {
    analysisData.overall_sentiment.forEach((item: any) => {
      if (item.name) competitors.add(item.name);
    });
  }
  
  return Array.from(competitors);
};

// Helper function to validate and enhance analysis data
const processAnalysisData = (analysisData: any) => {
  const processed = { ...analysisData };
  const competitors = extractCompetitors(analysisData);
  
  // Ensure overall_sentiment has colors
  if (processed.overall_sentiment && Array.isArray(processed.overall_sentiment)) {
    processed.overall_sentiment = processed.overall_sentiment.map((item: any, index: number) => ({
      ...item,
      color: item.color || generateAutoColors(processed.overall_sentiment.map((i: any) => i.name))[index]
    }));
  }
  
  // Ensure market_share has colors if it exists
  if (processed.competitor_analysis?.market_share && Array.isArray(processed.competitor_analysis.market_share)) {
    processed.competitor_analysis.market_share = processed.competitor_analysis.market_share.map((item: any, index: number) => ({
      ...item,
      color: item.color || generateAutoColors(processed.competitor_analysis.market_share.map((i: any) => i.name))[index]
    }));
  }
  
  // Add default empty arrays if sections are missing
  if (!processed.sentiment_trends) processed.sentiment_trends = [];
  if (!processed.ranking_data) processed.ranking_data = [];
  if (!processed.share_of_rank) processed.share_of_rank = [];
  if (!processed.overall_sentiment) processed.overall_sentiment = [];
  
  if (!processed.competitor_analysis) processed.competitor_analysis = {};
  if (!processed.competitor_analysis.market_share) processed.competitor_analysis.market_share = [];
  if (!processed.competitor_analysis.strengths) processed.competitor_analysis.strengths = [];
  if (!processed.competitor_analysis.weaknesses) processed.competitor_analysis.weaknesses = [];
  if (!processed.competitor_analysis.opportunities) processed.competitor_analysis.opportunities = [];
  
  if (!processed.strategic_insights) processed.strategic_insights = {};
  if (!processed.strategic_insights.key_insights) processed.strategic_insights.key_insights = [];
  if (!processed.strategic_insights.action_items) processed.strategic_insights.action_items = [];
  if (!processed.strategic_insights.growth_opportunities) processed.strategic_insights.growth_opportunities = [];
  if (!processed.strategic_insights.competitive_threats) processed.strategic_insights.competitive_threats = [];
  
  if (!processed.prompt_analysis) processed.prompt_analysis = {};
  if (!processed.prompt_analysis.sentiment_by_llm) processed.prompt_analysis.sentiment_by_llm = {};
  if (!processed.prompt_analysis.ranking_by_prompt) processed.prompt_analysis.ranking_by_prompt = {};
  
  return { processed, competitors };
};

// Helper function to calculate data quality metrics
const calculateDataMetrics = (analysisData: any, competitors: string[]) => {
  const sections = [
    'summary', 'score', 'recommendations',
    'sentiment_trends', 'ranking_data', 'share_of_rank', 'overall_sentiment',
    'competitor_analysis', 'strategic_insights', 'prompt_analysis'
  ];
  
  const completeSections = sections.filter(section => {
    const data = analysisData[section];
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return true;
  });
  
  const completenessScore = Math.round((completeSections.length / sections.length) * 100);
  
  // Count LLMs
  const llmsAnalyzed = analysisData.prompt_analysis?.sentiment_by_llm 
    ? Object.keys(analysisData.prompt_analysis.sentiment_by_llm) 
    : [];
  
  // Count temporal data points
  const temporalDataMonths = analysisData.sentiment_trends?.length || 0;
  
  // Count prompts analyzed
  const promptsAnalyzed = analysisData.prompt_analysis?.ranking_by_prompt 
    ? Object.keys(analysisData.prompt_analysis.ranking_by_prompt) 
    : [];
  
  return {
    completenessScore,
    completeSections,
    partialSections: sections.filter(s => !completeSections.includes(s) && analysisData[s]),
    missingSections: sections.filter(s => !analysisData[s]),
    llmsAnalyzed,
    competitorsFound: competitors,
    temporalDataMonths,
    promptsAnalyzed
  };
};

// Helper function to log errors to Pipefy
const reportErrorToPipefy = async (error: any, context: any) => {
  try {
    const pipefyWebhook = 'https://ipaas.pipefy.com/api/v1/webhooks/M9MMr5ClE4WJorSyUgaBD/sync';
    
    await fetch(pipefyWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Edge Function Error - receive-analysis`,
        description: `Error occurred in receive-analysis function: ${error.message}`,
        fields: {
          error_type: 'Edge Function Error',
          error_message: error.message,
          error_stack: error.stack || 'N/A',
          function_name: 'receive-analysis',
          timestamp: new Date().toISOString(),
          context: JSON.stringify(context),
          additional_info: JSON.stringify({
            user_agent: context.user_agent || 'N/A',
            method: context.method || 'N/A',
            url: context.url || 'N/A'
          })
        }
      })
    });
  } catch (reportError) {
    console.error('💥 Failed to report error to Pipefy:', reportError);
  }
};

serve(async (req) => {
  console.log('🎯 Receive-analysis called:', req.method, req.url);
  
  const requestContext = {
    method: req.method,
    url: req.url,
    user_agent: req.headers.get('user-agent') || 'unknown',
    timestamp: new Date().toISOString()
  };
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ CORS preflight handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      const error = new Error(`Method ${req.method} not allowed`);
      await reportErrorToPipefy(error, requestContext);
      
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    let payload;
    try {
      payload = await req.json();
      console.log('📥 Received raw payload:', JSON.stringify(payload, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON payload:', parseError);
      await reportErrorToPipefy(parseError, { ...requestContext, step: 'JSON parsing' });
      
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // n8n sends data as array, extract first item
    let analysisPayload = payload;
    if (Array.isArray(payload)) {
      console.log('📦 Payload is array, extracting first item...');
      analysisPayload = payload[0];
      console.log('📦 Extracted payload:', JSON.stringify(analysisPayload, null, 2));
    }

    // Normalize domain to ensure consistency across the system
    const normalizeDomain = (input: string) => {
      try {
        if (!input) return input;
        let value = String(input).trim().toLowerCase();
        value = value.replace(/^https?:\/\//, '');
        value = value.replace(/^www\./, '');
        const slash = value.indexOf('/');
        if (slash !== -1) value = value.substring(0, slash);
        value = value.replace(/\/$/, '');
        return value;
      } catch {
        return input;
      }
    };

    // Enhanced validation with flexible data structure support
    if (!analysisPayload || !analysisPayload.domain || !analysisPayload.analysis_data) {
      console.log('❌ Missing required fields in payload:', {
        domain: analysisPayload?.domain,
        analysis_data: !!analysisPayload?.analysis_data
      });
      
      const validationError = new Error('Missing required fields: domain, analysis_data');
      await reportErrorToPipefy(validationError, { 
        ...requestContext, 
        step: 'Payload validation',
        received_payload: analysisPayload
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: domain, analysis_data',
          received_fields: Object.keys(analysisPayload || {})
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate minimum required fields in analysis_data
    const { summary, score, recommendations } = analysisPayload.analysis_data;
    if (!summary || typeof score !== 'number' || !Array.isArray(recommendations)) {
      console.log('❌ Missing core analysis fields:', {
        has_summary: !!summary,
        has_score: typeof score === 'number',
        has_recommendations: Array.isArray(recommendations)
      });
      
      const coreFieldsError = new Error('Missing core analysis fields: summary (string), score (number), recommendations (array)');
      await reportErrorToPipefy(coreFieldsError, { 
        ...requestContext, 
        step: 'Core fields validation',
        analysis_data_keys: Object.keys(analysisPayload.analysis_data)
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing core analysis fields: summary (string), score (number), recommendations (array)',
          analysis_data_keys: Object.keys(analysisPayload.analysis_data)
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const normalizedDomain = normalizeDomain(analysisPayload.domain);
    if (normalizedDomain !== analysisPayload.domain) {
      console.log('🧹 Normalizing domain:', {
        original: analysisPayload.domain,
        normalized: normalizedDomain
      });
    }

    // Process and enhance analysis data
    const { processed: enhancedAnalysisData, competitors } = processAnalysisData(analysisPayload.analysis_data);
    const dataMetrics = calculateDataMetrics(enhancedAnalysisData, competitors);

    // Initialize Supabase client
    let supabase;
    try {
      supabase = createClient(
        // @ts-ignore - Deno global object
        Deno.env.get('SUPABASE_URL') ?? '',
        // @ts-ignore - Deno global object
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
    } catch (supabaseError) {
      console.error('❌ Failed to initialize Supabase client:', supabaseError);
      await reportErrorToPipefy(supabaseError, { ...requestContext, step: 'Supabase initialization' });
      
      return new Response(
        JSON.stringify({ error: 'Database connection failed' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced logging with data flexibility metrics
    console.log('💾 Attempting to save to database...');
    console.log('📊 Data Flexibility Analysis:', {
      domain: normalizedDomain,
      status: analysisPayload.status || 'completed',
      llms_analyzed: dataMetrics.llmsAnalyzed,
      competitors_found: dataMetrics.competitorsFound,
      temporal_data_months: dataMetrics.temporalDataMonths,
      prompts_analyzed: dataMetrics.promptsAnalyzed,
      completeness_score: `${dataMetrics.completenessScore}%`,
      complete_sections: dataMetrics.completeSections,
      partial_sections: dataMetrics.partialSections,
      missing_sections: dataMetrics.missingSections,
      analysis_data_keys: Object.keys(enhancedAnalysisData)
    });

    // Insert or update analysis result with enhanced data
    const { data, error } = await supabase
      .from('analysis_results')
      .upsert({
        domain: normalizedDomain,
        status: analysisPayload.status || 'completed',
        analysis_data: enhancedAnalysisData, // Use enhanced data with fallbacks
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'domain',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('💥 Database error:', error);
      await reportErrorToPipefy(error, { 
        ...requestContext, 
        step: 'Database operation',
        domain: analysisPayload.domain,
        operation: 'upsert analysis_results'
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save analysis', 
          details: error.message,
          code: error.code
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Analysis saved successfully with enhanced data:', {
      id: data.id,
      domain: data.domain,
      status: data.status,
      data_summary: dataMetrics
    });

    // Return enhanced response with detailed data summary
      return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id, 
          domain: data.domain,
        message: 'Analysis received and saved successfully',
        data_summary: {
          llms_analyzed: dataMetrics.llmsAnalyzed,
          competitors_found: dataMetrics.competitorsFound,
          temporal_data_months: dataMetrics.temporalDataMonths,
          prompts_analyzed: dataMetrics.promptsAnalyzed,
          completeness_score: dataMetrics.completenessScore,
          sections_complete: dataMetrics.completeSections,
          sections_partial: dataMetrics.partialSections,
          sections_missing: dataMetrics.missingSections
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Error processing request:', error);
    
    // Report unexpected errors to Pipefy
    await reportErrorToPipefy(error, { ...requestContext, step: 'Unexpected error' });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});