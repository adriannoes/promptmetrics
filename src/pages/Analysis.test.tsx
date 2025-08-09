import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Analysis from './Analysis';
import * as domainUtils from '@/utils/domain';
import { LanguageProvider } from '@/contexts/LanguageContext';

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

  it('lê o domínio da query string (?domain=) e repassa para AnalysisResults', async () => {
    // 5.1.3: normaliza domínio
    vi.spyOn(domainUtils, 'extractDomain').mockImplementation((s: any) => 'example.com');
    setup('/analysis?domain=https://www.example.com');
    const el = await screen.findByTestId('analysis-domain');
    expect(el).toHaveTextContent('example.com');
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


