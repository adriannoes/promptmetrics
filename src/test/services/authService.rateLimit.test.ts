import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authModule from '@/services/authService';

const supabaseMock = {
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: {} }, error: null })
  },
  rpc: vi.fn()
};

vi.mock('@/integrations/supabase/client', () => ({ supabase: supabaseMock }));
vi.mock('@/services/auditService', () => ({ auditService: { logLogin: vi.fn(), logSignup: vi.fn() } }));

describe('authService rate limit', () => {
  beforeEach(() => {
    supabaseMock.rpc.mockReset();
  });

  it('blocks login when RPC reports rate limited', async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: true, error: null });
    const { signIn } = await import('@/services/authService');
    const res = await signIn('user@example.com', 'Password1!');
    expect(supabaseMock.rpc).toHaveBeenCalledWith('is_rate_limited', { p_email: 'user@example.com' });
    expect(res.error?.message).toMatch(/Too many failed login attempts/i);
  });

  it('continues login when RPC not rate limited', async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: false, error: null });
    const { signIn } = await import('@/services/authService');
    const res = await signIn('user@example.com', 'Password1!');
    expect(res.error).toBeNull();
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalled();
  });

  it('logs error but continues if RPC fails', async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: null, error: { message: 'RPC error' } });
    const { signIn } = await import('@/services/authService');
    const res = await signIn('user@example.com', 'Password1!');
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalled();
    expect(res.error).toBeNull();
  });
});
