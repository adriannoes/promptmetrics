
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, MessageSquare } from 'lucide-react';

export const StrategicInsightsTab: React.FC = () => {
  const insights = [
    {
      title: "Customer Satisfaction Trend",
      description: "Overall satisfaction has increased by 15% this quarter",
      impact: "High",
      trend: "up",
      icon: TrendingUp,
      metrics: { current: 4.2, previous: 3.7 }
    },
    {
      title: "Feature Request Surge",
      description: "Integration requests have tripled in the past month",
      impact: "Medium",
      trend: "up",
      icon: MessageSquare,
      metrics: { current: 120, previous: 40 }
    },
    {
      title: "User Engagement Drop",
      description: "Mobile app engagement decreased by 8%",
      impact: "High",
      trend: "down",
      icon: TrendingDown,
      metrics: { current: 65, previous: 70 }
    }
  ];

  const recommendations = [
    {
      priority: "High",
      title: "Address Mobile UX Issues",
      description: "Focus on improving mobile app user experience based on negative feedback patterns",
      effort: "High",
      impact: "High"
    },
    {
      priority: "Medium",
      title: "Expand Integration Options",
      description: "Develop more third-party integrations to meet increasing demand",
      effort: "Medium",
      impact: "High"
    },
    {
      priority: "Low",
      title: "Enhance Documentation",
      description: "Improve help docs to reduce support ticket volume",
      effort: "Low",
      impact: "Medium"
    }
  ];

  const renderInsightCard = (insight: any, index: number) => (
    <Card key={index}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{insight.title}</CardTitle>
        <insight.icon className={`h-5 w-5 ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant={insight.impact === 'High' ? 'destructive' : 'secondary'}>
            {insight.impact} Impact
          </Badge>
          <div className="text-right">
            <div className="text-lg font-bold">
              {typeof insight.metrics.current === 'number' && insight.metrics.current < 10 
                ? insight.metrics.current.toFixed(1) 
                : insight.metrics.current}
            </div>
            <div className={`text-xs ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {insight.trend === 'up' ? '+' : ''}
              {((insight.metrics.current - insight.metrics.previous) / insight.metrics.previous * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRecommendationCard = (rec: any, index: number) => (
    <Card key={index}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{rec.title}</CardTitle>
          <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
            {rec.priority}
          </Badge>
        </div>
        <CardDescription>{rec.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Effort Required</span>
              <span>{rec.effort}</span>
            </div>
            <Progress value={rec.effort === 'High' ? 80 : rec.effort === 'Medium' ? 50 : 20} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Expected Impact</span>
              <span>{rec.impact}</span>
            </div>
            <Progress value={rec.impact === 'High' ? 80 : rec.impact === 'Medium' ? 50 : 20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights Overview
          </CardTitle>
          <CardDescription>AI-generated insights from your prompt analysis data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map(renderInsightCard)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Strategic Recommendations
          </CardTitle>
          <CardDescription>Actionable recommendations based on data analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(renderRecommendationCard)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Positive Sentiment</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Neutral Sentiment</span>
                <span>25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Negative Sentiment</span>
                <span>10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Accuracy</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">94%</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">User Satisfaction</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">4.2</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing Speed</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">1.2s</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
