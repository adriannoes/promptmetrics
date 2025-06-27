
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Users, MessageSquare, Target, BarChart3 } from 'lucide-react';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data based on the screenshots
  const overallSentiment = [
    { name: 'Positive', value: 68.1, color: '#10b981' },
    { name: 'Neutral', value: 17.8, color: '#f59e0b' },
    { name: 'Negative', value: 14.1, color: '#ef4444' }
  ];

  const marketShare = [
    { name: 'Lovable', value: 35, color: '#3b82f6' },
    { name: 'Bolt', value: 28, color: '#10b981' },
    { name: 'V0', value: 22, color: '#8b5cf6' },
    { name: 'Figma Make', value: 15, color: '#f59e0b' }
  ];

  const keyMetrics = [
    { title: 'Brand Mentions', value: '2,847', change: '+12.3%', trend: 'up' },
    { title: 'Sentiment Score', value: '73.4', change: '+5.2%', trend: 'up' },
    { title: 'Share of Voice', value: '35.2%', change: '-2.1%', trend: 'down' },
    { title: 'Engagement Rate', value: '4.7%', change: '+8.1%', trend: 'up' }
  ];

  const competitiveData = [
    { name: 'Jan', Lovable: 35, Bolt: 28, V0: 22, 'Figma Make': 15 },
    { name: 'Feb', Lovable: 38, Bolt: 25, V0: 24, 'Figma Make': 13 },
    { name: 'Mar', Lovable: 42, Bolt: 27, V0: 20, 'Figma Make': 11 },
    { name: 'Apr', Lovable: 39, Bolt: 29, V0: 21, 'Figma Make': 11 },
    { name: 'May', Lovable: 45, Bolt: 26, V0: 18, 'Figma Make': 11 },
    { name: 'Jun', Lovable: 47, Bolt: 24, V0: 19, 'Figma Make': 10 }
  ];

  const topPrompts = [
    { prompt: "best AI code editor", rank: 1, mentions: 1247, sentiment: 85 },
    { prompt: "frontend development tools", rank: 2, mentions: 892, sentiment: 78 },
    { prompt: "visual programming platforms", rank: 3, mentions: 743, sentiment: 82 },
    { prompt: "no-code web development", rank: 4, mentions: 634, sentiment: 75 },
    { prompt: "AI-powered design tools", rank: 5, mentions: 521, sentiment: 88 }
  ];

  const brandStrengths = [
    { factor: 'AI-powered development', score: 92 },
    { factor: 'Visual interface design', score: 88 },
    { factor: 'Rapid prototyping', score: 85 },
    { factor: 'User experience', score: 83 },
    { factor: 'Code generation quality', score: 80 }
  ];

  const improvementAreas = [
    { area: 'Enterprise features', urgency: 'high' },
    { area: 'Advanced integrations', urgency: 'medium' },
    { area: 'Team collaboration', urgency: 'high' },
    { area: 'Custom deployment', urgency: 'medium' },
    { area: 'API documentation', urgency: 'low' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-slate-900">PromptMetrics</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Demo Mode</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Analyzing: lovable.dev</span>
            <Button size="sm">Export Report</Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="brand-marketing">Brand & Marketing</TabsTrigger>
            <TabsTrigger value="audience">Audience & Content</TabsTrigger>
            <TabsTrigger value="landscape">Business Landscape</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI Strategic Insights</h1>
                <p className="text-slate-600 mt-2">Based on current LLM output about your brand</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm font-medium">{metric.change}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overallSentiment}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {overallSentiment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Share vs. Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="share" name="Market Share" />
                        <YAxis dataKey="sentiment" name="Sentiment" />
                        <Scatter 
                          data={[
                            {share: 35, sentiment: 73, name: 'Lovable'},
                            {share: 28, sentiment: 65, name: 'Bolt'},
                            {share: 22, sentiment: 58, name: 'V0'},
                            {share: 15, sentiment: 62, name: 'Figma Make'}
                          ]} 
                          fill="#3b82f6" 
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Strategic Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>AI Strategic Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-slate-900">Leverage Competitive Edge</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Lovable consistently ranks #1 for "AI-powered development" and "visual programming." 
                      Double down on these differentiators in content strategy.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Create thought leadership content around AI-first development</li>
                        <li>• Develop case studies showcasing visual programming success</li>
                        <li>• Partner with AI/ML influencers for credibility</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-slate-900">Address Market Gaps</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Enterprise features and team collaboration are frequently mentioned as limitations. 
                      Competitors are gaining ground in these areas.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Prioritize enterprise-grade security features</li>
                        <li>• Develop advanced team collaboration tools</li>
                        <li>• Create enterprise pricing and support tiers</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-slate-900">Optimize Content Strategy</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      High-performing prompts show users value speed and ease-of-use. 
                      Adjust messaging to emphasize rapid development cycles.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Create "5-minute app" demo content</li>
                        <li>• Highlight time-to-market advantages</li>
                        <li>• Develop beginner-friendly tutorials</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brand-marketing" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Brand & Marketing</h1>
                <p className="text-slate-600 mt-2">AI Critical Sentiment Shifts</p>
              </div>
            </div>

            {/* Top Ranking Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Top Ranking Prompts</CardTitle>
                <p className="text-sm text-slate-600">Prompts where Lovable appears in top LLM responses</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPrompts.map((prompt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {prompt.rank}
                        </Badge>
                        <div>
                          <p className="font-medium text-slate-900">"{prompt.prompt}"</p>
                          <p className="text-sm text-slate-600">{prompt.mentions} mentions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${prompt.sentiment >= 80 ? 'bg-green-500' : prompt.sentiment >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium">{prompt.sentiment}% positive</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brand Strength Factors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Brand Strength Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brandStrengths.map((strength, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-700">{strength.factor}</span>
                          <span className="text-sm font-medium">{strength.score}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${strength.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <span className="text-sm text-slate-700">{area.area}</span>
                        <Badge 
                          variant={area.urgency === 'high' ? 'destructive' : area.urgency === 'medium' ? 'default' : 'secondary'}
                        >
                          {area.urgency} priority
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Perception by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={competitiveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="Lovable" stroke="#3b82f6" strokeWidth={3} />
                      <Line type="monotone" dataKey="Bolt" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="V0" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Figma Make" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Audience & Content</h1>
                <p className="text-slate-600 mt-2">AI Tone, Critical Shifts</p>
              </div>
            </div>

            {/* Content sections based on screenshots */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Query Intent Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Research', value: 62, color: '#3b82f6' },
                            { name: 'Purchase', value: 23, color: '#10b981' },
                            { name: 'Education', value: 9, color: '#f59e0b' },
                            { name: 'Comparison', value: 6, color: '#8b5cf6' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {[
                            { name: 'Research', value: 62, color: '#3b82f6' },
                            { name: 'Purchase', value: 23, color: '#10b981' },
                            { name: 'Education', value: 9, color: '#f59e0b' },
                            { name: 'Comparison', value: 6, color: '#8b5cf6' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">High-Performance Content</h3>
                      <p className="text-sm text-blue-800">
                        Tutorial content and "getting started" guides drive 73% of positive sentiment mentions
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Emerging Opportunities</h3>
                      <p className="text-sm text-green-800">
                        AI integration examples and advanced use cases show 40% growth in mentions
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">Content Gaps</h3>
                      <p className="text-sm text-yellow-800">
                        Enterprise case studies and ROI documentation are frequently requested but scarce
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="landscape" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Business Landscape</h1>
                <p className="text-slate-600 mt-2">Market Position: AI Urgent Strategic Priorities</p>
              </div>
            </div>

            {/* Strategic Priorities */}
            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-blue-100 text-blue-800">1</Badge>
                    <h3 className="font-semibold text-slate-900">Dominate With Try-On Program</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    25.5% market share—expand Home Try-On to outpace competitors.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-green-100 text-green-800">2</Badge>
                    <h3 className="font-semibold text-slate-900">Win Value-Conscious Shoppers</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Compete with Zenni/EyeBuyDirect (23.8% share) via budget-friendly collections.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-purple-100 text-purple-800">3</Badge>
                    <h3 className="font-semibold text-slate-900">Lead Digital Experience Innovation</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Invest in AR/AI Try-On to surpass Zenni, GlassesUSA, Ray-Ban offerings.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-orange-100 text-orange-800">4</Badge>
                    <h3 className="font-semibold text-slate-900">Broaden Omnichannel Services</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Leverage store footprint, expand eye exams and pickup for loyalty.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Market Share Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Share Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={competitiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="Lovable" stroke="#3b82f6" strokeWidth={3} />
                        <Line type="monotone" dataKey="Bolt" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="V0" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Figma Make" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Share Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {marketShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Demo;
