-- Create rankllm_results table for storing document ranking results
CREATE TABLE IF NOT EXISTS rankllm_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  query TEXT NOT NULL,
  model_used TEXT NOT NULL,
  ranking_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_rankllm_results_domain ON rankllm_results(domain);
CREATE INDEX IF NOT EXISTS idx_rankllm_results_status ON rankllm_results(status);
CREATE INDEX IF NOT EXISTS idx_rankllm_results_created_at ON rankllm_results(created_at);

-- Add analysis_type column to analysis_results for feature flag
ALTER TABLE analysis_results 
ADD COLUMN IF NOT EXISTS analysis_type TEXT DEFAULT 'n8n' CHECK (analysis_type IN ('n8n', 'rankllm', 'both'));

-- Add preferred_analysis_method to organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS preferred_analysis_method TEXT DEFAULT 'n8n' CHECK (preferred_analysis_method IN ('n8n', 'rankllm', 'both'));

-- RLS policies for rankllm_results
CREATE POLICY "Users can view their organization rankllm results"
ON public.rankllm_results
FOR SELECT
TO authenticated
USING (
  -- Admins can see everything
  is_current_user_admin()
  OR
  -- Users can see results for their organization domains
  domain IN (
    SELECT website_url 
    FROM organizations 
    WHERE id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  )
);

-- Only admins can insert/update/delete rankllm results
CREATE POLICY "Only admins can manage rankllm results"
ON public.rankllm_results
FOR ALL
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());
