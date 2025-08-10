import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => {
  const api: any = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnValue({
        subscribe: vi.fn().mockImplementation((cb: any) => {
          // imediatamente sinaliza SUBSCRIBED
          cb('SUBSCRIBED');
          return { unsubscribe: vi.fn() } as any;
        }),
      }),
    }),
  };
  return { supabase: api };
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
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </LanguageProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega organização por organization_id e renderiza dashboard', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    // Realtime hook buscará via channel, mas fará fetch inicial; retornamos dado existente
    (supabase.maybeSingle as any).mockResolvedValue({ data: { id: 'ar-1', domain: 'example.com' }, error: null });

    const utils = setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTestId('org-header')).toHaveTextContent('Org Test');
    await waitFor(() => expect(screen.queryByTestId('analysis-progress')).not.toBeInTheDocument());
    expect(screen.getByTestId('org-dashboard')).toHaveTextContent('org-1');
  });

  it('exibe Unauthorized quando não encontra organização', async () => {
    (supabase.single as any).mockResolvedValue({ data: null, error: { message: 'not found' } });

    setup();

    const el = await waitFor(() => screen.getByTestId('unauthorized'));
    expect(el).toHaveTextContent('Organization not found');
  });

  it('exibe estado de análise em progresso com ARIA quando não há analysis_results', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: null, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

    const progress = screen.getByTestId('analysis-progress');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('role', 'status');
    expect(progress).toHaveAttribute('aria-live', 'polite');
  });

  it('renderiza dashboard quando há analysis_results', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: { id: 'ar-1', domain: 'example.com' }, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId('analysis-progress')).not.toBeInTheDocument());
    expect(screen.getByTestId('org-dashboard')).toBeInTheDocument();
  });

  it.skip('faz polling a cada 30s e para quando encontrar dados', async () => {
    vi.useFakeTimers();
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });

    // Primeiro retorno: sem analysis_results
    (supabase.maybeSingle as any)
      .mockResolvedValueOnce({ data: null, error: null })
      // Segundo retorno: ainda sem resultados
      .mockResolvedValueOnce({ data: null, error: null })
      // Terceiro retorno: resultados encontrados
      .mockResolvedValueOnce({ data: { id: 'ar-1', domain: 'example.com' }, error: null });

    setup();

    // Carrega organização e mostra progresso
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTestId('analysis-progress')).toBeInTheDocument();
    const initialCalls = (supabase.maybeSingle as any).mock.calls.length;

    // Avança 30s: primeira tentativa de refetch
    await act(async () => {
      vi.advanceTimersByTime(30000);
      await vi.runOnlyPendingTimersAsync();
    });
    // Avança mais 30s: segunda tentativa de refetch que deve encontrar dados
    await act(async () => {
      vi.advanceTimersByTime(30000);
      await vi.runOnlyPendingTimersAsync();
    });

    // Deve ter chamado pelo menos +2 vezes após dois ciclos
    expect((supabase.maybeSingle as any).mock.calls.length).toBeGreaterThanOrEqual(initialCalls + 2);

    // Após encontrar dados, próximos ticks não devem disparar novos fetches
    const callsAfterData = (supabase.maybeSingle as any).mock.calls.length;
    await act(async () => {
      vi.advanceTimersByTime(60000);
      await vi.runOnlyPendingTimersAsync();
    });
    expect((supabase.maybeSingle as any).mock.calls.length).toBe(callsAfterData);

    // Cleanup timers & unmount
    await vi.runOnlyPendingTimersAsync();
    vi.clearAllTimers();
    utils.unmount();

    vi.useRealTimers();
  }, 12000);
});


