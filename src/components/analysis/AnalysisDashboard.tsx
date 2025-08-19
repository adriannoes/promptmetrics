import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, Target, Heart, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CompleteAnalysisResult, AnalysisDataStructure, ChartDataPoint, OverallSentimentItem, RankingData, SentimentTrendData } from '@/types/analysis';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDateTime, formatNumber } from '@/lib/format';
import { orderSeriesKeys, trimToTop5WithOthers } from './dataTransforms';

interface AnalysisDashboardProps {
  result: CompleteAnalysisResult;
}

// Fallbacks leves quando o payload vier parcial
const fallbackTrends = [
  { month: 'Jan', You: 70, Competitor1: 60, Competitor2: 58 },
  { month: 'Feb', You: 72, Competitor1: 61, Competitor2: 59 },
  { month: 'Mar', You: 74, Competitor1: 62, Competitor2: 60 },
  { month: 'Apr', You: 75, Competitor1: 63, Competitor2: 61 },
  { month: 'May', You: 77, Competitor1: 64, Competitor2: 62 },
  { month: 'Jun', You: 78, Competitor1: 65, Competitor2: 63 },
];

const fallbackRanking = [
  { month: 'Jan', You: 3.0, Competitor1: 2.2, Competitor2: 2.8 },
  { month: 'Feb', You: 2.8, Competitor1: 2.1, Competitor2: 2.7 },
  { month: 'Mar', You: 2.6, Competitor1: 2.0, Competitor2: 2.7 },
  { month: 'Apr', You: 2.5, Competitor1: 1.9, Competitor2: 2.8 },
  { month: 'May', You: 2.3, Competitor1: 1.9, Competitor2: 2.9 },
  { month: 'Jun', You: 2.1, Competitor1: 1.8, Competitor2: 3.0 },
];

// Header removido para simplificar a página conforme a nova diretriz

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { domain, analysis_data } = result as { domain: string; analysis_data: AnalysisDataStructure };
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = (location.hash?.replace('#', '') || 'dashboard');
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [recentTabs, setRecentTabs] = React.useState<string[]>([]);
  const { t } = useLanguage();

  // Telemetria mínima
  React.useEffect(() => {
    // page_view
    console.log('telemetry.analysis.view', {
      domain,
      has_data: !!analysis_data,
      status: (result as any).status,
      version: (analysis_data as any)?.version,
    });
  }, [domain]);

  const persistRecentTabs = React.useCallback((val: string) => {
    try {
      const key = `analysisTabHistory:${domain}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as string[];
      const next = [val, ...existing.filter((v) => v !== val)].slice(0, 3);
      localStorage.setItem(key, JSON.stringify(next));
      setRecentTabs(next);
    } catch {}
  }, [domain]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    persistRecentTabs(val);
    console.log('telemetry.analysis.tab_change', { tab: val, domain });
    // Sincroniza com hash para permitir navegação direta e funcionamento do NavBar
    navigate(`#${val}`, { replace: true });
  };

  // Reage a mudanças no hash da URL (ex: navegação externa, testes)
  React.useEffect(() => {
    const syncFromHash = () => {
      const next = (window.location.hash || '').replace('#', '') || 'dashboard';
      setActiveTab(next);
      persistRecentTabs(next);
    };
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  React.useEffect(() => {
    try {
      const key = `analysisTabHistory:${domain}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as string[];
      if (existing.length) setRecentTabs(existing);
      else persistRecentTabs(initialTab);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  // Utilidades importadas de dataTransforms

  const rawSentiment: SentimentTrendData[] = analysis_data?.sentiment_trends?.length ? analysis_data.sentiment_trends : (fallbackTrends as SentimentTrendData[]);
  const rawRanking: RankingData[] = analysis_data?.ranking_data?.length ? analysis_data.ranking_data : (fallbackRanking as RankingData[]);
  const sentimentTrends = trimToTop5WithOthers(domain, rawSentiment as unknown as Array<Record<string, number | string>>);
  const rankingDataProcessed = trimToTop5WithOthers(domain, rawRanking as unknown as Array<Record<string, number | string>>);
  const overallSentiment: OverallSentimentItem[] = analysis_data?.overall_sentiment?.length
    ? analysis_data.overall_sentiment
    : [
        { name: domain, score: analysis_data?.score ?? 75, color: '#3B82F6' },
        { name: 'Competitor1', score: 68, color: '#10B981' },
        { name: 'Competitor2', score: 64, color: '#8B5CF6' },
      ];

  // Reordenar overall_sentiment para colocar domínio primeiro e limitar Top 5 + Others (média)
  const orderedOverall = React.useMemo(() => {
    const items: OverallSentimentItem[] = [...overallSentiment];
    // separar domínio
    const domainIndex = items.findIndex(i => i.name.toLowerCase().includes(domain.toLowerCase()));
    const domainItem: OverallSentimentItem = domainIndex >= 0 ? items.splice(domainIndex, 1)[0] : { name: domain, score: analysis_data?.score ?? 75, color: '#3B82F6' };
    // ordenar competidores por score desc
    items.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    const top = items.slice(0, 5);
    const rest = items.slice(5);
    if (rest.length) {
      const avg = Math.round(rest.reduce((acc: number, it) => acc + (Number(it.score) || 0), 0) / rest.length);
      top.push({ name: 'Others', score: avg, color: '#6B7280' });
    }
    return [domainItem, ...top];
  }, [overallSentiment, domain, analysis_data?.score]);

  const recommendations = analysis_data?.recommendations ?? [];

  return (
    <div>
      {/* Enhanced Header Section with Status and Navigation */}
      <div className="relative mb-8">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl" />
        
        <div className="relative p-6 sm:p-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/home')}
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/60 backdrop-blur-sm"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Dashboard
            </button>
            
            {/* Analysis Status Badge */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">Analysis Complete</span>
            </div>
          </div>

          {/* Domain Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 rounded-full backdrop-blur-sm border border-white/40">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium text-slate-700">Domain Analysis</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {domain}
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive AI analysis revealing insights, trends, and competitive positioning
            </p>
          </div>

          {/* Enhanced Navigation */}
          <div className="mt-8">
            <NavBar
              position="static"
              items={[
                { name: t('analysis.tabs.dashboard'), url: '/analysis#dashboard', icon: BarChart3 },
                { name: t('analysis.tabs.promptAnalysis'), url: '/analysis#prompts', icon: Sparkles },
                { name: t('analysis.tabs.competitorAnalysis') || 'Competitor Analysis', url: '/analysis#competitors', icon: Target },
                { name: t('analysis.tabs.strategicInsights'), url: '/analysis#insights', icon: TrendingUp },
              ]}
              onItemClick={(item) => {
                const map: Record<string, string> = {
                  [t('analysis.tabs.dashboard')]: 'dashboard',
                  [t('analysis.tabs.promptAnalysis')]: 'prompts',
                  [t('analysis.tabs.competitorAnalysis') || 'Competitor Analysis']: 'competitors',
                  [t('analysis.tabs.strategicInsights')]: 'insights',
                };
                const val = map[item.name] ?? 'dashboard';
                handleTabChange(val);
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Tabs Quick Access */}
      {recentTabs.length > 0 && (
        <nav aria-label="recent-tabs" className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">Recent:</span>
          <div className="flex gap-2">
            {recentTabs.slice(0, 3).map((tab, idx) => {
              const nameMap: Record<string, string> = {
                dashboard: t('analysis.tabs.dashboard'),
                prompts: t('analysis.tabs.promptAnalysis'),
                competitors: t('analysis.tabs.competitorAnalysis') || 'Competitor Analysis',
                insights: t('analysis.tabs.strategicInsights'),
              };
              const label = nameMap[tab] || tab;
              return (
                <button
                  key={`${tab}-${idx}`}
                  onClick={() => handleTabChange(tab)}
                  className="px-3 py-1 bg-white/60 hover:bg-white/80 rounded-full backdrop-blur-sm border border-white/40 hover:border-blue-200/60 text-slate-600 hover:text-blue-700 transition-all duration-300 hover:shadow-md"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full pt-16">
        {/* Mantemos a estrutura de TabsList para acessibilidade e testes, porém oculta visualmente */}
        <TabsList className="sr-only">
          <TabsTrigger value="dashboard">{t('analysis.tabs.dashboard')}</TabsTrigger>
          <TabsTrigger value="prompts">{t('analysis.tabs.promptAnalysis')}</TabsTrigger>
          <TabsTrigger value="competitors">{t('analysis.tabs.competitorAnalysis') || 'Competitor Analysis'}</TabsTrigger>
          <TabsTrigger value="insights">{t('analysis.tabs.strategicInsights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Enhanced Sentiment Trends */}
            <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  {t('dashboard.sentimentTrends')}
                </CardTitle>
                <CardDescription>{t('analysis.lastMonthsPerCompetitor')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={sentimentTrends as ChartDataPoint[]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    {(() => {
                       const keys = Object.keys((sentimentTrends[0] || {}) as Record<string, unknown>).filter(k => k !== 'month');
                       const ordered = orderSeriesKeys(domain, keys);
                      return ordered.map((seriesKey, idx) => (
                        <Line 
                          key={seriesKey} 
                          type="monotone" 
                          dataKey={seriesKey} 
                          stroke={["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4]} 
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                          activeDot={{ r: 6, strokeWidth: 2, fill: ["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4] }}
                        />
                      ));
                    })()}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Enhanced Ranking */}
            <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  {t('dashboard.rankingPosition')}
                </CardTitle>
                <CardDescription>{t('analysis.lowerIsBetter')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={rankingDataProcessed as ChartDataPoint[]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      domain={[0, 6]} 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    {(() => {
                       const keys = Object.keys((rankingDataProcessed[0] || {}) as Record<string, unknown>).filter(k => k !== 'month');
                       const ordered = orderSeriesKeys(domain, keys);
                      return ordered.map((seriesKey, idx) => (
                        <Line 
                          key={seriesKey} 
                          type="monotone" 
                          dataKey={seriesKey} 
                          stroke={["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4]} 
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                          activeDot={{ r: 6, strokeWidth: 2, fill: ["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4] }}
                        />
                      ));
                    })()}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Enhanced Overall Sentiment */}
            <Card className="md:col-span-2 backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  {t('dashboard.overallSentimentScore')}
                </CardTitle>
                <CardDescription>Competitive landscape overview</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={350}>
                   <BarChart data={orderedOverall as OverallSentimentItem[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prompts">
          <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {t('analysis.aiPromptAnalysis')}
              </CardTitle>
              <CardDescription>
                {t('analysis.promptMetricsSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {/* Resumo simples das métricas se existirem */}
              {analysis_data?.prompt_analysis?.performance_metrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(analysis_data.prompt_analysis.performance_metrics).map(([k, v]) => (
                    <div key={k} className="p-4 rounded-xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 border border-purple-200/40 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                      <div className="text-sm font-medium text-purple-700 mb-2">{k}</div>
                      <div className="text-2xl font-bold text-purple-900">{String(v)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl animate-pulse" />
                    <Sparkles className="relative w-20 h-20 text-purple-500 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-3">Prompt Analysis Coming Soon</h3>
                  <p className="text-slate-600">{t('analysis.empty.prompts')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50/60 to-red-50/60 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                {t('competitorAnalysis.title')}
              </CardTitle>
              <CardDescription>{t('competitorAnalysis.basedOnCurrentAnalysis')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-xl animate-pulse" />
                  <Target className="relative w-20 h-20 text-orange-500 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-3">Competitor Analysis Coming Soon</h3>
                <p className="text-slate-600">{t('analysis.empty.insights')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  {t('dashboard.recommendations')}
                </CardTitle>
                <CardDescription>{t('analysis.recommendations.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {recommendations.length ? (
                  <div className="space-y-3">
                    {recommendations.slice(0, 8).map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/60 border border-green-200/40 backdrop-blur-sm hover:bg-green-100/60 transition-colors duration-300">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-white">{i + 1}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{r}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-xl animate-pulse" />
                      <TrendingUp className="relative w-16 h-16 text-green-500 mx-auto" />
                    </div>
                    <p className="text-slate-600">{t('analysis.empty.recommendations')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  {t('strategicInsights.title')}
                </CardTitle>
                <CardDescription>{t('analysis.highlights')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {analysis_data?.strategic_insights?.key_insights?.length ? (
                  <div className="space-y-3">
                    {analysis_data.strategic_insights.key_insights.slice(0, 8).map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/60 border border-blue-200/40 backdrop-blur-sm hover:bg-blue-100/60 transition-colors duration-300">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{r}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl animate-pulse" />
                      <Sparkles className="relative w-16 h-16 text-blue-500 mx-auto" />
                    </div>
                    <p className="text-slate-600">{t('analysis.empty.insights')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisDashboard;


