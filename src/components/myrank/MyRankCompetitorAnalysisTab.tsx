
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompleteAnalysisResult } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Lightbulb, CheckCircle, AlertTriangle, ArrowUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface MyRankCompetitorAnalysisTabProps {
  analysisData: CompleteAnalysisResult;
}

// Utility function to detect user's brand from data
const detectUserBrand = (data: any): string => {
  const possibleUserBrands = ['MinhaMarca', 'Brand', 'Sua Marca', 'Your Brand'];
  
  if (data?.market_share?.[0]) {
    for (const brandName of possibleUserBrands) {
      const found = data.market_share.find((item: any) => item.name === brandName);
      if (found) return brandName;
    }
  }
  
  return 'MinhaMarca'; // fallback
};

// Utility function to map brand names for display
const getBrandDisplayName = (brandName: string, t: any): string => {
  if (brandName === 'MinhaMarca' || brandName === 'Brand') {
    return t('dashboard.yourBrand') || 'Sua Marca';
  }
  return brandName;
};

export const MyRankCompetitorAnalysisTab: React.FC<MyRankCompetitorAnalysisTabProps> = ({ analysisData }) => {
  const { t } = useLanguage();
  const competitorAnalysis = analysisData?.analysis_data?.competitor_analysis;

  console.log('🏆 Competitor Analysis Tab - Data:', competitorAnalysis);

  const userBrand = detectUserBrand(competitorAnalysis);

  // Use real data from analysis or fallback to reasonable defaults
  const marketShareData = competitorAnalysis?.market_share?.map(item => ({
    ...item,
    name: getBrandDisplayName(item.name, t)
  })) || [
    { name: getBrandDisplayName(userBrand, t), value: 35, color: '#3B82F6' },
    { name: 'Concorrente 1', value: 25, color: '#10B981' },
    { name: 'Concorrente 2', value: 20, color: '#8B5CF6' },
    { name: t('dashboard.others'), value: 20, color: '#6B7280' },
  ];

  // Transform market trends data to use display names
  const marketTrendsData = competitorAnalysis?.market_trends || analysisData?.analysis_data?.sentiment_trends?.map(item => {
    const transformed: any = { month: item.month };
    Object.keys(item).forEach(key => {
      if (key !== 'month') {
        transformed[getBrandDisplayName(key, t)] = item[key];
      }
    });
    return transformed;
  }) || [];

  // Use real strategic priorities or create from analysis data
  const strategicPriorities = competitorAnalysis?.strategic_priorities || [
    {
      id: 1,
      title: 'Fortalecer posicionamento competitivo',
      description: 'Baseado na análise atual, focar em diferenciais únicos da marca.',
      priority: 'high' as const,
      marketShare: marketShareData.find(item => item.name.includes('Sua Marca') || item.name.includes('Your Brand'))?.value || 35
    },
    {
      id: 2,
      title: 'Expandir presença digital',
      description: 'Aumentar visibilidade em canais digitais e sistemas de IA.',
      priority: 'medium' as const,
      marketShare: 25.0
    }
  ];

  // Use real opportunities or create from analysis data
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

  // Get strengths and weaknesses from real analysis data
  const strengths = competitorAnalysis?.strengths || [
    'Marca possui diferenciais únicos no mercado',
    'Boa percepção geral nos sistemas de IA',
    'Posicionamento competitivo sólido'
  ];

  const weaknesses = competitorAnalysis?.weaknesses || [
    'Oportunidades de melhoria em visibilidade digital',
    'Necessidade de fortalecer estratégias de marketing',
    'Possível gap em alguns segmentos competitivos'
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return t('competitorAnalysis.high') || 'Alta';
      case 'medium': return t('competitorAnalysis.medium') || 'Média';
      case 'low': return t('competitorAnalysis.low') || 'Baixa';
      default: return priority;
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
        <h2 className="text-2xl font-bold text-gray-900">{t('competitorAnalysis.title')}</h2>
        <p className="text-gray-600 mt-1">{t('competitorAnalysis.analyzing')}: {analysisData.domain}</p>
      </div>

      {/* Market Position & Strategic Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                {t('competitorAnalysis.strategicPriorities')}
              </CardTitle>
              <p className="text-sm text-gray-600">{t('competitorAnalysis.basedOnCurrentAnalysis')}</p>
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
                            {getPriorityLabel(priority.priority)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm ml-9">{priority.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{priority.marketShare}%</div>
                        <div className="text-xs text-gray-500">{t('competitorAnalysis.participation')}</div>
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
              <CardTitle className="text-lg">{t('competitorAnalysis.marketShare')}</CardTitle>
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
                  <Tooltip formatter={(value) => [`${value}%`, t('competitorAnalysis.participation')]} />
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

      {/* Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              {t('competitorAnalysis.strengthsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              {t('competitorAnalysis.improvementAreasTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{weakness}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Trends */}
      {marketTrendsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {t('competitorAnalysis.marketTrends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[15, 100]} />
                <Tooltip />
                <Legend />
                {/* Render lines for each competitor dynamically */}
                {Object.keys(marketTrendsData[0] || {}).filter(key => key !== 'month').map((competitor, index) => {
                  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#6B7280'];
                  return (
                    <Line 
                      key={competitor}
                      type="monotone" 
                      dataKey={competitor} 
                      stroke={colors[index % colors.length]} 
                      strokeWidth={2} 
                      name={competitor}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            {t('competitorAnalysis.opportunities')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{opportunity.category}</Badge>
                      <div className="flex items-center gap-2">
                        {getImpactIcon(opportunity.impact)}
                        <span className="text-sm font-medium text-gray-600">
                          {t('competitorAnalysis.impact')}: {getPriorityLabel(opportunity.impact)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        {t('competitorAnalysis.effort')}: {getPriorityLabel(opportunity.effort)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                    <p className="text-gray-600 text-sm">{opportunity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
