import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Target, Lightbulb, ArrowUp, Eye } from 'lucide-react';
import type { AnalysisDataStructure } from '@/types/analysis';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: AnalysisDataStructure;
  created_at: string;
  updated_at: string;
}

interface LovableCompetitorAnalysisTabProps {
  analysisData: AnalysisResult | null;
}

export const LovableCompetitorAnalysisTab: React.FC<LovableCompetitorAnalysisTabProps> = ({ analysisData }) => {
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
  const competitorAnalysis = data.competitor_analysis;

  if (!competitorAnalysis) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No competitor analysis data available</p>
        </div>
      </div>
    );
  }

  const marketShare = competitorAnalysis.market_share || [];
  const strategicPriorities = competitorAnalysis.strategic_priorities || [];
  const opportunities = competitorAnalysis.opportunities || [];
  const strengths = competitorAnalysis.strengths || [];
  const weaknesses = competitorAnalysis.weaknesses || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Business Landscape Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Landscape</h2>
          <p className="text-gray-600 mt-1">Analyzing: {analysisData.domain}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Export to PDF
          </Button>
        </div>
      </div>

      {/* Strategic Priorities & Market Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {strategicPriorities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Strategic Priorities
                </CardTitle>
                <p className="text-sm text-gray-600">Based on current analysis of your brand.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategicPriorities.map((priority, index) => (
                    <div key={priority.id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {priority.id || index + 1}
                            </span>
                            <h3 className="font-semibold text-gray-900">{priority.title}</h3>
                            <Badge className={getPriorityColor(priority.priority)}>
                              {priority.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm ml-9">{priority.description}</p>
                        </div>
                        {priority.marketShare && (
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{priority.marketShare}%</div>
                            <div className="text-xs text-gray-500">market share</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Market Share by Platform */}
        <div>
          {marketShare.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Share by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={marketShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {marketShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {marketShare.map((item) => (
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
          )}
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          {strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <ArrowUp className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Weaknesses */}
          {weaknesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <ArrowUp className="w-5 h-5 rotate-180" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Business Opportunities
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Based on current analysis of your brand.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {opportunity.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3 leading-tight">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Impact:</span>
                      <Badge className={`text-xs ${
                        opportunity.impact === 'high' ? 'bg-red-100 text-red-800' :
                        opportunity.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {opportunity.impact}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Effort:</span>
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
      )}
    </div>
  );
};