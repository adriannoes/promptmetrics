import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Activity,
  Maximize2,
  Download,
  Share2,
  ChevronRight,
  Lightbulb,
  Target,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface DataPoint {
  period: string;
  value: number;
  comparison?: number;
}

interface Insight {
  type: 'positive' | 'negative' | 'neutral' | 'opportunity';
  message: string;
  impact: 'high' | 'medium' | 'low';
  recommendation?: string;
}

interface DataStoryCardProps {
  title: string;
  description?: string;
  data: DataPoint[];
  currentValue: number;
  previousValue?: number;
  unit?: string;
  format?: 'number' | 'percentage' | 'currency';
  insights?: Insight[];
  variant?: 'default' | 'trend' | 'comparison' | 'forecast';
  showChart?: boolean;
  interactive?: boolean;
  className?: string;
}

export const DataStoryCard: React.FC<DataStoryCardProps> = ({
  title,
  description,
  data,
  currentValue,
  previousValue,
  unit = '',
  format = 'number',
  insights = [],
  variant = 'default',
  showChart = true,
  interactive = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const formatValue = (value: number) => {
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrend = () => {
    if (!previousValue) return null;
    const change = currentValue - previousValue;
    const percentChange = (change / previousValue) * 100;
    return {
      change,
      percentChange,
      isPositive: change > 0
    };
  };

  const trend = getTrend();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      case 'opportunity': return Lightbulb;
      default: return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-100/80';
      case 'negative': return 'text-red-600 bg-red-100/80';
      case 'opportunity': return 'text-blue-600 bg-blue-100/80';
      default: return 'text-slate-600 bg-slate-100/80';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-red-200 bg-red-50/60';
      case 'medium': return 'border-yellow-200 bg-yellow-50/60';
      case 'low': return 'border-green-200 bg-green-50/60';
      default: return 'border-slate-200 bg-slate-50/60';
    }
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'trend':
        return {
          icon: TrendingUp,
          color: 'from-green-500 to-emerald-600',
          bgColor: 'from-green-50/60 to-emerald-50/60'
        };
      case 'comparison':
        return {
          icon: BarChart3,
          color: 'from-blue-500 to-indigo-600',
          bgColor: 'from-blue-50/60 to-indigo-50/60'
        };
      case 'forecast':
        return {
          icon: Activity,
          color: 'from-purple-500 to-violet-600',
          bgColor: 'from-purple-50/60 to-violet-50/60'
        };
      default:
        return {
          icon: PieChart,
          color: 'from-slate-500 to-gray-600',
          bgColor: 'from-slate-50/60 to-gray-50/60'
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Card className={`backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group ${className}`}>
      <CardHeader className={`bg-gradient-to-r ${config.bgColor} backdrop-blur-sm`}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <config.icon className="w-4 h-4 text-white" />
              </div>
              {title}
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          
          {interactive && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="ghost" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Key Metric Display */}
        <div className="flex items-end gap-4 mt-4">
          <div>
            <div className="text-3xl font-bold text-slate-800">
              {formatValue(currentValue)}{unit}
            </div>
            {trend && (
              <div className={`flex items-center gap-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {trend.isPositive ? '+' : ''}{trend.percentChange.toFixed(1)}%
                </span>
                <span className="text-slate-500">vs previous period</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {showChart && data.length > 0 && (
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: any) => [formatValue(value), 'Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 2, 
                    fill: '#3B82F6',
                    onClick: (data: any) => setSelectedPeriod(data.payload.period)
                  }}
                />
                {data[0]?.comparison !== undefined && (
                  <Line 
                    type="monotone" 
                    dataKey="comparison" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, strokeWidth: 1, fill: 'white' }}
                    name="Comparison"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insights Section */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                Key Insights
              </h4>
              {insights.length > 2 && !isExpanded && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-xs"
                >
                  Show All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {(isExpanded ? insights : insights.slice(0, 2)).map((insight, index) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${getImpactColor(insight.impact)} hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getInsightColor(insight.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 mb-1">
                          {insight.message}
                        </p>
                        {insight.recommendation && (
                          <p className="text-xs text-slate-600 flex items-start gap-2">
                            <Target className="w-3 h-3 mt-0.5 text-blue-500" />
                            {insight.recommendation}
                          </p>
                        )}
                        <Badge 
                          variant="secondary" 
                          className="text-xs mt-2"
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expand/Collapse for insights */}
        {insights.length > 2 && isExpanded && (
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-xs"
            >
              Show Less
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataStoryCard;