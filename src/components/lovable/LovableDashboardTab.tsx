import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Heart, Trophy } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Average Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Average Ranking Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Legend />
                  {Object.keys(rankingData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No ranking data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Share of #1 Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Share of #1 Rank per Competitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shareOfRankData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shareOfRankData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {Object.keys(shareOfRankData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No share of rank data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Sentiment Trends (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentimentTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {Object.keys(sentimentTrendData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No sentiment trend data available</p>
            )}
          </CardContent>
        </Card>

        {/* Overall Sentiment Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Overall Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overallSentimentData.length > 0 ? (
              <>
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
              </>
            ) : (
              <p className="text-gray-500 text-center py-12">No overall sentiment data available</p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Analysis Summary */}
      {data.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            {data.score && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Overall Score:</span>
                <span className="text-2xl font-bold text-blue-600">{data.score}/100</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};