-- Phase 1: Fix Critical Privilege Escalation Vulnerability
-- Create security definer functions to avoid RLS recursion

-- Function to check if current user is admin (avoiding RLS recursion)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Function to safely change user roles (admin only)
CREATE OR REPLACE FUNCTION public.admin_change_user_role(target_user_id uuid, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_role text;
BEGIN
  -- Only admins can change roles
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  -- Prevent users from changing their own role
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Users cannot change their own role';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('client', 'admin') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;
  
  -- Get the current role before updating
  SELECT role INTO old_role FROM public.profiles WHERE id = target_user_id;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the change
  PERFORM public.log_audit_event(
    'admin_role_change',
    'profiles',
    target_user_id,
    jsonb_build_object('previous_role', old_role),
    jsonb_build_object('new_role', new_role, 'changed_by', auth.uid())
  );
  
  RETURN FOUND;
END;
$$;

-- Drop and recreate the profiles UPDATE policy to prevent self-role modification
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile (non-role fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (
    -- Allow updating non-role fields
    (OLD.role = NEW.role) 
    OR 
    -- Only allow role changes through admin function
    public.is_current_user_admin()
  )
);

-- Phase 2: Fix Data Access Control for Analysis Results
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view analysis results" ON public.analysis_results;

-- For now, restrict to admins only until proper domain ownership is implemented
CREATE POLICY "Only admins can view analysis results" 
ON public.analysis_results 
FOR SELECT 
USING (public.is_current_user_admin());

-- Phase 3: Fix Invitation Code Manipulation
-- Drop problematic policies
DROP POLICY IF EXISTS "Allow updating invitation codes when used" ON public.invitation_codes;
DROP POLICY IF EXISTS "System can update invitation codes when consumed" ON public.invitation_codes;

-- Only allow system functions to update invitation codes
CREATE POLICY "Only system can update invitation codes" 
ON public.invitation_codes 
FOR UPDATE 
USING (false) -- No direct updates allowed
WITH CHECK (false); -- No direct updates allowed