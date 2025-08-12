import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Analysis from './Analysis';
import * as domainUtils from '@/utils/domain';
import { LanguageProvider } from '@/contexts/LanguageContext';
import * as supabaseClient from '@/integrations/supabase/client';

// Mock Supabase client (inclui channel) para acomodar useRealTimeAnalysis
type Row = {
  id: string;
  domain: string;
  status: string;
  updated_at: string;
  analysis_data?: any;
};
let mockResult: Row | null = null;
let channelStatus: 'SUBSCRIBED' | 'CLOSED' = 'SUBSCRIBED';
let delayMs = 0;

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
            if (delayMs > 0) {
              await new Promise((r) => setTimeout(r, delayMs));
            }
            return { data: mockResult, error: null } as any;
          },
        };
        return builder;
      },
      channel: (_name: string) => {
        return {
          on: (_event: string, _filter: any, cb: (payload: any) => void) => {
            // Não emitimos eventos aqui; apenas retornamos subscribe
            return {
              subscribe: (statusCb: (s: any) => void) => {
                statusCb(channelStatus);
                return { unsubscribe: () => {} } as any;
              },
            } as any;
          },
        } as any;
      },
    },
  };
});

vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header" />,
}));

vi.mock('@/components/AnalysisResults', () => ({
  __esModule: true,
  AnalysisResults: ({ domain }: any) => (
    <div data-testid="analysis-domain">{domain}</div>
  ),
}));

// Mock para acionar estado de erro via onError do DomainAnalysisInput
vi.mock('@/components/DomainAnalysisInput', () => ({
  __esModule: true,
  DomainAnalysisInput: ({ onError }: any) => {
    // dispara erro assíncrono ao montar
    setTimeout(() => {
      try { onError('Simulated error'); } catch {}
    }, 0);
    return <div data-testid="mock-domain-input" />;
  },
}));

describe('Analysis Page - 5.1.1 Query Param', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // reset estado do mock do supabase
    mockResult = null;
    channelStatus = 'SUBSCRIBED';
    delayMs = 0;
  });

  const setup = (url: string) => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
  };

  it('lê o domínio da query string (?domain=) e reflete no header/live-region', async () => {
    // 5.1.3: normaliza domínio
    vi.spyOn(domainUtils, 'extractDomain').mockImplementation((s: any) => 'example.com');
    mockResult = {
      id: 'ar-2',
      domain: 'example.com',
      status: 'completed',
      updated_at: '2025-08-10T23:05:00.000Z',
      analysis_data: { summary: 'Resumo', score: 80, generated_at: '2025-08-10T23:04:00.000Z' },
    };
    setup('/analysis?domain=https://www.example.com');
    // aceita tanto header summary quanto live region como fonte
    const header = await screen.findByTestId('analysis-header-summary');
    expect(header).toHaveTextContent('example.com');
  });

  it('usa fallback do localStorage quando não há query param', async () => {
    // 5.1.3: normaliza domínio do fallback
    vi.spyOn(domainUtils, 'extractDomain').mockImplementation((s: any) => 'fallback.example.com');
    localStorage.setItem('lastAnalyzedDomain', 'http://fallback.example.com');
    setup('/analysis');
    const el = await screen.findByTestId('analysis-domain');
    expect(el).toHaveTextContent('fallback.example.com');
  });
});

describe('Analysis Page - 5.4 A11y & Responsividade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const setup = (url: string) => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
  };

  it('expõe landmark principal com role=main, tabIndex=-1 e foca no main após montar', async () => {
    setup('/analysis?domain=example.com');
    const main = await screen.findByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
    // foco é disparado via useEffect; aguarda microtask
    await Promise.resolve();
    expect(document.activeElement).toBe(main);
  });

  it('renderiza região aria-live="polite" para atualizações', async () => {
    vi.spyOn(domainUtils, 'extractDomain').mockImplementation((s: any) => 'example.com');
    setup('/analysis?domain=https://www.example.com');
    const live = await screen.findByTestId('analysis-live-region');
    expect(live).toHaveAttribute('role', 'status');
    expect(live).toHaveAttribute('aria-live', 'polite');
    expect(live).toHaveTextContent('example.com');
  });

  it('usa classes responsivas no layout principal', async () => {
    setup('/analysis');
    const container = await screen.findByTestId('analysis-container');
    expect(container.className).toMatch(/max-w-6xl/);
    expect(container.className).toMatch(/sm:px-6/);
    expect(container.className).toMatch(/lg:px-8/);

    const grid = await screen.findByTestId('analysis-grid');
    expect(grid.className).toMatch(/lg:grid-cols-2/);
  });
});

describe('Analysis Page - skeleton durante carregamento', () => {
  const setup = (url: string) => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
  };

  it('exibe skeleton enquanto busca o último resultado', async () => {
    // Atrasar maybeSingle e forçar status CLOSED para manter skeleton até resolver
    delayMs = 50;
    channelStatus = 'CLOSED';
    mockResult = null;

    setup('/analysis?domain=example.com');
    // skeleton aparece durante o load
    const skel = await screen.findByTestId('analysis-skeleton');
    expect(skel).toBeInTheDocument();
    // Reset delay para não afetar outros testes
    delayMs = 0;
    channelStatus = 'SUBSCRIBED';
  });
});

describe('Analysis Page - header summary e Last updated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const setup = (url: string) => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
  };

  it('mostra domain + Last updated do registro mais recente (updated_at desc)', async () => {
    try { localStorage.setItem('VITE_DISABLE_REALTIME', 'true'); } catch {}
    // Mock do supabase.from(...).select(...).eq(...).order(...).limit(1).maybeSingle()
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'ar-2',
        domain: 'example.com',
        status: 'completed',
        updated_at: '2025-08-10T23:05:00.000Z',
        analysis_data: {
          summary: 'Resumo',
          score: 80,
          generated_at: '2025-08-10T23:04:00.000Z'
        }
      },
      error: null
    });
    const order = vi.fn().mockReturnValue({ limit: () => ({ maybeSingle }) });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    vi.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue({
      from,
    } as unknown as supabaseClient['supabase']);

    setup('/analysis?domain=https://www.example.com');

    // Header summary renderiza
    const header = await screen.findByTestId('analysis-header-summary');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('example.com');

    const last = await screen.findByTestId('analysis-last-updated');
    expect(last.textContent).toMatch(/Last updated:/);
    try { localStorage.removeItem('VITE_DISABLE_REALTIME'); } catch {}
  });
});

describe('Analysis Page - estado de erro', () => {
  beforeEach(() => {
    // garante que spies anteriores não quebrem o mock do supabase.channel
    vi.restoreAllMocks();
  });
  const setup = (url: string) => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
  };

  it('exibe alerta acessível quando ocorre erro na análise', async () => {
    // ao montar, o mock de DomainAnalysisInput chamará onError
    setup('/analysis?domain=example.com');
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/Erro na análise:/i);
  });
});


