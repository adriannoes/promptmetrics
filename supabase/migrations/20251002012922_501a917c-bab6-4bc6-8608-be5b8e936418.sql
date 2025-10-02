-- ==========================================
-- CRITICAL SECURITY FIX: Implement Secure Role Management System
-- ==========================================
-- This migration addresses privilege escalation vulnerabilities by:
-- 1. Moving roles from profiles table to a separate user_roles table
-- 2. Implementing security definer function for role checking
-- 3. Updating all RLS policies to use the new secure role system
-- ==========================================

-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('client', 'admin');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::public.app_role
FROM public.profiles
WHERE role IS NOT NULL;

-- 5. Update is_current_user_admin function to use new role system
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- 6. Update admin_change_user_role function to work with new system
CREATE OR REPLACE FUNCTION public.admin_change_user_role(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_role TEXT;
  new_role_enum public.app_role;
BEGIN
  -- Only admins can change roles
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  -- Prevent users from changing their own role
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Users cannot change their own role';
  END IF;
  
  -- Validate and cast role
  IF new_role NOT IN ('client', 'admin') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;
  new_role_enum := new_role::public.app_role;
  
  -- Get the current role before updating
  SELECT role::TEXT INTO old_role 
  FROM public.user_roles 
  WHERE user_id = target_user_id 
  LIMIT 1;
  
  -- Remove old role and insert new role
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role_enum);
  
  -- Log the change
  PERFORM public.log_audit_event(
    'admin_role_change',
    'user_roles',
    target_user_id,
    jsonb_build_object('previous_role', old_role),
    jsonb_build_object('new_role', new_role, 'changed_by', auth.uid())
  );
  
  RETURN TRUE;
END;
$$;

-- 7. Update handle_new_user function to use new role system
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  
  -- Create the profile (without role column)
  INSERT INTO public.profiles (id, full_name, email, invite_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    invite_code_value
  );
  
  -- Assign default client role in user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
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

-- 8. Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only system can insert roles"
ON public.user_roles
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Only system can update roles"
ON public.user_roles
FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Only system can delete roles"
ON public.user_roles
FOR DELETE
TO service_role
USING (true);

-- 9. Remove role column from profiles table (now in user_roles)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 10. Drop and recreate audit trigger on profiles (role column no longer exists)
DROP TRIGGER IF EXISTS audit_profile_changes ON public.profiles;

CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'profile_update',
      'profiles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_profile_changes
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.audit_profile_changes();