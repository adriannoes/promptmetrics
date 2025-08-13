import React from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import SkipNav from '@/components/SkipNav';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import type { CompleteAnalysisResult } from '@/types/analysis';

const MOCK_RESULT: CompleteAnalysisResult = {
  id: 'e2e-mock',
  domain: 'example.com',
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  analysis_data: {
    summary: 'Resumo simulado para E2E.',
    score: 82,
    recommendations: ['Foque em UX', 'Melhorar SEO em páginas-chave'],
    sentiment_trends: [
      { month: 'Jan', 'example.com': 60, 'competitorA.com': 55, 'competitorB.com': 50 },
      { month: 'Feb', 'example.com': 62, 'competitorA.com': 56, 'competitorB.com': 51 },
      { month: 'Mar', 'example.com': 65, 'competitorA.com': 57, 'competitorB.com': 53 },
    ],
    ranking_data: [
      { month: 'Jan', 'example.com': 5, 'competitorA.com': 7, 'competitorB.com': 8 },
      { month: 'Feb', 'example.com': 4, 'competitorA.com': 6, 'competitorB.com': 7 },
      { month: 'Mar', 'example.com': 3, 'competitorA.com': 6, 'competitorB.com': 6 },
    ],
    overall_sentiment: [
      { name: 'Positive', score: 68, color: '#22c55e' },
      { name: 'Neutral', score: 22, color: '#eab308' },
      { name: 'Negative', score: 10, color: '#ef4444' },
    ],
    share_of_rank: [
      { month: 'Jan', 'example.com': 35, 'competitorA.com': 30, 'competitorB.com': 35 },
      { month: 'Feb', 'example.com': 36, 'competitorA.com': 29, 'competitorB.com': 35 },
      { month: 'Mar', 'example.com': 38, 'competitorA.com': 28, 'competitorB.com': 34 },
    ],
    competitor_analysis: {
      market_share: [
        { name: 'example.com', value: 38, color: '#3b82f6' },
        { name: 'competitorA.com', value: 28, color: '#22c55e' },
        { name: 'competitorB.com', value: 34, color: '#f97316' },
      ],
      strategic_priorities: [
        { id: 1, title: 'Expandir conteúdo', description: 'Cobrir mais intenções de busca', priority: 'high', marketShare: 20 },
      ],
      opportunities: [
        { category: 'SEO', title: 'Snippet ganho', description: 'Oportunidade em snippets ricos', impact: 'high', effort: 'medium' },
      ],
      strengths: ['Autoridade de domínio'],
      weaknesses: ['Velocidade em mobile'],
    },
    prompt_analysis: {
      sentiment_by_llm: { ChatGPT: 0.72, Gemini: 0.69, Perplexity: 0.7 },
      ranking_by_prompt: {
        'Brand Clarity': { 'example.com': 4, 'competitorA.com': 6, 'competitorB.com': 7 },
        'Trust Signals': { 'example.com': 3, 'competitorA.com': 5, 'competitorB.com': 6 },
      },
      performance_metrics: { avgLatencyMs: 1800 },
    },
    strategic_insights: {
      key_insights: ['Clareza de proposta de valor'],
      recommendations: ['Reforçar CTAs em páginas principais'],
      action_items: ['Testar variações de headline'],
      growth_opportunities: ['Expandir blog técnico'],
      competitive_threats: ['Campanhas agressivas do concorrente A'],
    },
  },
};

const AnalysisE2EContent = () => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-foreground">
      <SkipNav />
      <main id="main-content" tabIndex={-1} role="main" className="pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6" data-testid="analysis-container">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">P</div>
                <h1 className="text-2xl font-bold">PromptMetrics</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-colors">Export Report</button>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary">
                  {language === 'pt-BR' ? 'Sair' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>

          <div data-testid="analysis-dashboard">
            <AnalysisDashboard result={MOCK_RESULT as any} />
          </div>
        </div>
      </main>
    </div>
  );
};

const AnalysisE2E = () => (
  <LanguageProvider>
    <AnalysisE2EContent />
  </LanguageProvider>
);

export default AnalysisE2E;


