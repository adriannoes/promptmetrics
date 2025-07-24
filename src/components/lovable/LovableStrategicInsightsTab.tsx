import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, CheckCircle, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import type { AnalysisDataStructure } from '@/types/analysis';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: AnalysisDataStructure;
  created_at: string;
  updated_at: string;
}

interface LovableStrategicInsightsTabProps {
  analysisData: AnalysisResult | null;
}

export const LovableStrategicInsightsTab: React.FC<LovableStrategicInsightsTabProps> = ({ analysisData }) => {
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
  const strategicInsights = data.strategic_insights;

  if (!strategicInsights) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No strategic insights data available</p>
        </div>
      </div>
    );
  }

  const keyInsights = strategicInsights.key_insights || [];
  const actionItems = strategicInsights.action_items || [];
  const growthOpportunities = strategicInsights.growth_opportunities || [];
  const competitiveThreats = strategicInsights.competitive_threats || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Strategic Insights</h2>
        <p className="text-gray-600 mt-1">Analysis for: {analysisData.domain}</p>
      </div>

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 flex-1">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Opportunities & Competitive Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Opportunities */}
        {growthOpportunities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {growthOpportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{opportunity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Competitive Threats */}
        {competitiveThreats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Competitive Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitiveThreats.map((threat, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{threat}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overall Summary */}
      {data.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Strategic Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            {data.score && (
              <div className="mt-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{data.score}</div>
                  <div className="text-sm text-gray-600">Overall Analysis Score</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};