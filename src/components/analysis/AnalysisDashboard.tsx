import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, Target, Heart, TrendingUp, Sparkles } from 'lucide-react';
import type { CompleteAnalysisResult, AnalysisDataStructure, ChartDataPoint, OverallSentimentItem, RankingData, SentimentTrendData } from '@/types/analysis';
import { useLanguage } from '@/contexts/LanguageContext';

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

const AnalysisHeader: React.FC<{ domain: string; score: number; summary: string; lastUpdated?: string }> = ({ domain, score, summary, lastUpdated }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <strong>{domain}</strong>
            </CardTitle>
            <CardDescription className="mt-2 max-w-3xl">{summary}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-700 mb-1">{score}<span className="text-lg text-blue-600">/100</span></div>
            <Badge className="bg-blue-100 text-blue-700">Overall Score</Badge>
            {lastUpdated && (
              <div className="text-xs text-muted-foreground mt-1" data-testid="dashboard-last-updated">
                Last updated: {(() => { try { return new Date(lastUpdated).toLocaleString(); } catch { return lastUpdated; } })()}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { domain, analysis_data } = result as { domain: string; analysis_data: AnalysisDataStructure };
  const [activeTab, setActiveTab] = React.useState('dashboard');
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

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    console.log('telemetry.analysis.tab_change', { tab: val, domain });
  };

  // Utilidades de série: ordenar colocando o domínio do cliente primeiro
  const orderSeriesKeys = (keys: string[]) => {
    const lower = domain.toLowerCase();
    const findExact = keys.find(k => k.toLowerCase() === lower);
    const findIncludes = keys.find(k => k.toLowerCase().includes(lower));
    const mainKey = findExact || findIncludes || keys[0];
    const others = keys.filter(k => k !== mainKey);
    return [mainKey, ...others];
  };

  // Calcular Top 5 competidores (excluindo a série do cliente) e agregar em Others
  const trimToTop5WithOthers = (rows: Array<Record<string, number | string>>) => {
    if (!rows?.length) return rows;
    const keys = Object.keys(rows[0]).filter(k => k !== 'month');
    if (!keys.length) return rows;
    const orderedKeys = orderSeriesKeys(keys);
    const mainKey = orderedKeys[0];
    const competitorKeys = orderedKeys.slice(1);
    // média por série
    const averages = competitorKeys.map((k) => {
      const avg = rows.reduce((acc, r) => acc + (Number(r[k]) || 0), 0) / rows.length;
      return { key: k, avg };
    });
    averages.sort((a, b) => b.avg - a.avg);
    const topKeys = averages.slice(0, 5).map(a => a.key);
    const dropKeys = averages.slice(5).map(a => a.key);
    if (dropKeys.length === 0) return rows; // nada a agregar
    // construir nova matriz com Others
    const resultRows = rows.map((r) => {
      const othersSum = dropKeys.reduce((acc, k) => acc + (Number(r[k]) || 0), 0);
      const base: Record<string, number | string> = { month: r.month };
      base[mainKey] = r[mainKey];
      topKeys.forEach((k) => { base[k] = r[k]; });
      base['Others'] = othersSum;
      return base;
    });
    return resultRows;
  };

  const rawSentiment: SentimentTrendData[] = analysis_data?.sentiment_trends?.length ? analysis_data.sentiment_trends : (fallbackTrends as SentimentTrendData[]);
  const rawRanking: RankingData[] = analysis_data?.ranking_data?.length ? analysis_data.ranking_data : (fallbackRanking as RankingData[]);
  const sentimentTrends = trimToTop5WithOthers(rawSentiment as unknown as Array<Record<string, number | string>>);
  const rankingDataProcessed = trimToTop5WithOthers(rawRanking as unknown as Array<Record<string, number | string>>);
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
      <AnalysisHeader 
        domain={domain} 
        score={analysis_data?.score ?? 0} 
        summary={analysis_data?.summary ?? ''}
        lastUpdated={(analysis_data as unknown as { generated_at?: string })?.generated_at || result.updated_at}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="dashboard">{t('analysis.tabs.dashboard')}</TabsTrigger>
          <TabsTrigger value="prompts">{t('analysis.tabs.promptAnalysis')}</TabsTrigger>
          <TabsTrigger value="insights">{t('analysis.tabs.strategicInsights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  {t('dashboard.sentimentTrends')}
                </CardTitle>
                <CardDescription>{t('analysis.lastMonthsPerCompetitor')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentTrends as ChartDataPoint[]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    {/* Desenha uma linha para cada chave além de month dinamicamente */}
                    {(() => {
                       const keys = Object.keys((sentimentTrends[0] || {}) as Record<string, unknown>).filter(k => k !== 'month');
                      const ordered = orderSeriesKeys(keys);
                      return ordered.map((seriesKey, idx) => (
                        <Line key={seriesKey} type="monotone" dataKey={seriesKey} stroke={["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4]} strokeWidth={2} />
                      ));
                    })()}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  {t('dashboard.rankingPosition')}
                </CardTitle>
                <CardDescription>{t('analysis.lowerIsBetter')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rankingDataProcessed as ChartDataPoint[]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 6]} />
                    <Tooltip />
                    <Legend />
                    {(() => {
                       const keys = Object.keys((rankingDataProcessed[0] || {}) as Record<string, unknown>).filter(k => k !== 'month');
                      const ordered = orderSeriesKeys(keys);
                      return ordered.map((seriesKey, idx) => (
                        <Line key={seriesKey} type="monotone" dataKey={seriesKey} stroke={["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4]} strokeWidth={2} />
                      ));
                    })()}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Overall Sentiment */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {t('dashboard.overallSentimentScore')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                   <BarChart data={orderedOverall as OverallSentimentItem[]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                {t('analysis.aiPromptAnalysis')}
              </CardTitle>
              <CardDescription>
                {t('analysis.promptMetricsSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Resumo simples das métricas se existirem */}
              {analysis_data?.prompt_analysis?.performance_metrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis_data.prompt_analysis.performance_metrics).map(([k, v]) => (
                    <div key={k} className="p-3 rounded-lg bg-slate-50 text-center">
                      <div className="text-sm text-slate-600">{k}</div>
                      <div className="text-xl font-semibold">{String(v)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm">{t('analysis.empty.prompts')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recommendations')}</CardTitle>
                <CardDescription>{t('analysis.recommendations.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {recommendations.slice(0, 8).map((r, i) => (
                      <li key={i} className="text-sm text-slate-700">{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 text-sm">{t('analysis.empty.recommendations')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('strategicInsights.title')}</CardTitle>
                <CardDescription>{t('analysis.highlights')}</CardDescription>
              </CardHeader>
              <CardContent>
                {analysis_data?.strategic_insights?.key_insights?.length ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {analysis_data.strategic_insights.key_insights.slice(0, 8).map((r, i) => (
                      <li key={i} className="text-sm text-slate-700">{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 text-sm">{t('analysis.empty.insights')}</p>
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


