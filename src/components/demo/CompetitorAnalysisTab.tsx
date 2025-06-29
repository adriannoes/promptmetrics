
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, TrendingUp, Lightbulb, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Eye } from 'lucide-react';

const marketShareData = [
  { name: 'Lovable', value: 35, color: '#3B82F6' },
  { name: 'Bolt', value: 25, color: '#10B981' },
  { name: 'V0', value: 20, color: '#8B5CF6' },
  { name: 'Cursor', value: 12, color: '#F59E0B' },
  { name: 'Other', value: 8, color: '#6B7280' },
];

const marketTrendsData = [
  { month: 'Jan', Lovable: 32, Bolt: 28, V0: 22, Cursor: 10, Other: 8 },
  { month: 'Feb', Lovable: 33, Bolt: 27, V0: 21, Cursor: 11, Other: 8 },
  { month: 'Mar', Lovable: 34, Bolt: 26, V0: 21, Cursor: 11, Other: 8 },
  { month: 'Apr', Lovable: 35, Bolt: 25, V0: 20, Cursor: 12, Other: 8 },
  { month: 'May', Lovable: 35, Bolt: 25, V0: 20, Cursor: 12, Other: 8 },
  { month: 'Jun', Lovable: 35, Bolt: 25, V0: 20, Cursor: 12, Other: 8 },
];

const strategicPriorities = [
  {
    id: 1,
    title: 'Dominate With Try-On Program',
    description: '35.52% market share—expand Home Try-On to outpace competitors.',
    priority: 'high',
    marketShare: 35.52
  },
  {
    id: 2,
    title: 'Win Value-Conscious Shoppers',
    description: 'Compete with Zenni/EyeBuyDirect (23.6% share) via budget-friendly collections.',
    priority: 'medium',
    marketShare: 23.6
  },
  {
    id: 3,
    title: 'Lead Digital Experience Innovation',
    description: 'Invest in AR/AI try-on to surpass Zenni, GlassesUSA, Ray-Ban offerings.',
    priority: 'high',
    marketShare: 18.2
  },
  {
    id: 4,
    title: 'Broaden Omnichannel Services',
    description: 'Leverage store footprint; expand eye exams and pickup for loyalty.',
    priority: 'medium',
    marketShare: 15.8
  },
];

const competitorOpportunities = [
  {
    category: 'Product Development',
    title: 'Leverage Warby Parker\'s Home Try-On program to further differentiate from competitors.',
    description: 'Warby Parker\'s Home Try-On program continues to be a unique and valuable service, with only a few competitors offering similar programs...',
    impact: 'high',
    effort: 'medium'
  },
  {
    category: 'Market Expansion',
    title: 'Capitalize on Warby Parker\'s social responsibility and eco-friendliness to increasingly attract conscious consumers.',
    description: 'Sustainable materials set it apart from many competitors. Social responsibility and eco-friendliness are increasingly important...',
    impact: 'medium',
    effort: 'low'
  },
  {
    category: 'Product Innovation',
    title: 'Enhance and innovate digital experiences, particularly the Virtual Try-On, to compete effectively with top online rivals.',
    description: 'While Warby Parker offers digital try-on experiences like Zenni, GlassesUSA, and Ray-Ban offering similar tools...',
    impact: 'high',
    effort: 'high'
  }
];

export const CompetitorAnalysisTab = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'medium': return <ArrowUp className="w-4 h-4 text-yellow-600" />;
      case 'low': return <ArrowUp className="w-4 h-4 text-green-600" />;
      default: return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Business Landscape Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Landscape</h2>
          <p className="text-gray-600 mt-1">Analyzing: lovable.dev</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Export to PDF
          </Button>
          <Button size="sm">
            Add domain
          </Button>
        </div>
      </div>

      {/* Market Position & Strategic Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Market Position: AI Urgent Strategic Priorities
              </CardTitle>
              <p className="text-sm text-gray-600">Based on current LLM output about your brand.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicPriorities.map((priority) => (
                  <div key={priority.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {priority.id}
                          </span>
                          <h3 className="font-semibold text-gray-900">{priority.title}</h3>
                          <Badge className={getPriorityColor(priority.priority)}>
                            {priority.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm ml-9">{priority.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{priority.marketShare}%</div>
                        <div className="text-xs text-gray-500">market share</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Share by Platform */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Share by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {marketShareData.map((item) => (
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
        </div>
      </div>

      {/* Market Share Trends & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Market Share Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 40]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Lovable" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Bolt" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="V0" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="Cursor" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="Other" stroke="#6B7280" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Share Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketShareData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${item.value}%`, 
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Business Landscape Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            AI Business Landscape Opportunities
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Based on current LLM output about your brand.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competitorOpportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1">
                    {getImpactIcon(opportunity.impact)}
                    <Badge variant="outline" className="text-xs">
                      {opportunity.category}
                    </Badge>
                  </div>
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

      {/* Strategic Opportunities & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Strategic Opportunities & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                Growth Opportunities
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Expand Home Try-On program through targeted marketing partnerships</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Highlight unique features in brand communications and consider exclusive try-on experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Introduce "Basics" or "Essentials" collection with lower entry price points</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                Competitive Threats
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Integrate social impact storytelling into marketing campaigns and website content</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Launch limited-edition collections tied to social or environmental causes</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Invest in next-generation AR/AI for more accurate and personalized recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
