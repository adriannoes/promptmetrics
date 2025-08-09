import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { AnalysisResults } from './AnalysisResults';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => {
  const chain = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({}),
    }),
    removeChannel: vi.fn(),
  } as any;
  return { supabase: chain };
});

describe('AnalysisResults - 5.2 ordering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    render(
      <LanguageProvider>
        <AnalysisResults domain="example.com" />
      </LanguageProvider>
    );

  it('aplica ordering por updated_at desc e depois created_at desc', async () => {
    (supabase.limit as any).mockResolvedValueOnce({ data: [], error: null });

    setup();

    // Verifica chamadas de ordenação encadeadas
    const orderCalls = (supabase.order as any).mock.calls;
    expect(orderCalls.length).toBeGreaterThanOrEqual(1);
    // primeira chamada: updated_at desc
    expect(orderCalls[0][0]).toBe('updated_at');
    expect(orderCalls[0][1]).toEqual({ ascending: false });
    // segunda chamada (fallback): created_at desc
    expect(orderCalls[1][0]).toBe('created_at');
    expect(orderCalls[1][1]).toEqual({ ascending: false });
  });
});

describe('AnalysisResults - 5.3 loading & error states', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithLang = () =>
    render(
      <LanguageProvider>
        <AnalysisResults domain="example.com" />
      </LanguageProvider>
    );

  it('exibe skeleton enquanto carrega', () => {
    // Promise que não resolve para manter loading
    (supabase.limit as any).mockImplementation(() => new Promise(() => {}));
    const { getByTestId } = renderWithLang();
    expect(getByTestId('analysis-results-skeleton')).toBeInTheDocument();
  });

  it('exibe mensagem de erro com role="alert" quando a busca falha', async () => {
    (supabase.limit as any).mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    const { findByTestId } = renderWithLang();
    const alert = await findByTestId('analysis-results-error');
    expect(alert).toHaveAttribute('role', 'alert');
  });
});

describe('AnalysisResults - 5.5.2 preview mínimo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sample = {
    id: '1',
    domain: 'example.com',
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    analysis_data: {
      summary: 'ok',
      score: 80,
      recommendations: ['a', 'b', 'c', 'd']
    }
  };

  it('renderiza summary, score e pelo menos 3 recomendações', async () => {
    (supabase.limit as any).mockResolvedValueOnce({ data: [sample], error: null });
    const { findByText } = render(
      <LanguageProvider>
        <AnalysisResults domain="example.com" />
      </LanguageProvider>
    );

    expect(await findByText('ok')).toBeInTheDocument();
    expect(await findByText('80/100')).toBeInTheDocument();
    expect(await findByText('a')).toBeInTheDocument();
    expect(await findByText('b')).toBeInTheDocument();
    expect(await findByText('c')).toBeInTheDocument();
  });
});


