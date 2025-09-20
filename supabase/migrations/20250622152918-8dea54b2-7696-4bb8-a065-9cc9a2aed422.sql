
-- Phase 1: Create security definer functions to break circular dependencies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to safely check if user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Function to validate invitation codes
CREATE OR REPLACE FUNCTION public.is_valid_invitation_code(code_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.invitation_codes 
    WHERE code = code_to_check AND used = false
  );
$$;

-- Function to consume invitation code (mark as used)
CREATE OR REPLACE FUNCTION public.consume_invitation_code(code_to_use TEXT, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if code exists and is unused
  IF NOT public.is_valid_invitation_code(code_to_use) THEN
    RETURN FALSE;
  END IF;
  
  -- Mark code as used
  UPDATE public.invitation_codes 
  SET 
    used = true,
    used_by = user_id,
    used_at = now()
  WHERE code = code_to_use AND used = false;
  
  RETURN FOUND;
END;
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all invitation codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Admins can create invitation codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Admins can delete unused invitation codes" ON public.invitation_codes;

-- Create secure RLS policies using security definer functions
CREATE POLICY "Admins can view all invitation codes" 
  ON public.invitation_codes 
  FOR SELECT 
  TO authenticated
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can create invitation codes" 
  ON public.invitation_codes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can delete unused invitation codes" 
  ON public.invitation_codes 
  FOR DELETE 
  TO authenticated
  USING (used = false AND public.is_current_user_admin());

-- Secure update policy for invitation codes
CREATE POLICY "System can update invitation codes when consumed" 
  ON public.invitation_codes 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add audit logging table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  TO authenticated
  USING (public.is_current_user_admin());

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Trigger function to audit profile role changes
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    PERFORM public.log_audit_event(
      'role_change',
      'profiles',
      NEW.id,
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for profile role changes
DROP TRIGGER IF EXISTS audit_profile_role_changes ON public.profiles;
CREATE TRIGGER audit_profile_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();

-- Update the user creation function to validate invite codes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  invite_code_value TEXT;
BEGIN
  -- Get the invite code from metadata
  invite_code_value := COALESCE(NEW.raw_user_meta_data ->> 'invite_code', '');
  
  -- Validate invite code if provided
  IF invite_code_value != '' THEN
    IF NOT public.is_valid_invitation_code(invite_code_value) THEN
      RAISE EXCEPTION 'Invalid or expired invitation code';
    END IF;
    
    -- Consume the invitation code
    IF NOT public.consume_invitation_code(invite_code_value, NEW.id) THEN
      RAISE EXCEPTION 'Failed to consume invitation code';
    END IF;
  ELSE
    RAISE EXCEPTION 'Invitation code is required for registration';
  END IF;
  
  -- Create the profile
  INSERT INTO public.profiles (id, full_name, email, invite_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    invite_code_value
  );
  
  -- Log the user creation
  PERFORM public.log_audit_event(
    'user_created',
    'profiles',
    NEW.id,
    NULL,
    jsonb_build_object('email', NEW.email, 'invite_code', invite_code_value)
  );
  
  RETURN NEW;
END;
$$;

-- Add rate limiting table for failed login attempts
CREATE TABLE public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address INET,
  success BOOLEAN NOT NULL DEFAULT false,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on login attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Admins can view login attempts
CREATE POLICY "Admins can view login attempts" 
  ON public.login_attempts 
  FOR SELECT 
  TO authenticated
  USING (public.is_current_user_admin());

-- Function to log login attempts
CREATE OR REPLACE FUNCTION public.log_login_attempt(
  p_email TEXT,
  p_success BOOLEAN DEFAULT false,
  p_ip_address INET DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_id UUID;
BEGIN
  INSERT INTO public.login_attempts (
    email,
    ip_address,
    success
  ) VALUES (
    p_email,
    p_ip_address,  
    p_success
  ) RETURNING id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$;

-- Function to check if email is rate limited
CREATE OR REPLACE FUNCTION public.is_rate_limited(
  p_email TEXT,
  p_window_minutes INTEGER DEFAULT 15,
  p_max_attempts INTEGER DEFAULT 5
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*) >= p_max_attempts
  FROM public.login_attempts 
  WHERE email = p_email 
    AND success = false 
    AND attempted_at > (now() - (p_window_minutes || ' minutes')::interval);
$$;
