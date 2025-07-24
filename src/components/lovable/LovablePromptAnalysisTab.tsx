import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Zap, TrendingUp } from 'lucide-react';
import type { AnalysisDataStructure } from '@/types/analysis';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: AnalysisDataStructure;
  created_at: string;
  updated_at: string;
}

interface LovablePromptAnalysisTabProps {
  analysisData: AnalysisResult | null;
}

export const LovablePromptAnalysisTab: React.FC<LovablePromptAnalysisTabProps> = ({ analysisData }) => {
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
  const promptAnalysis = data.prompt_analysis;

  if (!promptAnalysis) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No prompt analysis data available</p>
        </div>
      </div>
    );
  }

  const sentimentByLlm = promptAnalysis.sentiment_by_llm || {};
  const rankingByPrompt = promptAnalysis.ranking_by_prompt || {};
  const performanceMetrics = promptAnalysis.performance_metrics || {};

  return (
    <div className="space-y-8">
      {/* LLM Sentiment Analysis */}
      {Object.keys(sentimentByLlm).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              LLM Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(sentimentByLlm).map(([llm, analysis]) => (
                <div key={llm} className="border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">{llm}</h3>
                    <Badge variant="outline">{llm} Analysis</Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{analysis}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking by Prompt */}
      {Object.keys(rankingByPrompt).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Ranking by Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(rankingByPrompt).map(([prompt, rankings]) => (
                <div key={prompt} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">{prompt}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(rankings as Record<string, number>).map(([competitor, rank]) => (
                      <div key={competitor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{competitor}</span>
                        <Badge 
                          variant={rank === 1 ? "default" : "secondary"}
                          className={rank === 1 ? "bg-green-100 text-green-800" : ""}
                        >
                          #{rank}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {Object.keys(performanceMetrics).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(performanceMetrics).map(([metric, value]) => (
                <div key={metric} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};