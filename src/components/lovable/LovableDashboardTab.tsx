import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Heart, Trophy, Brain, Sparkles, BarChart3, Zap, Code2, Globe } from 'lucide-react';
import type { AnalysisDataStructure } from '@/types/analysis';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: AnalysisDataStructure;
  created_at: string;
  updated_at: string;
}

interface LovableDashboardTabProps {
  analysisData: AnalysisResult | null;
}

export const LovableDashboardTab: React.FC<LovableDashboardTabProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.analysis_data) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No analysis data available</p>
        </div>
      </div>
    );
  }

  const data = analysisData.analysis_data;
  
  // Usar dados reais ou fallback
  const sentimentTrendData = data.sentiment_trends || [];
  const rankingData = data.ranking_data || [];
  const overallSentimentData = data.overall_sentiment || [];
  const shareOfRankData = data.share_of_rank || [];

  return (
    <div className="space-y-6">
      {/* Header Stats with Modern Design matching DemoPM3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Overall Score</CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-2">{data.score || 'N/A'}<span className="text-lg text-blue-600">/100</span></div>
            <Progress value={data.score || 0} className="mt-2 h-2" />
            <p className="text-xs text-blue-600 mt-2">AI Platform Excellence</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Platform Type</CardTitle>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Code2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 mb-2">No-Code</div>
            <p className="text-xs text-purple-600">AI Development Platform</p>
            <Badge className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-200">Leading Innovation</Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Market Focus</CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 mb-2">AI-First</div>
            <p className="text-xs text-green-600">Development Tools</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Emerging Leader</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">AI Confidence</CardTitle>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 mb-2">High<span className="text-lg text-orange-600"></span></div>
            <p className="text-xs text-orange-600">Above average performance</p>
            <div className="flex items-center gap-1 mt-2">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-600">Strong Recognition</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              AI Sentiment Trends
            </CardTitle>
            <CardDescription>Platform perception over time</CardDescription>
          </CardHeader>
          <CardContent>
            {sentimentTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  {Object.keys(sentimentTrendData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={`hsl(${index * 80 + 220}, 70%, 50%)`}
                      strokeWidth={index === 0 ? 3 : 2}
                      dot={{ fill: `hsl(${index * 80 + 220}, 70%, 50%)`, r: index === 0 ? 6 : 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No sentiment trend data available</p>
            )}
          </CardContent>
        </Card>

        {/* Ranking Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Ranking Position Trends  
            </CardTitle>
            <CardDescription>Lower is better • Competitive positioning</CardDescription>
          </CardHeader>
          <CardContent>
            {rankingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis domain={[1, 5]} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  {Object.keys(rankingData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={`hsl(${index * 80 + 220}, 70%, 50%)`}
                      strokeWidth={index === 0 ? 3 : 2}
                      dot={{ fill: `hsl(${index * 80 + 220}, 70%, 50%)`, r: index === 0 ? 6 : 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No ranking data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Share */}
      {shareOfRankData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Market Share Evolution
            </CardTitle>
            <CardDescription>Lovable.dev's growing presence in AI development space</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={shareOfRankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                {Object.keys(shareOfRankData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                  <Area 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stackId="1" 
                    stroke={`hsl(${index * 80 + 220}, 70%, 50%)`} 
                    fill={`hsl(${index * 80 + 220}, 70%, 50%)`} 
                    fillOpacity={0.8} 
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      {data.summary && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 leading-relaxed">{data.summary}</p>
            <div className="flex items-center gap-2 mt-4">
              <Badge className="bg-blue-100 text-blue-700">AI Platform</Badge>
              <Badge className="bg-purple-100 text-purple-700">No-Code Leader</Badge>
              <Badge className="bg-green-100 text-green-700">Innovation Focused</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};