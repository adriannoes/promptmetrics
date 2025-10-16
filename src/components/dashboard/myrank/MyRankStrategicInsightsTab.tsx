import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompleteAnalysisResult } from '@/types/analysis';
import { Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MyRankStrategicInsightsTabProps {
  analysisData: CompleteAnalysisResult;
}

export const MyRankStrategicInsightsTab: React.FC<MyRankStrategicInsightsTabProps> = ({ analysisData }) => {
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
        <h2 className="text-2xl font-bold text-gray-900">Insights Estratégicos</h2>
        <p className="text-gray-600 mt-1">Análise estratégica para: {analysisData.domain}</p>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Insights Principais
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
            <Target className="w-5 h-5 text-blue-600" />
            Recomendações Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Recomendações Principais
              </h4>
              <ul className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Ações Imediatas
              </h4>
              <ul className="space-y-3">
                {actionItems.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities vs Threats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Oportunidades de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Oportunidade
                  </Badge>
                  <p className="text-gray-700 text-sm flex-1">{opportunity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Ameaças Competitivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitiveThreats.map((threat, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    Ameaça
                  </Badge>
                  <p className="text-gray-700 text-sm flex-1">{threat}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Estratégico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Com base na análise realizada, {analysisData.domain} possui uma{' '}
              <strong>pontuação geral de {analysisData.analysis_data?.score || 0}/100</strong> nos sistemas de IA.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {keyInsights.length}
                </div>
                <div className="text-sm text-gray-600">Insights Identificados</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {recommendations.length}
                </div>
                <div className="text-sm text-gray-600">Recomendações</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {actionItems.length}
                </div>
                <div className="text-sm text-gray-600">Ações Imediatas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};