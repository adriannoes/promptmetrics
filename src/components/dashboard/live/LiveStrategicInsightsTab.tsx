import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Target, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface LiveStrategicInsightsTabProps {
  analysisData: AnalysisResult | null;
  loading: boolean;
}

export const LiveStrategicInsightsTab: React.FC<LiveStrategicInsightsTabProps> = ({ analysisData, loading }) => {
  const strategicInsights = analysisData?.analysis_data?.strategic_insights || {};
  const recommendations = strategicInsights.recommendations || [];
  const opportunities = strategicInsights.opportunities || [];
  const threats = strategicInsights.threats || [];
  const keyFindings = strategicInsights.key_findings || [];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analysisData || !analysisData.analysis_data || Object.keys(strategicInsights).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Strategic Insights Available</h3>
        <p className="text-muted-foreground">
          Strategic insights and recommendations will appear here once the analysis is completed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Findings */}
      {keyFindings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Key Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keyFindings.map((finding: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">{finding.title || `Finding ${index + 1}`}</h4>
                    <p className="text-sm text-muted-foreground">{finding.description}</p>
                    {finding.impact && (
                      <Badge 
                        variant={
                          finding.impact === 'high' ? 'default' :
                          finding.impact === 'medium' ? 'secondary' : 'outline'
                        }
                        className="mt-2"
                      >
                        {finding.impact} impact
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">{recommendation.title || `Recommendation ${index + 1}`}</h4>
                  <p className="text-muted-foreground mb-3">{recommendation.description}</p>
                  
                  {recommendation.priority && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Priority:</span>
                      <Badge variant={
                        recommendation.priority === 'high' ? 'destructive' :
                        recommendation.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {recommendation.priority}
                      </Badge>
                    </div>
                  )}
                  
                  {recommendation.effort && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Effort Required:</span>
                      <Badge variant="outline">{recommendation.effort}</Badge>
                    </div>
                  )}

                  {recommendation.steps && recommendation.steps.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Action Steps:</h5>
                      <ul className="space-y-1">
                        {recommendation.steps.map((step: string, stepIndex: number) => (
                          <li key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">{stepIndex + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {opportunities.map((opportunity: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">{opportunity.title || `Opportunity ${index + 1}`}</h4>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    {opportunity.potential_impact && (
                      <Badge variant="default" className="mt-2">
                        {opportunity.potential_impact} potential
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threats & Risks */}
      {threats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Threats & Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {threats.map((threat: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">{threat.title || `Risk ${index + 1}`}</h4>
                    <p className="text-sm text-muted-foreground">{threat.description}</p>
                    {threat.severity && (
                      <Badge 
                        variant={
                          threat.severity === 'high' ? 'destructive' :
                          threat.severity === 'medium' ? 'secondary' : 'outline'
                        }
                        className="mt-2"
                      >
                        {threat.severity} severity
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Summary */}
      {strategicInsights.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {strategicInsights.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};