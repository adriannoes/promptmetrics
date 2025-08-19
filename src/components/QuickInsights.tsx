import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Target, 
  MessageSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface QuickInsightsProps {
  domain?: string;
  data?: any;
  compact?: boolean;
  className?: string;
}

const quickInsights = [
  {
    id: 'sentiment-trend',
    title: 'Sentiment Rising',
    description: 'AI sentiment improved by 12% this month',
    icon: TrendingUp,
    value: '+12%',
    trend: 'positive',
    priority: 'high'
  },
  {
    id: 'visibility-gap',
    title: 'Visibility Gap',
    description: 'Lower visibility in competitor analysis',
    icon: Eye,
    value: '68/100',
    trend: 'neutral',
    priority: 'medium'
  },
  {
    id: 'content-freshness',
    title: 'Content Freshness',
    description: 'Recent content updates detected',
    icon: Clock,
    value: '3 days ago',
    trend: 'positive',
    priority: 'low'
  },
  {
    id: 'competitive-edge',
    title: 'Competitive Edge',
    description: 'Leading in AI sentiment vs competitors',
    icon: Target,
    value: '#1',
    trend: 'positive',
    priority: 'high'
  }
];

export const QuickInsights: React.FC<QuickInsightsProps> = ({
  domain = 'your domain',
  data,
  compact = false,
  className = ''
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      default: return MessageSquare;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive': return 'text-green-600 bg-green-100/80';
      case 'negative': return 'text-red-600 bg-red-100/80';
      default: return 'text-slate-600 bg-slate-100/80';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/60';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/60';
      case 'low': return 'border-l-green-500 bg-green-50/60';
      default: return 'border-l-slate-500 bg-slate-50/60';
    }
  };

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Quick Insights
        </h3>
        
        <div className="space-y-2">
          {quickInsights.slice(0, 3).map((insight) => {
            const TrendIcon = getTrendIcon(insight.trend);
            return (
              <div
                key={insight.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 backdrop-blur-sm ${getPriorityColor(insight.priority)} hover:shadow-md transition-all duration-300`}
              >
                <div className="flex-shrink-0">
                  <insight.icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {insight.title}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {insight.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {insight.value}
                  </span>
                  <TrendIcon className={`w-3 h-3 ${getTrendColor(insight.trend).split(' ')[0]}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Card className={`backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Quick Insights
        </CardTitle>
        <CardDescription>Key observations for {domain}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {quickInsights.map((insight) => {
            const TrendIcon = getTrendIcon(insight.trend);
            return (
              <div
                key={insight.id}
                className={`flex items-start gap-4 p-4 rounded-xl border-l-4 backdrop-blur-sm ${getPriorityColor(insight.priority)} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group/item`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <insight.icon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-800">
                      {insight.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getTrendColor(insight.trend)}`}
                    >
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {insight.trend}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">
                      {insight.value}
                    </span>
                    
                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-white/60">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-xs text-slate-600">Positive</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-xs text-slate-600">Needs Action</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-600">92%</div>
              <div className="text-xs text-slate-600">Overall Score</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInsights;