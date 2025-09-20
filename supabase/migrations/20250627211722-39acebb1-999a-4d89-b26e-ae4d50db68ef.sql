
-- Update the existing user profile to associate with Demo organization
DO $$
DECLARE
  demo_org_id UUID;
BEGIN
  -- Get the Demo organization ID
  SELECT id INTO demo_org_id FROM public.organizations WHERE slug = 'demo';
  
  -- Update the existing user profile to associate with Demo organization
  UPDATE public.profiles 
  SET organization_id = demo_org_id,
      updated_at = now()
  WHERE email = 'user@dev.com';
  
  -- Verify the update
  IF FOUND THEN
    RAISE NOTICE 'Successfully associated user@dev.com with Demo organization';
  ELSE
    RAISE NOTICE 'User profile with email user@dev.com not found';
  END IF;
END $$;
