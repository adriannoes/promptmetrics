
-- Verificar se o usuário demo existe na tabela profiles
SELECT * FROM public.profiles WHERE email = 'demo@example.com';

-- Verificar se existe a organização demo
SELECT * FROM public.organizations WHERE slug = 'demo';

-- Se a organização demo não existir, criar ela
INSERT INTO public.organizations (
  id,
  name, 
  slug,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Demo Organization',
  'demo',
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Atualizar o perfil do usuário demo para garantir que está associado à organização demo
DO $$
DECLARE
  demo_org_id UUID;
  demo_user_id UUID := '82a96621-2849-4dee-a70f-8da2616823be';
BEGIN
  -- Obter o ID da organização demo
  SELECT id INTO demo_org_id FROM public.organizations WHERE slug = 'demo';
  
  -- Garantir que o perfil do usuário demo existe e está configurado corretamente
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
    invite_code = 'DEMO2024',
    updated_at = now();
  
  RAISE NOTICE 'Perfil do usuário demo configurado com sucesso';
END $$;
