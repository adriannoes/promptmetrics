
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Heart, Trophy, Database } from 'lucide-react';
import { CompleteAnalysisResult } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface MyRankDashboardTabProps {
  analysisData: CompleteAnalysisResult;
}

// Utility function to detect user's brand from data
const detectUserBrand = (data: any): string => {
  // Look for variations of user's brand name
  const possibleUserBrands = ['MinhaMarca', 'Brand', 'Sua Marca', 'Your Brand'];
  
  if (data?.sentiment_trends?.[0]) {
    const firstMonth = data.sentiment_trends[0];
    for (const brandName of possibleUserBrands) {
      if (brandName in firstMonth) {
        return brandName;
      }
    }
  }
  
  return 'MinhaMarca'; // fallback
};

// Utility function to get all competitors from data
const getCompetitors = (data: any): string[] => {
  if (!data?.sentiment_trends?.[0]) return [];
  
  const firstMonth = data.sentiment_trends[0];
  const userBrand = detectUserBrand(data);
  
  return Object.keys(firstMonth).filter(key => 
    key !== 'month' && key !== userBrand
  );
};

// Utility function to map brand names for display
const getBrandDisplayName = (brandName: string, t: any): string => {
  if (brandName === 'MinhaMarca' || brandName === 'Brand') {
    return t('dashboard.yourBrand') || 'Sua Marca';
  }
  return brandName;
};

// Generate colors for competitors
const generateColors = (competitors: string[]): Record<string, string> => {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];
  const colorMap: Record<string, string> = {};
  
  competitors.forEach((competitor, index) => {
    colorMap[competitor] = colors[index % colors.length];
  });
  
  return colorMap;
};

export const MyRankDashboardTab: React.FC<MyRankDashboardTabProps> = ({ analysisData }) => {
  const { t } = useLanguage();
  
  // Detect user brand and competitors dynamically
  const userBrand = detectUserBrand(analysisData?.analysis_data);
  const competitors = getCompetitors(analysisData?.analysis_data);
  const allBrands = [userBrand, ...competitors];
  const colorMap = generateColors(allBrands);
  
  console.log('🎯 Dashboard Tab - Detected brands:', { userBrand, competitors, allBrands });
  
  // Extract data from analysisData with dynamic brand detection
  const sentimentTrendData = analysisData?.analysis_data?.sentiment_trends || [];
  const rankingData = analysisData?.analysis_data?.ranking_data || [];
  const shareOfRankData = analysisData?.analysis_data?.share_of_rank || [];
  
  // Transform overall sentiment data to use display names
  const overallSentimentData = analysisData?.analysis_data?.overall_sentiment?.map(item => ({
    ...item,
    name: getBrandDisplayName(item.name, t),
    color: item.color || colorMap[item.name] || '#6B7280'
  })) || allBrands.map((brand, index) => ({
    name: getBrandDisplayName(brand, t),
    score: 75 + (index * 5), // fallback scores
    color: colorMap[brand] || '#6B7280'
  }));

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              {t('dashboard.currentAnalysis')}
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
            <CardTitle className="text-lg">{t('dashboard.overallScore')}</CardTitle>
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
            <CardTitle className="text-lg">{t('dashboard.status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {analysisData.status === 'completed' ? (
                <div className="text-green-600">
                  <div className="text-2xl font-bold">✓</div>
                  <div>{t('dashboard.analysisComplete')}</div>
                </div>
              ) : analysisData.status === 'processing' ? (
                <div className="text-yellow-600">
                  <div className="text-2xl font-bold">⏳</div>
                  <div>{t('dashboard.processing')}</div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-2xl font-bold">✗</div>
                  <div>{t('dashboard.analysisError')}</div>
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
              {t('dashboard.avgRankingOverTime')}
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
                {allBrands.map((brand, index) => (
                  <Line 
                    key={brand}
                    type="monotone" 
                    dataKey={brand} 
                    stroke={colorMap[brand]} 
                    strokeWidth={2} 
                    name={getBrandDisplayName(brand, t)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Share of #1 Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              {t('dashboard.shareOfFirstPlace')}
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
                {allBrands.map((brand, index) => (
                  <Line 
                    key={brand}
                    type="monotone" 
                    dataKey={brand} 
                    stroke={colorMap[brand]} 
                    strokeWidth={2} 
                    name={getBrandDisplayName(brand, t)}
                  />
                ))}
                {shareOfRankData.length > 0 && 'Others' in shareOfRankData[0] && (
                  <Line 
                    type="monotone" 
                    dataKey="Others" 
                    stroke="#6B7280" 
                    strokeWidth={2} 
                    name={t('dashboard.others')}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {t('dashboard.sentimentTrends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Legend />
                {allBrands.map((brand, index) => (
                  <Line 
                    key={brand}
                    type="monotone" 
                    dataKey={brand} 
                    stroke={colorMap[brand]} 
                    strokeWidth={2} 
                    name={getBrandDisplayName(brand, t)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Sentiment Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              {t('dashboard.overallSentimentScore')}
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
              {overallSentimentData.map((item) => (
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
            <CardTitle>{t('dashboard.analysisSummary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{analysisData.analysis_data.summary}</p>
            
            {analysisData.analysis_data.recommendations && (
              <div>
                <h4 className="font-medium mb-3">{t('dashboard.recommendations')}</h4>
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
