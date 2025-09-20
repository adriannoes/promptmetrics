
-- Create a demo user account for the skip login functionality
DO $$
DECLARE
  demo_org_id UUID;
  demo_user_id UUID := '82a96621-2849-4dee-a70f-8da2616823be'; -- Using existing user ID
BEGIN
  -- Get the Demo organization ID
  SELECT id INTO demo_org_id FROM public.organizations WHERE slug = 'demo';
  
  -- Ensure the demo user profile exists and is properly configured
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    role, 
    organization_id,
    invite_code,
    created_at,
    updated_at
  ) VALUES (
    demo_user_id,
    'Demo User',
    'demo@example.com',
    'client',
    demo_org_id,
    'DEMO2024',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = 'Demo User',
    email = 'demo@example.com',
    role = 'client',
    organization_id = demo_org_id,
    updated_at = now();
  
  RAISE NOTICE 'Demo user profile configured successfully';
END $$;
