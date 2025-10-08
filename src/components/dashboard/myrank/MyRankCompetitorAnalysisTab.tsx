import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompleteAnalysisResult } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Lightbulb, CheckCircle, AlertTriangle, ArrowUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MyRankCompetitorAnalysisTabProps {
  analysisData: CompleteAnalysisResult;
}

export const MyRankCompetitorAnalysisTab: React.FC<MyRankCompetitorAnalysisTabProps> = ({ analysisData }) => {
  const competitorAnalysis = analysisData?.analysis_data?.competitor_analysis;

  // Default fallback data
  const marketShareData = competitorAnalysis?.market_share || [
    { name: 'Sua Marca', value: 35, color: '#3B82F6' },
    { name: 'Concorrente 1', value: 25, color: '#10B981' },
    { name: 'Concorrente 2', value: 20, color: '#8B5CF6' },
    { name: 'Outros', value: 20, color: '#6B7280' },
  ];

  const marketTrendsData = competitorAnalysis?.market_trends || [
    { month: 'Jan', 'Sua Marca': 32, 'Concorrente 1': 28, 'Concorrente 2': 22, 'Outros': 18 },
    { month: 'Feb', 'Sua Marca': 33, 'Concorrente 1': 27, 'Concorrente 2': 21, 'Outros': 19 },
    { month: 'Mar', 'Sua Marca': 34, 'Concorrente 1': 26, 'Concorrente 2': 21, 'Outros': 19 },
    { month: 'Apr', 'Sua Marca': 35, 'Concorrente 1': 25, 'Concorrente 2': 20, 'Outros': 20 },
    { month: 'May', 'Sua Marca': 35, 'Concorrente 1': 25, 'Concorrente 2': 20, 'Outros': 20 },
    { month: 'Jun', 'Sua Marca': 35, 'Concorrente 1': 25, 'Concorrente 2': 20, 'Outros': 20 },
  ];

  const strategicPriorities = competitorAnalysis?.strategic_priorities || [
    {
      id: 1,
      title: 'Fortalecer posicionamento competitivo',
      description: 'Baseado na análise atual, focar em diferenciais únicos da marca.',
      priority: 'high' as const,
      marketShare: 35.0
    },
    {
      id: 2,
      title: 'Expandir presença digital',
      description: 'Aumentar visibilidade em canais digitais e sistemas de IA.',
      priority: 'medium' as const,
      marketShare: 25.0
    }
  ];

  const opportunities = competitorAnalysis?.opportunities || [
    {
      category: 'Desenvolvimento de Produto',
      title: 'Aproveitar pontos fortes únicos para diferenciação competitiva.',
      description: 'Identificar e potencializar características que distinguem a marca dos concorrentes...',
      impact: 'high' as const,
      effort: 'medium' as const
    },
    {
      category: 'Expansão de Mercado',
      title: 'Explorar segmentos com menor concorrência.',
      description: 'Identificar nichos de mercado onde a concorrência é menor...',
      impact: 'medium' as const,
      effort: 'low' as const
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'medium': return <ArrowUp className="w-4 h-4 text-yellow-600" />;
      case 'low': return <ArrowUp className="w-4 h-4 text-green-600" />;
      default: return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Análise Competitiva</h2>
        <p className="text-gray-600 mt-1">Analisando: {analysisData.domain}</p>
      </div>

      {/* Market Position & Strategic Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Prioridades Estratégicas
              </CardTitle>
              <p className="text-sm text-gray-600">Baseado na análise atual da sua marca.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicPriorities.map((priority) => (
                  <div key={priority.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {priority.id}
                          </span>
                          <h3 className="font-semibold text-gray-900">{priority.title}</h3>
                          <Badge className={getPriorityColor(priority.priority)}>
                            {priority.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm ml-9">{priority.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{priority.marketShare}%</div>
                        <div className="text-xs text-gray-500">participação</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Share by Platform */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participação de Mercado</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {marketShareData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Tendências de Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 40]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Sua Marca" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Concorrente 1" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="Concorrente 2" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey="Outros" stroke="#6B7280" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Oportunidades Competitivas
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Baseado na análise atual da sua marca.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1">
                    {getImpactIcon(opportunity.impact)}
                    <Badge variant="outline" className="text-xs">
                      {opportunity.category}
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-3 leading-tight">
                  {opportunity.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {opportunity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Impacto:</span>
                    <Badge className={`text-xs ${
                      opportunity.impact === 'high' ? 'bg-red-100 text-red-800' :
                      opportunity.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {opportunity.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Esforço:</span>
                    <Badge variant="outline" className="text-xs">
                      {opportunity.effort}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Recomendações Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                Oportunidades de Crescimento
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Fortalecer diferenciais competitivos únicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Expandir presença em canais digitais estratégicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Desenvolver parcerias estratégicas</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                Ameaças Competitivas
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Monitorar movimentos da concorrência</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Proteger participação de mercado atual</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Inovar para manter vantagem competitiva</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};