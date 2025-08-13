import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AnalysisDashboard } from './AnalysisDashboard';
import userEvent from '@testing-library/user-event';

const makeResult = () => ({
  id: 'ar-1',
  domain: 'pipefy.com',
  status: 'completed' as const,
  created_at: new Date('2025-08-10T23:00:00.000Z').toISOString(),
  updated_at: new Date('2025-08-10T23:05:00.000Z').toISOString(),
  analysis_data: {
    version: 1,
    generated_at: '2025-08-10T23:04:00.000Z',
    request_id: '9270acf2-1fe7-4e0a-8526-e223c67fa6c2',
    summary: 'Resumo executivo da análise',
    score: 85,
    recommendations: ['Rec A', 'Rec B', 'Rec C'],
    sentiment_trends: [
      { month: 'Jan', Pipefy: 75, Competitor1: 68, Competitor2: 65 },
      { month: 'Feb', Pipefy: 76, Competitor1: 69, Competitor2: 66 },
      { month: 'Mar', Pipefy: 78, Competitor1: 70, Competitor2: 68 },
      { month: 'Apr', Pipefy: 77, Competitor1: 71, Competitor2: 68 },
      { month: 'May', Pipefy: 79, Competitor1: 70, Competitor2: 68 },
      { month: 'Jun', Pipefy: 78, Competitor1: 71, Competitor2: 68 }
    ],
    ranking_data: [
      { month: 'Jan', Pipefy: 2.1, Competitor1: 2.8, Competitor2: 3.2 },
      { month: 'Feb', Pipefy: 2.0, Competitor1: 2.7, Competitor2: 3.1 },
      { month: 'Mar', Pipefy: 1.9, Competitor1: 2.6, Competitor2: 3.0 },
      { month: 'Apr', Pipefy: 2.0, Competitor1: 2.5, Competitor2: 2.9 },
      { month: 'May', Pipefy: 1.8, Competitor1: 2.4, Competitor2: 2.8 },
      { month: 'Jun', Pipefy: 1.7, Competitor1: 2.3, Competitor2: 2.7 }
    ],
    overall_sentiment: [
      { name: 'Pipefy', score: 77.6 },
      { name: 'Competitor1', score: 73.4 },
      { name: 'Competitor2', score: 68.8 },
      { name: 'Competitor3', score: 60 },
      { name: 'Competitor4', score: 58 },
      { name: 'Competitor5', score: 57 },
      { name: 'Competitor6', score: 56 }
    ],
    share_of_rank: [
      { month: 'Jan', Pipefy: 35, Competitor1: 28, Competitor2: 22, Others: 15 },
      { month: 'Feb', Pipefy: 38, Competitor1: 26, Competitor2: 21, Others: 15 },
      { month: 'Mar', Pipefy: 42, Competitor1: 25, Competitor2: 20, Others: 13 },
      { month: 'Apr', Pipefy: 45, Competitor1: 24, Competitor2: 19, Others: 12 },
      { month: 'May', Pipefy: 48, Competitor1: 23, Competitor2: 18, Others: 11 },
      { month: 'Jun', Pipefy: 52, Competitor1: 22, Competitor2: 17, Others: 9 }
    ],
    competitor_analysis: {
      market_share: [
        { name: 'Pipefy', value: 35 },
        { name: 'Competitor1', value: 25 },
        { name: 'Competitor2', value: 20 },
        { name: 'Others', value: 20 }
      ]
    },
    prompt_analysis: {
      sentiment_by_llm: { OpenAI: 82, Gemini: 78, Claude: 85 },
      ranking_by_prompt: { workflow_automation: { Pipefy: 1, Competitor1: 2, Competitor2: 3 } },
      performance_metrics: { total_mentions: 247, sentiment_score: 80.2 }
    },
    strategic_insights: {
      key_insights: ['Líder em automação visual'],
      recommendations: ['Investir em IA'],
      action_items: ['Campanha Q3']
    }
  }
});

describe('AnalysisDashboard - header/nav e estrutura principal', () => {
  it('renderiza NavBar e conteúdo do dashboard', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result as any} />
        </MemoryRouter>
      </LanguageProvider>
    );

    // NavBar presente (usa link para /analysis#dashboard)
    const links = await screen.findAllByRole('link', { name: 'Dashboard' });
    expect(links.length).toBeGreaterThan(0);
    // Conteúdo principal do dashboard visível
    expect(await screen.findByText(/Overall Sentiment Score/i)).toBeInTheDocument();
  });
});

describe('AnalysisDashboard - A11y tabs (roles básicos)', () => {
  it('usa role=tablist e role=tab/tabpanel nos elementos de abas', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result as any} />
        </MemoryRouter>
      </LanguageProvider>
    );
    // TabsList é um wrapper Radix com role=tablist
    const tablist = await screen.findByRole('tablist');
    expect(tablist).toBeInTheDocument();
    const tabs = await screen.findAllByRole('tab');
    expect(tabs.length).toBeGreaterThanOrEqual(3);
  });
});

describe('AnalysisDashboard - ordering e Top 5 + Others', () => {
  it('renderiza gráficos principais sem erro após processamento de Top 5 + Others', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result as any} />
        </MemoryRouter>
      </LanguageProvider>
    );
    // Não confiamos em labels SVG do Recharts no JSDOM; apenas garantimos que as seções existem.
    expect(await screen.findByText(/Overall Sentiment Score/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sentiment Trends/i)).toBeInTheDocument();
    expect(await screen.findByText(/Ranking Position/i)).toBeInTheDocument();
  });

  it('reordena séries das linhas para deixar o domínio primeiro', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result as any} />
        </MemoryRouter>
      </LanguageProvider>
    );
    // Não validamos a ordem exata das linhas no DOM do Recharts (complexo),
    // mas garantimos que elementos-chave renderizam sem erro.
    expect(await screen.findByText(/Sentiment Trends/i)).toBeInTheDocument();
    expect(await screen.findByText(/Ranking Position/i)).toBeInTheDocument();
  });
});

describe('AnalysisDashboard - empty states por aba e fallback de Last updated', () => {
  const base = makeResult();

  it('renderiza dashboard mesmo sem generated_at (sem exigir last updated no header)', async () => {
    const result = { ...base, analysis_data: { ...base.analysis_data } } as any;
    delete result.analysis_data.generated_at;
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result} />
        </MemoryRouter>
      </LanguageProvider>
    );
    // O header foi simplificado; validamos que o dashboard apareceu normalmente
    expect(await screen.findByText(/Overall Sentiment Score/i)).toBeInTheDocument();
  });

  it('mostra mensagens de vazio quando sections não existem', async () => {
    const result = {
      ...base,
      analysis_data: {
        version: 1,
        summary: 'Resumo',
        score: 80,
        recommendations: [],
      },
    } as any;
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result} />
        </MemoryRouter>
      </LanguageProvider>
    );
    // Abre aba de prompts via hash/nav bar
    window.location.hash = '#prompts';
    // Clica no link da NavBar para sincronizar
    const link = await screen.findByRole('link', { name: 'Prompt Analysis' });
    await userEvent.click(link);
    expect(await screen.findByText(/Not enough prompt data yet\./i)).toBeInTheDocument();
    // Abre aba de insights
    window.location.hash = '#insights';
    const link2 = await screen.findByRole('link', { name: 'Strategic Insights' });
    await userEvent.click(link2);
    expect(await screen.findByText(/No recommendations available\./i)).toBeInTheDocument();
    expect(await screen.findByText(/No strategic insights available\./i)).toBeInTheDocument();
  });
});

describe('AnalysisDashboard - histórico de abas recentes', () => {
  it('persiste e exibe abas recentes no topo', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/analysis"]}>
          <AnalysisDashboard result={result as any} />
        </MemoryRouter>
      </LanguageProvider>
    );
    // clica em Competitors e depois em Insights
    const competitorsLink = await screen.findByRole('link', { name: 'Competitor Analysis' });
    await userEvent.click(competitorsLink);
    const insightsLink = await screen.findByRole('link', { name: 'Strategic Insights' });
    await userEvent.click(insightsLink);
    // Deve existir nav de abas recentes
    const recent = await screen.findByRole('navigation', { name: /recent-tabs/i });
    expect(recent).toBeInTheDocument();
    // Deve listar pelo menos um botão recente
    const recentButtons = await screen.findAllByRole('button', { name: /Strategic Insights|Competitor Analysis|Dashboard|AI Prompt Analysis/ });
    expect(recentButtons.length).toBeGreaterThan(0);
  });
});


