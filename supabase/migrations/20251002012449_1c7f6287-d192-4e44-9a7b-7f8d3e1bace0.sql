-- ==========================================
-- Fix Security Issues: profiles and login_attempts tables
-- ==========================================

-- 1. DROP and RECREATE profiles table policies to restrict to authenticated users only
-- This prevents unauthenticated users from even attempting to query the table

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate with authenticated role only
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- 2. Add missing policies for login_attempts table
-- Currently only SELECT is restricted to admins, but INSERT/UPDATE/DELETE are wide open!

-- Only the system (via edge functions with service role) should be able to INSERT login attempts
CREATE POLICY "Only system can insert login attempts" 
ON public.login_attempts 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Prevent any updates to login attempts (immutable audit log)
CREATE POLICY "No one can update login attempts" 
ON public.login_attempts 
FOR UPDATE 
TO public
USING (false);

-- Prevent any deletes to login attempts (immutable audit log)
CREATE POLICY "No one can delete login attempts" 
ON public.login_attempts 
FOR DELETE 
TO public
USING (false);

-- 3. Add similar protections for audit_logs table
-- These should also be immutable and only insertable by system

CREATE POLICY "Only system can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "No one can update audit logs" 
ON public.audit_logs 
FOR UPDATE 
TO public
USING (false);

CREATE POLICY "No one can delete audit logs" 
ON public.audit_logs 
FOR DELETE 
TO public
USING (false);