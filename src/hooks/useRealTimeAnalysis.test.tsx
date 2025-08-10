import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useRealTimeAnalysis } from './useRealTimeAnalysis';

// In-memory mock state for Supabase client
type AnalysisRow = {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
};

let currentQueryResult: AnalysisRow | null = null;
let maybeSingleCallCount = 0;

type ChannelListener = (payload: any) => void;
let channelListener: ChannelListener | null = null;
let subscribeStatus: 'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR' = 'SUBSCRIBED';

const emitRealtimeEvent = (eventType: 'INSERT' | 'UPDATE', newRow: AnalysisRow) => {
  if (channelListener) {
    channelListener({
      eventType,
      new: newRow,
    });
  }
};

vi.mock('@/integrations/supabase/client', () => {
  return {
    __esModule: true,
    supabase: {
      from: (_table: string) => {
        const builder: any = {
          select: (_sel: string) => builder,
          eq: (_col: string, _val: string) => builder,
          order: (_col: string, _opts: any) => builder,
          limit: (_n: number) => builder,
          maybeSingle: async () => {
            maybeSingleCallCount += 1;
            return { data: currentQueryResult, error: null } as any;
          },
        };
        return builder;
      },
      channel: (_name: string) => {
        return {
          on: (
            _event: string,
            _filter: any,
            callback: ChannelListener,
          ) => {
            channelListener = callback;
            return {
              subscribe: (statusCb: (s: any) => void) => {
                // Emit current status synchronously for simplicity
                statusCb(subscribeStatus);
                return {
                  unsubscribe: () => {
                    channelListener = null;
                  },
                } as any;
              },
            } as any;
          },
        } as any;
      },
    },
  };
});

const TestHarness = ({ domain }: { domain: string }) => {
  const { data, isConnected, hasNewData } = useRealTimeAnalysis(domain);
  return (
    <div>
      <div data-testid="connected">{String(isConnected)}</div>
      <div data-testid="domain">{data?.domain ?? ''}</div>
      <div data-testid="new">{String(hasNewData)}</div>
    </div>
  );
};

describe('useRealTimeAnalysis - realtime + fallback', () => {
  beforeEach(() => {
    currentQueryResult = null;
    maybeSingleCallCount = 0;
    subscribeStatus = 'SUBSCRIBED';
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('faz o fetch inicial e conecta no canal realtime', async () => {
    currentQueryResult = {
      id: '1',
      domain: 'example.com',
      status: 'completed',
      analysis_data: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    render(<TestHarness domain="https://www.example.com/" />);

    // Aguarda render com dados
    await waitFor(() => {
      expect(screen.getByTestId('domain')).toHaveTextContent('example.com');
    });
    expect(screen.getByTestId('connected')).toHaveTextContent('true');
    expect(maybeSingleCallCount).toBeGreaterThanOrEqual(1);
  });

  it('processa evento INSERT/UPDATE com debounce e marca hasNewData', async () => {
    // Começa com um resultado base para evitar que o fetch posterior sobrescreva com null
    currentQueryResult = {
      id: 'base',
      domain: 'example.com',
      status: 'processing',
      analysis_data: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    render(<TestHarness domain="http://www.example.com/path" />);
    await Promise.resolve();

    // Emite novo dado por evento realtime
    emitRealtimeEvent('INSERT', {
      id: '2',
      domain: 'example.com',
      status: 'completed',
      analysis_data: { summary: 'ok' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Debounce 300ms (usar timers reais para evitar conflito com waiters internos)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 320));
    });
    const domainEl = await screen.findByTestId('domain');
    expect(domainEl).toHaveTextContent('example.com');
    expect(screen.getByTestId('new')).toHaveTextContent('true');
  });

  it('ativa fallback de polling quando não conectado ao realtime', async () => {
    vi.useFakeTimers();
    subscribeStatus = 'CLOSED'; // força isConnected=false
    currentQueryResult = null;
    render(<TestHarness domain="example.com" />);
    await Promise.resolve();

    // Nenhuma consulta após montagem além da inicial
    const callsAfterMount = maybeSingleCallCount;

    // setupPolling espera ~100ms antes de configurar intervalos
    vi.advanceTimersByTime(100);

    // Avança 10s (intervalo de polling esperado quando desconectado)
    vi.advanceTimersByTime(10_000);

    // Deve ter feito ao menos mais 1 consulta silenciosa
    expect(maybeSingleCallCount).toBeGreaterThan(callsAfterMount);
  });
});


