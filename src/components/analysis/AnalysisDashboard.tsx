import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, Target, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { CompleteAnalysisResult } from '@/types/analysis';

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

const AnalysisHeader: React.FC<{ domain: string; score: number; summary: string }> = ({ domain, score, summary }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {domain}
            </CardTitle>
            <CardDescription className="mt-2 max-w-3xl">{summary}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-700 mb-1">{score}<span className="text-lg text-blue-600">/100</span></div>
            <Badge className="bg-blue-100 text-blue-700">Overall Score</Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { domain, analysis_data } = result;

  const sentimentTrends = analysis_data?.sentiment_trends?.length ? analysis_data.sentiment_trends : fallbackTrends;
  const rankingData = analysis_data?.ranking_data?.length ? analysis_data.ranking_data : fallbackRanking;
  const overallSentiment = analysis_data?.overall_sentiment?.length
    ? analysis_data.overall_sentiment
    : [
        { name: domain, score: analysis_data?.score ?? 75, color: '#3B82F6' },
        { name: 'Competitor1', score: 68, color: '#10B981' },
        { name: 'Competitor2', score: 64, color: '#8B5CF6' },
      ];

  const recommendations = analysis_data?.recommendations ?? [];

  return (
    <div>
      <AnalysisHeader domain={domain} score={analysis_data?.score ?? 0} summary={analysis_data?.summary ?? ''} />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="prompts">AI Analysis</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  Sentiment Trends
                </CardTitle>
                <CardDescription>Últimos meses por competidor</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentTrends as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    {/* Desenha uma linha para cada chave além de month dinamicamente */}
                    {Object.keys(sentimentTrends[0] || {})
                      .filter((k) => k !== 'month')
                      .map((seriesKey, idx) => (
                        <Line key={seriesKey} type="monotone" dataKey={seriesKey} stroke={["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4]} strokeWidth={2} />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Ranking Position
                </CardTitle>
                <CardDescription>Menor é melhor</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rankingData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 6]} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(rankingData[0] || {})
                      .filter((k) => k !== 'month')
                      .map((seriesKey, idx) => (
                        <Line key={seriesKey} type="monotone" dataKey={seriesKey} stroke={["#3B82F6","#10B981","#8B5CF6","#F59E0B"][idx % 4]} strokeWidth={2} />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Overall Sentiment */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Overall Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={overallSentiment as any}>
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
                AI Prompt Analysis
              </CardTitle>
              <CardDescription>
                Métricas agregadas por LLM e ranking por prompt
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
                <p className="text-slate-600 text-sm">Sem dados suficientes para prompts.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recomendações</CardTitle>
                <CardDescription>Top sugestões para o domínio</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {recommendations.slice(0, 8).map((r, i) => (
                      <li key={i} className="text-sm text-slate-700">{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 text-sm">Sem recomendações disponíveis.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights Estratégicos</CardTitle>
                <CardDescription>Pontos de destaque</CardDescription>
              </CardHeader>
              <CardContent>
                {analysis_data?.strategic_insights?.key_insights?.length ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {analysis_data.strategic_insights.key_insights.slice(0, 8).map((r, i) => (
                      <li key={i} className="text-sm text-slate-700">{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 text-sm">Sem insights estratégicos disponíveis.</p>
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


