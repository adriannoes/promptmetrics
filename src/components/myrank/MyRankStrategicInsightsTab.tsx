import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompleteAnalysisResult } from '@/types/analysis';
import { Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface MyRankStrategicInsightsTabProps {
  analysisData: CompleteAnalysisResult;
}

export const MyRankStrategicInsightsTab: React.FC<MyRankStrategicInsightsTabProps> = ({ analysisData }) => {
  const { t } = useLanguage();
  const strategicInsights = analysisData?.analysis_data?.strategic_insights;

  const keyInsights = strategicInsights?.key_insights || [
    'Marca possui boa percepção geral nos sistemas de IA',
    'Oportunidades de melhoria em visibilidade digital',
    'Posicionamento competitivo pode ser fortalecido'
  ];

  const recommendations = strategicInsights?.recommendations || [
    'Investir em conteúdo otimizado para sistemas de IA',
    'Expandir presença em canais digitais relevantes',
    'Fortalecer estratégias de SEO e marketing de conteúdo'
  ];

  const actionItems = strategicInsights?.action_items || [
    'Criar calendário de conteúdo focado em IA',
    'Implementar estratégias de link building',
    'Desenvolver parcerias estratégicas'
  ];

  const growthOpportunities = strategicInsights?.growth_opportunities || [
    'Mercado em crescimento para soluções digitais',
    'Demanda crescente por automação',
    'Oportunidades de expansão internacional'
  ];

  const competitiveThreats = strategicInsights?.competitive_threats || [
    'Concorrentes investindo em tecnologia',
    'Novos players entrando no mercado',
    'Mudanças nas preferências dos consumidores'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('strategicInsights.title')}</h2>
        <p className="text-gray-600 mt-1">{t('strategicInsights.analysisFor')}: {analysisData.domain}</p>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            {t('strategicInsights.keyInsights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-800">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            {t('strategicInsights.recommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items & Growth Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              {t('strategicInsights.actionItems')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionItems.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              {t('strategicInsights.growthOpportunities')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {growthOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{opportunity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Threats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            {t('strategicInsights.competitiveThreats')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competitiveThreats.map((threat, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{threat}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('strategicInsights.strategicSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              {t('strategicInsights.analysisScore').replace('{score}', String(analysisData.analysis_data?.score || 0))}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {keyInsights.length}
                </div>
                <div className="text-sm text-gray-600">{t('strategicInsights.insightsIdentified')}</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {recommendations.length}
                </div>
                <div className="text-sm text-gray-600">{t('strategicInsights.recommendationsCount')}</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {actionItems.length}
                </div>
                <div className="text-sm text-gray-600">{t('strategicInsights.immediateActions')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};