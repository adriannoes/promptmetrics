import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Heart, Trophy, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface LiveDashboardTabProps {
  analysisData: AnalysisResult | null;
  loading: boolean;
}

export const LiveDashboardTab: React.FC<LiveDashboardTabProps> = ({ analysisData, loading }) => {
  // Extract data from analysis_data or use fallback
  const sentimentTrendData = analysisData?.analysis_data?.sentiment_trends || [];
  const rankingData = analysisData?.analysis_data?.ranking_data || [];
  const overallSentimentData = analysisData?.analysis_data?.overall_sentiment || [];
  const shareOfRankData = analysisData?.analysis_data?.share_of_rank || [];

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Progress Indicator */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Carregando dados de análise</p>
                  <p className="text-sm text-slate-600">Processando informações do seu domínio...</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Por favor aguarde</p>
              </div>
            </div>
            <Progress value={undefined} className="w-full" />
          </CardContent>
        </Card>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-[280px] w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analysisData || !analysisData.analysis_data) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum dado de análise disponível</h3>
              <p className="text-muted-foreground mb-6">
                {analysisData?.status === 'processing'
                  ? 'Sua análise está sendo processada. Os dados estarão disponíveis em breve.'
                  : 'Execute uma análise completa para visualizar os dados do seu domínio.'
                }
              </p>

              {analysisData?.status === 'processing' && (
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Progresso da análise</span>
                    <span className="text-sm font-medium text-blue-600">Processando...</span>
                  </div>
                  <Progress value={undefined} className="w-full" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4" />
                  Atualizar Página
                </Button>
                {(!analysisData || analysisData.status !== 'processing') && (
                  <Button
                    onClick={() => window.location.href = '/analysis'}
                    className="flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Iniciar Análise
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Ranking Médio ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip
                    labelFormatter={(label) => `Mês: ${label}`}
                    formatter={(value, name) => [value, `Ranking ${name}`]}
                  />
                  <Legend />
                  {Object.keys(rankingData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4]}
                      strokeWidth={2}
                      dot={{ fill: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
                <Target className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium mb-2">Dados de ranking não disponíveis</p>
                <p className="text-sm text-slate-500">Execute uma análise completa para visualizar tendências de ranking</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Share of #1 Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Participação no 1º Lugar por Concorrente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shareOfRankData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shareOfRankData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip
                    labelFormatter={(label) => `Mês: ${label}`}
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                  <Legend />
                  {Object.keys(shareOfRankData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4]}
                      strokeWidth={2}
                      dot={{ fill: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
                <Trophy className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium mb-2">Dados de participação não disponíveis</p>
                <p className="text-sm text-slate-500">Complete uma análise para ver participação no ranking</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Tendências de Sentimento (6 Meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentimentTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip
                    labelFormatter={(label) => `Mês: ${label}`}
                    formatter={(value, name) => [`${value}%`, `Sentimento ${name}`]}
                  />
                  <Legend />
                  {Object.keys(sentimentTrendData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4]}
                      strokeWidth={2}
                      dot={{ fill: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
                <TrendingUp className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium mb-2">Dados de sentimento não disponíveis</p>
                <p className="text-sm text-slate-500">Execute uma análise para visualizar tendências de sentimento</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Sentiment Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Pontuação Geral de Sentimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overallSentimentData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={overallSentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} unit="%" />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Pontuação']}
                      labelFormatter={(label) => label}
                    />
                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {overallSentimentData.map((item: any, index: number) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index % 4] }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
                <Heart className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium mb-2">Dados de sentimento não disponíveis</p>
                <p className="text-sm text-slate-500">Complete uma análise para visualizar pontuações de sentimento</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};