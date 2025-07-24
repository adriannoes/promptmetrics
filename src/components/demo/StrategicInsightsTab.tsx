
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, TrendingUp, Award, Target, Calendar } from 'lucide-react';

// Esta versão do StrategicInsightsTab é usada apenas na página /demo e exibe dados estáticos simulando o domínio lovable.dev. Não depende de Supabase nem de autenticação.
export const StrategicInsightsTab = () => {
  const strategicInsights = {
    high_priority: [
      "Enhance AI-powered conversational development to stay ahead of competitors",
      "Implement advanced collaboration features for team-based development", 
      "Expand integration ecosystem with popular developer tools"
    ],
    medium_priority: [
      "Launch developer certification program",
      "Create premium template marketplace",
      "Develop enterprise-grade security features"
    ],
    opportunities: [
      "Capitalize on 45% annual growth in no-code market",
      "Target growing demand for rapid prototyping solutions", 
      "Expand into enterprise market with team collaboration features"
    ],
    timeline: [
      { quarter: "Q1 2024", focus: "Enhance AI capabilities and natural language processing", status: "in-progress" },
      { quarter: "Q2 2024", focus: "Launch certification program and expand template library", status: "planned" },
      { quarter: "Q3 2024", focus: "Implement advanced collaboration and integration features", status: "planned" },
      { quarter: "Q4 2024", focus: "Scale to enterprise market and optimize performance", status: "planned" }
    ],
    metrics: [
      { label: "Market Share Target", value: "15%", trend: "up", icon: Target },
      { label: "Developer Satisfaction", value: "95%", trend: "up", icon: Award },
      { label: "Platform Reliability", value: "99.9%", trend: "stable", icon: Zap },
      { label: "Monthly Active Projects", value: "50K", trend: "up", icon: TrendingUp }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Priority Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Zap className="w-5 h-5" />
              High Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strategicInsights.high_priority.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-red-800">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Award className="w-5 h-5" />
              Medium Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strategicInsights.medium_priority.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-yellow-800">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Market Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strategicInsights.opportunities.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-green-800">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Strategic Action Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicInsights.timeline.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <Badge variant={item.status === 'in-progress' ? 'default' : 'secondary'}>
                  {item.quarter}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.focus}</p>
                </div>
                <Badge 
                  variant={item.status === 'in-progress' ? 'default' : 'outline'}
                  className={item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                >
                  {item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Key Strategic Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategicInsights.metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                  <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${
                      metric.trend === 'up' ? 'text-green-700 border-green-200' : 
                      metric.trend === 'down' ? 'text-red-700 border-red-200' : 
                      'text-gray-700 border-gray-200'
                    }`}
                  >
                    {metric.trend === 'up' ? '↗ Growth' : 
                     metric.trend === 'down' ? '↘ Decline' : 
                     '→ Stable'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
