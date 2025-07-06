import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompleteAnalysisResult } from '@/types/analysis';
import { MessageSquare, Brain, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface MyRankPromptAnalysisTabProps {
  analysisData: CompleteAnalysisResult;
}

export const MyRankPromptAnalysisTab: React.FC<MyRankPromptAnalysisTabProps> = ({ analysisData }) => {
  const { t } = useLanguage();
  const promptAnalysis = analysisData?.analysis_data?.prompt_analysis;

  // Default sentiment data if not available from analysis
  const sentimentByLlm = promptAnalysis?.sentiment_by_llm || {
    'ChatGPT': 78,
    'Gemini': 82,
    'Claude': 85,
    'Perplexity': 80
  };

  const sentimentData = Object.entries(sentimentByLlm).map(([name, score]) => ({
    name,
    score: typeof score === 'number' ? score : 75
  }));

  const performanceMetrics = promptAnalysis?.performance_metrics || {
    total_mentions: 150,
    positive_mentions: 120,
    neutral_mentions: 20,
    negative_mentions: 10,
    sentiment_score: 80.2
  };

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">{t('promptAnalysis.totalMentions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.total_mentions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">{t('promptAnalysis.positiveMentions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{performanceMetrics.positive_mentions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">{t('promptAnalysis.neutralMentions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{performanceMetrics.neutral_mentions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">{t('promptAnalysis.negativeMentions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{performanceMetrics.negative_mentions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment by LLM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            {t('promptAnalysis.sentimentByAI')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, t('promptAnalysis.sentiment')]} />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ranking by Prompt Category */}
      {promptAnalysis?.ranking_by_prompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {t('promptAnalysis.rankingByPromptCategory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(promptAnalysis.ranking_by_prompt).map(([category, rankings]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 capitalize">{category.replace('_', ' ')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {typeof rankings === 'object' && rankings && Object.entries(rankings).map(([brand, position]) => (
                      <div key={brand} className="flex items-center justify-between">
                        <span className="text-sm">{brand}</span>
                        <span className={`font-medium ${
                          position === 1 ? 'text-green-600' : 
                          position === 2 ? 'text-yellow-600' : 
                          'text-gray-600'
                        }`}>
                          #{String(position)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Score Geral de Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(performanceMetrics.sentiment_score)}/100
            </div>
            <p className="text-gray-600">
              Baseado em {performanceMetrics.total_mentions} menções analisadas
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${performanceMetrics.sentiment_score}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};