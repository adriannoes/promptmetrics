-- Drop política muito restritiva
DROP POLICY IF EXISTS "Only admins can view analysis results" ON public.analysis_results;

-- Criar política que permite:
-- 1. Admins verem tudo
-- 2. Clientes verem apenas análises de domínios da sua organização
CREATE POLICY "Users can view their organization analysis results"
ON public.analysis_results
FOR SELECT
TO authenticated
USING (
  -- Admins podem ver tudo
  is_current_user_admin()
  OR
  -- Clientes podem ver análises de domínios da sua organização
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

-- Política para UPDATE (apenas admins e sistema)
CREATE POLICY "Only admins can update analysis results"
ON public.analysis_results
FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Política para DELETE (apenas admins)
CREATE POLICY "Only admins can delete analysis results"
ON public.analysis_results
FOR DELETE
TO authenticated
USING (is_current_user_admin());