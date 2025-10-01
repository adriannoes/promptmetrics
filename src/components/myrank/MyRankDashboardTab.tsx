import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Heart, Trophy, Database } from 'lucide-react';
import { CompleteAnalysisResult } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';

interface MyRankDashboardTabProps {
  analysisData: CompleteAnalysisResult;
}

// Default fallback data
const defaultSentimentTrendData = [
  { month: 'Jan', Brand: 75, Competitor1: 68, Competitor2: 65 },
  { month: 'Feb', Brand: 76, Competitor1: 69, Competitor2: 66 },
  { month: 'Mar', Brand: 78, Competitor1: 70, Competitor2: 68 },
  { month: 'Apr', Brand: 77, Competitor1: 71, Competitor2: 68 },
  { month: 'May', Brand: 79, Competitor1: 70, Competitor2: 68 },
  { month: 'Jun', Brand: 78, Competitor1: 71, Competitor2: 68 },
];

const defaultRankingData = [
  { month: 'Jan', Brand: 2.1, Competitor1: 2.8, Competitor2: 3.2 },
  { month: 'Feb', Brand: 2.0, Competitor1: 2.7, Competitor2: 3.1 },
  { month: 'Mar', Brand: 1.9, Competitor1: 2.6, Competitor2: 3.0 },
  { month: 'Apr', Brand: 2.0, Competitor1: 2.5, Competitor2: 2.9 },
  { month: 'May', Brand: 1.8, Competitor1: 2.4, Competitor2: 2.8 },
  { month: 'Jun', Brand: 1.7, Competitor1: 2.3, Competitor2: 2.7 },
];

const defaultOverallSentimentData = [
  { name: 'Sua Marca', score: 77.6, color: '#3B82F6' },
  { name: 'Competitor1', score: 73.4, color: '#10B981' },
  { name: 'Competitor2', score: 68.8, color: '#8B5CF6' },
];

const defaultShareOfRankData = [
  { month: 'Jan', Brand: 35, Competitor1: 28, Competitor2: 22, Others: 15 },
  { month: 'Feb', Brand: 38, Competitor1: 26, Competitor2: 21, Others: 15 },
  { month: 'Mar', Brand: 42, Competitor1: 25, Competitor2: 20, Others: 13 },
  { month: 'Apr', Brand: 45, Competitor1: 24, Competitor2: 19, Others: 12 },
  { month: 'May', Brand: 48, Competitor1: 23, Competitor2: 18, Others: 11 },
  { month: 'Jun', Brand: 52, Competitor1: 22, Competitor2: 17, Others: 9 },
];

export const MyRankDashboardTab: React.FC<MyRankDashboardTabProps> = ({ analysisData }) => {
  // Extract data from analysisData or use defaults
  const analysisDataObj = analysisData?.analysis_data || {};
  const domain = analysisData?.domain || 'Your Brand';
  
  const sentimentTrendData = (analysisDataObj as any)?.sentiment_trends || defaultSentimentTrendData;
  const rankingData = (analysisDataObj as any)?.ranking_data || defaultRankingData;
  const overallSentimentData = (analysisDataObj as any)?.overall_sentiment || defaultOverallSentimentData;
  const shareOfRankData = (analysisDataObj as any)?.share_of_rank || defaultShareOfRankData;
  
  // Metrics from analysis data or computed from defaults
  const currentScore = (analysisDataObj as any)?.score || overallSentimentData[0]?.score || 77.6;
  const hasRealData = !!((analysisDataObj as any)?.sentiment_trends && (analysisDataObj as any)?.ranking_data);
  
  console.log('📊 MyRankDashboardTab: Using data:', { 
    domain, 
    hasRealData, 
    currentScore,
    dataKeys: Object.keys(analysisDataObj) 
  });

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Análise Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium">{analysisData.domain}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(analysisData.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <Badge variant={analysisData.status === 'completed' ? 'default' : 'secondary'}>
                {analysisData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pontuação Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {analysisData.analysis_data?.score || 0}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${analysisData.analysis_data?.score || 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {analysisData.status === 'completed' ? (
                <div className="text-green-600">
                  <div className="text-2xl font-bold">✓</div>
                  <div>Análise Completa</div>
                </div>
              ) : analysisData.status === 'processing' ? (
                <div className="text-yellow-600">
                  <div className="text-2xl font-bold">⏳</div>
                  <div>Processando...</div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-2xl font-bold">✗</div>
                  <div>Erro na Análise</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rankingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Brand" stroke="#3B82F6" strokeWidth={2} name="Sua Marca" />
                <Line type="monotone" dataKey="Competitor1" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Competitor2" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Share of #1 Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Participação no 1º Lugar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={shareOfRankData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 60]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Brand" stroke="#3B82F6" strokeWidth={2} name="Sua Marca" />
                <Line type="monotone" dataKey="Competitor1" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Competitor2" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="Others" stroke="#6B7280" strokeWidth={2} name="Outros" />
              </LineChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 85]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Brand" stroke="#3B82F6" strokeWidth={2} name="Sua Marca" />
                <Line type="monotone" dataKey="Competitor1" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Competitor2" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overallSentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {overallSentimentData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary and Recommendations */}
      {analysisData.analysis_data?.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{analysisData.analysis_data.summary}</p>
            
            {analysisData.analysis_data.recommendations && (
              <div>
                <h4 className="font-medium mb-3">Recomendações:</h4>
                <ul className="space-y-2">
                  {analysisData.analysis_data.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};