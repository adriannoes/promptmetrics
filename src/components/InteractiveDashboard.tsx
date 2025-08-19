import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Target, 
  Users, 
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Maximize2,
  Download,
  Share2
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface InteractiveDashboardProps {
  domain: string;
  data: any;
  className?: string;
}

const mockInsights = [
  { 
    id: '1', 
    type: 'positive', 
    title: 'Strong Brand Sentiment', 
    description: 'Your brand shows 85% positive sentiment across AI conversations',
    impact: 'high',
    action: 'Leverage this strength in marketing campaigns'
  },
  { 
    id: '2', 
    type: 'warning', 
    title: 'Content Gap Detected', 
    description: 'AI models have limited information about your recent product launches',
    impact: 'medium',
    action: 'Publish more content about new products'
  },
  { 
    id: '3', 
    type: 'opportunity', 
    title: 'Competitor Weakness', 
    description: 'Main competitor shows declining sentiment trends',
    impact: 'high',
    action: 'Increase visibility in competitive keywords'
  }
];

const mockTrendData = [
  { month: 'Jan', sentiment: 78, visibility: 65, engagement: 72 },
  { month: 'Feb', sentiment: 82, visibility: 68, engagement: 75 },
  { month: 'Mar', sentiment: 85, visibility: 72, engagement: 78 },
  { month: 'Apr', sentiment: 87, visibility: 75, engagement: 82 },
  { month: 'May', sentiment: 89, visibility: 78, engagement: 85 },
  { month: 'Jun', sentiment: 92, visibility: 82, engagement: 88 }
];

const mockCompetitorData = [
  { name: 'Your Brand', value: 92, color: '#3B82F6' },
  { name: 'Competitor A', value: 78, color: '#10B981' },
  { name: 'Competitor B', value: 65, color: '#8B5CF6' },
  { name: 'Competitor C', value: 58, color: '#F59E0B' },
  { name: 'Others', value: 45, color: '#6B7280' }
];

export const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({
  domain,
  data,
  className = ''
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'insights' | 'competitive'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const metrics = useMemo(() => [
    {
      title: 'AI Sentiment Score',
      value: 92,
      displayValue: '92%',
      trend: 8,
      icon: MessageSquare,
      variant: 'success' as const
    },
    {
      title: 'Visibility Index',
      value: 82,
      displayValue: '82/100',
      trend: 5,
      icon: Eye,
      variant: 'primary' as const
    },
    {
      title: 'Brand Mentions',
      value: 1247,
      displayValue: '1.2K',
      trend: 15,
      icon: Users,
      variant: 'success' as const
    },
    {
      title: 'Competitive Rank',
      value: 2,
      displayValue: '#2',
      trend: -1,
      icon: Target,
      variant: 'warning' as const
    }
  ], []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100/80';
      case 'medium': return 'text-yellow-600 bg-yellow-100/80';
      case 'low': return 'text-green-600 bg-green-100/80';
      default: return 'text-slate-600 bg-slate-100/80';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return TrendingUp;
      case 'warning': return TrendingDown;
      case 'opportunity': return Sparkles;
      default: return MessageSquare;
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI Insights Dashboard</h2>
          <p className="text-slate-600">Real-time analysis for {domain}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList className="bg-white/60 backdrop-blur-sm">
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            className={`cursor-pointer transition-all duration-300 ${
              selectedMetric === metric.title ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            onClick={() => setSelectedMetric(
              selectedMetric === metric.title ? null : metric.title
            )}
          />
        ))}
      </div>

      {/* Interactive Views */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Multi-metric analysis over time</CardDescription>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
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
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    name="AI Sentiment"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visibility" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    name="Visibility"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    name="Engagement"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Competitive Analysis */}
        <div>
          <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group h-fit">
            <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Competitive Position
              </CardTitle>
              <CardDescription>Market share by sentiment</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockCompetitorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockCompetitorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3 mt-4">
                {mockCompetitorData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
                      {index === 0 && <Badge variant="secondary" className="text-xs">You</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights & Recommendations */}
      <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group">
        <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Automated recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockInsights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <div 
                  key={insight.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/60 to-slate-50/60 backdrop-blur-sm border border-white/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group/card"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      insight.type === 'positive' ? 'bg-green-100/80 text-green-600' :
                      insight.type === 'warning' ? 'bg-yellow-100/80 text-yellow-600' :
                      'bg-blue-100/80 text-blue-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                        <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{insight.action}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveDashboard;