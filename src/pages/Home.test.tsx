// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

let capturedRealtimeCb: ((payload: any) => void) | null = null;
let subscribeStatus: 'SUBSCRIBED' | 'CLOSED' = 'SUBSCRIBED';
const emitRealtimeInsert = (row: any) => {
  capturedRealtimeCb?.({ eventType: 'INSERT', new: row });
};
const emitRealtimeUpdate = (row: any) => {
  capturedRealtimeCb?.({ eventType: 'UPDATE', new: row });
};

vi.mock('@/integrations/supabase/client', () => {
  const api: any = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { success: true }, error: null }),
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockImplementation((_evt: any, _filter: any, cb: any) => {
        capturedRealtimeCb = cb;
        return {
          subscribe: vi.fn().mockImplementation((cbStatus: any) => {
            cbStatus(subscribeStatus);
            return { unsubscribe: vi.fn() } as any;
          }),
        } as any;
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
      <MemoryRouter>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <Home />
          </QueryClientProvider>
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    capturedRealtimeCb = null;
    subscribeStatus = 'SUBSCRIBED';
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
    // CTA deve estar habilitado
    expect(screen.getByTestId('analysis-cta')).toHaveAttribute('aria-disabled', 'false');
    expect(screen.getByTestId('org-dashboard')).toBeInTheDocument();
  });

  it('atualiza de "Em Progresso" para dashboard ao receber evento realtime', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    // Sem dados inicialmente
    (supabase.maybeSingle as any).mockResolvedValue({ data: null, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTestId('analysis-progress')).toBeInTheDocument();
    // CTA inicialmente desabilitado
    expect(screen.getByTestId('analysis-cta')).toHaveAttribute('aria-disabled', 'true');

    // Emite evento realtime indicando que chegou um resultado
    emitRealtimeInsert({ id: 'ar-2', domain: 'example.com', status: 'completed', analysis_data: {} });
    // Aguarda debounce interno do hook (~300ms)
    await new Promise((r) => setTimeout(r, 350));

    await waitFor(() => expect(screen.queryByTestId('analysis-progress')).not.toBeInTheDocument());
    // CTA habilitado após evento
    expect(screen.getByTestId('analysis-cta')).toHaveAttribute('aria-disabled', 'false');
    expect(screen.getByTestId('org-dashboard')).toBeInTheDocument();
  });

  it('processa evento UPDATE (não apenas INSERT) para habilitar CTA', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: null, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTestId('analysis-cta')).toHaveAttribute('aria-disabled', 'true');

    emitRealtimeUpdate({ id: 'ar-9', domain: 'example.com', status: 'completed', analysis_data: {} });
    await new Promise((r) => setTimeout(r, 350));
    await waitFor(() => expect(screen.queryByTestId('analysis-progress')).not.toBeInTheDocument());
    expect(screen.getByTestId('analysis-cta')).toHaveAttribute('aria-disabled', 'false');
  });

  it('CTA "Nova Análise" chama trigger-analysis com o domínio normalizado', async () => {
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://www.example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: { id: 'ar-1', domain: 'example.com' }, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

    const btn = screen.getByTestId('new-analysis-cta');
    expect(btn).toHaveAttribute('aria-disabled', 'false');
    btn.click();

    await waitFor(() => {
      expect((supabase.functions.invoke as any)).toHaveBeenCalledWith('trigger-analysis', {
        body: { domain: 'example.com' },
      });
    });
  });

  it('quando realtime inicia fechado, ainda renderiza CTA se fetch inicial retorna dados', async () => {
    subscribeStatus = 'CLOSED';
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: { id: 'ar-1', domain: 'example.com' }, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId('analysis-progress')).not.toBeInTheDocument());
    expect(screen.getByTestId('analysis-cta')).toHaveAttribute('aria-disabled', 'false');
  });

  it('não abre canal realtime quando VITE_DISABLE_REALTIME=true (localStorage override)', async () => {
    try { localStorage.setItem('VITE_DISABLE_REALTIME', 'true'); } catch {}
    (supabase.single as any).mockResolvedValue({ data: { id: 'org-1', name: 'Org Test', website_url: 'https://example.com' }, error: null });
    (supabase.maybeSingle as any).mockResolvedValue({ data: null, error: null });

    setup();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect((supabase.channel as any).mock.calls.length).toBe(0);
    try { localStorage.removeItem('VITE_DISABLE_REALTIME'); } catch {}
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


