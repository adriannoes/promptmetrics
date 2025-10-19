-- Add analysis method preference to organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS preferred_analysis_method TEXT DEFAULT 'n8n' 
CHECK (preferred_analysis_method IN ('n8n', 'rankllm', 'both'));

-- Add analysis type to analysis_results for tracking
ALTER TABLE analysis_results 
ADD COLUMN IF NOT EXISTS analysis_type TEXT DEFAULT 'n8n' 
CHECK (analysis_type IN ('n8n', 'rankllm', 'both'));

-- Create function to get user's preferred analysis method
CREATE OR REPLACE FUNCTION get_user_analysis_method(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    org_id UUID;
    method TEXT;
BEGIN
    -- Get user's organization
    SELECT organization_id INTO org_id
    FROM profiles 
    WHERE id = user_id;
    
    -- If no organization, return default
    IF org_id IS NULL THEN
        RETURN 'n8n';
    END IF;
    
    -- Get organization's preferred method
    SELECT preferred_analysis_method INTO method
    FROM organizations 
    WHERE id = org_id;
    
    -- Return method or default
    RETURN COALESCE(method, 'n8n');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can access rankllm
CREATE OR REPLACE FUNCTION can_access_rankllm(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    method TEXT;
BEGIN
    method := get_user_analysis_method(user_id);
    RETURN method IN ('rankllm', 'both');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_analysis_method(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_rankllm(UUID) TO authenticated;
