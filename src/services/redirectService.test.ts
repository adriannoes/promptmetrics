import { describe, it, expect, vi } from 'vitest';
import { getPostLoginRedirect } from './redirectService';
import { supabase } from '@/integrations/supabase/client';

const base = {
  id: 'u1',
  full_name: 'User',
  email: 'user@test.com',
  invite_code: undefined,
  created_at: '',
  updated_at: '',
} as const;

describe('getPostLoginRedirect', () => {
  it('redireciona admin para /admin', async () => {
    const result = await getPostLoginRedirect({ ...base, role: 'admin' });
    expect(result.path).toBe('/admin');
  });

  it('cliente sem organization_id vai para /domain-setup', async () => {
    const result = await getPostLoginRedirect({ ...base, role: 'client' });
    expect(result.path).toBe('/domain-setup');
  });

  it('cliente com org sem website_url vai para /domain-setup', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { slug: 'acme', website_url: null }, error: null }),
        }),
      }),
    } as any);

    const result = await getPostLoginRedirect({ ...base, role: 'client', organization_id: 'org1', email: 'client@test.com' } as any);
    expect(result.path).toBe('/domain-setup');
  });

  it('cliente com org e website_url vai para /home', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { slug: 'acme', website_url: 'https://example.com' }, error: null }),
        }),
      }),
    } as any);

    const result = await getPostLoginRedirect({ ...base, role: 'client', organization_id: 'org1', email: 'client@test.com' } as any);
    expect(result.path).toBe('/home');
  });
});


