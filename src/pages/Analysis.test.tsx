import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Analysis from './Analysis';
import * as domainUtils from '@/utils/domain';
import { LanguageProvider } from '@/contexts/LanguageContext';
import * as supabaseClient from '@/integrations/supabase/client';

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

describe('Analysis Page - 5.1.1 Query Param', () => {
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

  it('lê o domínio da query string (?domain=) e reflete no header/live-region', async () => {
    // 5.1.3: normaliza domínio
    vi.spyOn(domainUtils, 'extractDomain').mockImplementation((s: any) => 'example.com');
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
    // Mock da cadeia supabase para atrasar maybeSingle e permitir ver o skeleton
    const maybeSingle = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: null, error: null }), 50)));
    const limit = vi.fn().mockReturnValue({ maybeSingle });
    const order = vi.fn().mockReturnValue({ limit });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    vi.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue({ from } as unknown as supabaseClient['supabase']);

    setup('/analysis?domain=example.com');
    // skeleton aparece durante o load
    const skel = await screen.findByTestId('analysis-skeleton');
    expect(skel).toBeInTheDocument();
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
  });
});


