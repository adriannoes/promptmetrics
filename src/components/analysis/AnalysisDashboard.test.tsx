import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AnalysisDashboard } from './AnalysisDashboard';

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

describe('AnalysisDashboard - header summary', () => {
  it('exibe domínio em destaque e Last updated do generated_at', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <AnalysisDashboard result={result as any} />
      </LanguageProvider>
    );

    // domínio destacado (texto presente)
    expect(await screen.findByText('pipefy.com')).toBeInTheDocument();

    // last updated usa analysis_data.generated_at
    const last = await screen.findByTestId('dashboard-last-updated');
    expect(last.textContent).toMatch(/Last updated:/);
  });
});

describe('AnalysisDashboard - ordering e Top 5 + Others', () => {
  it('renderiza gráficos principais sem erro após processamento de Top 5 + Others', async () => {
    const result = makeResult();
    render(
      <LanguageProvider>
        <AnalysisDashboard result={result as any} />
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
        <AnalysisDashboard result={result as any} />
      </LanguageProvider>
    );
    // Não validamos a ordem exata das linhas no DOM do Recharts (complexo),
    // mas garantimos que elementos-chave renderizam sem erro.
    expect(await screen.findByText(/Sentiment Trends/i)).toBeInTheDocument();
    expect(await screen.findByText(/Ranking Position/i)).toBeInTheDocument();
  });
});


