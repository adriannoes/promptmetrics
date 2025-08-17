-- Fix security vulnerability: Restrict analysis_results access to authenticated users only
-- This replaces the overly permissive "Anyone can view analysis results" policy

-- Drop the existing public policy that allows anyone to view analysis results
DROP POLICY IF EXISTS "Anyone can view analysis results" ON public.analysis_results;

-- Create a new policy that restricts access to authenticated users only
CREATE POLICY "Authenticated users can view analysis results" 
ON public.analysis_results 
FOR SELECT 
TO authenticated
USING (true);

-- Add a comment explaining the security fix
COMMENT ON POLICY "Authenticated users can view analysis results" ON public.analysis_results 
IS 'Security fix: Restricts access to competitive analysis data to authenticated users only, preventing public exposure of business intelligence';