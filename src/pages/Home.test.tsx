import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    },
  };
});

vi.mock('@/contexts/AuthContext', async () => {
  return {
    useAuth: () => ({
      profile: {
        id: 'user-1',
        full_name: 'Test User',
        email: 'user@test.com',
        role: 'client',
        organization_id: 'org-1',
      },
      loading: false,
    }),
  };
});

vi.mock('@/components/OrganizationHeader', () => ({
  __esModule: true,
  default: ({ organization }: any) => <div data-testid="org-header">{organization?.name}</div>,
}));

vi.mock('@/components/OrganizationDashboard', () => ({
  __esModule: true,
  default: ({ organization }: any) => <div data-testid="org-dashboard">{organization?.id}</div>,
}));

vi.mock('@/components/UnauthorizedAccess', () => ({
  __esModule: true,
  default: ({ message }: any) => <div data-testid="unauthorized">{message}</div>,
}));

vi.mock('@/components/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">loading</div>,
}));

describe('Home', () => {
  const setup = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega organização por organization_id e renderiza dashboard', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: { id: 'ar-1' }, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTestId('org-header')).toHaveTextContent('Org Test');
    expect(screen.getByTestId('org-dashboard')).toHaveTextContent('org-1');
  });

  it('exibe Unauthorized quando não encontra organização', async () => {
    (supabase.single as any).mockResolvedValue({ data: null, error: { message: 'not found' } });

    setup();

    const el = await waitFor(() => screen.getByTestId('unauthorized'));
    expect(el).toHaveTextContent('Organization not found');
  });
});


