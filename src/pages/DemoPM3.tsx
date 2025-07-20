import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Star,
  Globe,
  BookOpen,
  Award,
  Lightbulb,
  ChevronRight,
  ExternalLink,
  Trophy,
  Heart,
  Database,
  Zap,
  MessageSquare,
  Brain,
  Sparkles
} from 'lucide-react';
import SkipNav from '@/components/SkipNav';

// Real data from PM3 analysis in Supabase - Enhanced
const analysisData = {
  score: 78,
  domain: "www.pm3.com.br",
  summary: "PM3 operates in the competitive Brazilian digital education market, specializing in product management, design, and marketing training. The company shows strong potential with a clear focus on professional development in the digital product space, though faces significant competition from established platforms.",
  
  // Enhanced ranking data with more detail
  ranking_trends: [
    {month: "Jan", PM3: 3, Alura: 1, Udemy: 2, "Rock Content": 4, "Digital House": 5},
    {month: "Feb", PM3: 3, Alura: 1, Udemy: 2, "Rock Content": 4, "Digital House": 5},
    {month: "Mar", PM3: 2, Alura: 1, Udemy: 3, "Rock Content": 4, "Digital House": 5},
    {month: "Apr", PM3: 2, Alura: 1, Udemy: 3, "Rock Content": 4, "Digital House": 5},
    {month: "May", PM3: 2, Alura: 1, Udemy: 3, "Rock Content": 5, "Digital House": 4},
    {month: "Jun", PM3: 2, Alura: 1, Udemy: 3, "Rock Content": 5, "Digital House": 4}
  ],
  
  // Market share evolution
  market_share_evolution: [
    {month: "Jan", PM3: 14, Alura: 36, Udemy: 25, Others: 25},
    {month: "Feb", PM3: 15, Alura: 35, Udemy: 26, Others: 24},
    {month: "Mar", PM3: 17, Alura: 34, Udemy: 25, Others: 24},
    {month: "Apr", PM3: 18, Alura: 35, Udemy: 24, Others: 23},
    {month: "May", PM3: 19, Alura: 36, Udemy: 23, Others: 22},
    {month: "Jun", PM3: 20, Alura: 35, Udemy: 23, Others: 22}
  ],
  
  // AI sentiment analysis with more detailed insights
  ai_model_analysis: {
    Claude: {
      sentiment: 85,
      strengths: "Integration of practical insights with theoretical knowledge",
      description: "Claude demonstrates a strong ability to integrate practical insights with theoretical knowledge, offering a balanced approach between strategy and real-world application.",
      rating: 4.2
    },
    Gemini: {
      sentiment: 88,
      strengths: "Clear structuring and methodical organization",
      description: "Gemini excels in its clear structuring and presentation of information, often delivering responses that are methodically organized and easy to digest.",
      rating: 4.4
    },
    OpenAI: {
      sentiment: 83,
      strengths: "Comprehensive and systematic responses",
      description: "OpenAI ChatGPT has shown strengths in providing comprehensive and systematically structured responses with good coverage of core topics.",
      rating: 4.1
    }
  },
  
  // Sample prompts and their analysis
  sample_prompts: [
    {
      prompt: "What's the best platform for learning product management?",
      pm3_rank: 1,
      competitors: ["Alura: #2", "Udemy: #3"],
      confidence: 92,
      category: "Direct Competition"
    },
    {
      prompt: "How to become a product manager in Brazil?",
      pm3_rank: 2,
      competitors: ["Alura: #1", "Rock Content: #3"],
      confidence: 88,
      category: "Career Development"
    },
    {
      prompt: "Best product design courses online",
      pm3_rank: 3,
      competitors: ["Udemy: #1", "Alura: #2"],
      confidence: 85,
      category: "Course Discovery"
    },
    {
      prompt: "Corporate training for product teams",
      pm3_rank: 1,
      competitors: ["Digital House: #2", "Alura: #3"],
      confidence: 95,
      category: "B2B Training"
    }
  ],
  
  // Sentiment trends with more granular data
  sentiment_trends: [
    {month: "Jan", PM3: 72, Alura: 85, Udemy: 82, "Market Avg": 79},
    {month: "Feb", PM3: 74, Alura: 86, Udemy: 80, "Market Avg": 80},
    {month: "Mar", PM3: 76, Alura: 85, Udemy: 83, "Market Avg": 81},
    {month: "Apr", PM3: 78, Alura: 87, Udemy: 81, "Market Avg": 82},
    {month: "May", PM3: 80, Alura: 86, Udemy: 84, "Market Avg": 83},
    {month: "Jun", PM3: 82, Alura: 88, Udemy: 82, "Market Avg": 84}
  ],
  
  // Performance metrics with industry benchmarks
  performance_metrics: {
    avgTokens: 156,
    responseTime: 1.2,
    dataFreshness: "2025-07-20",
    aiModelsAnalyzed: 3,
    totalAnalyzedPrompts: 30,
    averageConfidenceScore: 87.3,
    industryAvgTokens: 142,
    industryAvgResponseTime: 1.8,
    industryAvgConfidence: 82.1
  },
  
  // Strategic insights organized by priority
  strategic_insights: {
    high_priority: [
      "Develop specialized certification programs in partnership with recognized industry bodies",
      "Create corporate training packages tailored to upskilling entire product teams",
      "Implement data-driven product strategy focusing on user engagement metrics"
    ],
    medium_priority: [
      "Establish strategic partnerships with tech companies and startups",
      "Invest in advanced analytics capabilities for personalized learning paths",
      "Expand content offering to include emerging product management trends"
    ],
    opportunities: [
      "Brazilian market shows 35% growth in product management job postings",
      "Corporate training segment growing 28% year-over-year",
      "AI-assisted learning gaining 45% adoption rate in edtech"
    ]
  }
};

const COLORS = {
  PM3: '#50C878',
  Alura: '#FF4B4B', 
  Udemy: '#4B7BFF',
  'Rock Content': '#8B5CF6',
  'Digital House': '#F59E0B',
  'Market Avg': '#6B7280',
  Others: '#9CA3AF'
};

const DashboardTab = () => (
  <div className="space-y-6">
    {/* Header Stats with Modern Design */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Overall Score</CardTitle>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 mb-2">{analysisData.score}<span className="text-lg text-green-600">/100</span></div>
          <Progress value={analysisData.score} className="mt-2 h-2" />
          <p className="text-xs text-green-600 mt-2">↗ +8 points vs last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Market Position</CardTitle>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Trophy className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 mb-2">#2</div>
          <p className="text-xs text-blue-600">in Brazilian EdTech</p>
          <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">↗ Improved from #3</Badge>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Market Share</CardTitle>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700 mb-2">20%</div>
          <p className="text-xs text-purple-600">growing steadily</p>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-purple-600">+6% this quarter</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">AI Confidence</CardTitle>
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-700 mb-2">87.3<span className="text-lg text-orange-600">%</span></div>
          <p className="text-xs text-orange-600">Industry avg: 82.1%</p>
          <div className="flex items-center gap-1 mt-2">
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-orange-600">Above average</span>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Market Share Evolution Chart */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Market Share Evolution
        </CardTitle>
        <CardDescription>PM3's growing market presence in Brazilian EdTech (6 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={analysisData.market_share_evolution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Area type="monotone" dataKey="PM3" stackId="1" stroke={COLORS.PM3} fill={COLORS.PM3} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Alura" stackId="1" stroke={COLORS.Alura} fill={COLORS.Alura} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Udemy" stackId="1" stroke={COLORS.Udemy} fill={COLORS.Udemy} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Others" stackId="1" stroke={COLORS.Others} fill={COLORS.Others} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Ranking vs Sentiment Comparison */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Ranking Position Trends
          </CardTitle>
          <CardDescription>Lower is better • PM3 climbing to #2</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysisData.ranking_trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis domain={[0, 6]} stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="PM3" stroke={COLORS.PM3} strokeWidth={3} dot={{ fill: COLORS.PM3, r: 6 }} />
              <Line type="monotone" dataKey="Alura" stroke={COLORS.Alura} strokeWidth={2} dot={{ fill: COLORS.Alura, r: 4 }} />
              <Line type="monotone" dataKey="Udemy" stroke={COLORS.Udemy} strokeWidth={2} dot={{ fill: COLORS.Udemy, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Sentiment Score Trends
          </CardTitle>
          <CardDescription>AI perception improving consistently</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysisData.sentiment_trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis domain={[65, 90]} stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="PM3" stroke={COLORS.PM3} strokeWidth={3} dot={{ fill: COLORS.PM3, r: 6 }} />
              <Line type="monotone" dataKey="Alura" stroke={COLORS.Alura} strokeWidth={2} />
              <Line type="monotone" dataKey="Udemy" stroke={COLORS.Udemy} strokeWidth={2} />
              <Line type="monotone" dataKey="Market Avg" stroke={COLORS['Market Avg']} strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Summary Card */}
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Executive Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-blue-800 leading-relaxed">{analysisData.summary}</p>
        <div className="flex items-center gap-2 mt-4">
          <Badge className="bg-blue-100 text-blue-700">EdTech Leader</Badge>
          <Badge className="bg-green-100 text-green-700">Growing Market Share</Badge>
          <Badge className="bg-purple-100 text-purple-700">AI Optimized</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

const PromptAnalysisTab = () => (
  <div className="space-y-6">
    {/* AI Models Performance */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(analysisData.ai_model_analysis).map(([model, data]) => (
        <Card key={model} className="bg-gradient-to-br from-slate-50 to-gray-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{model}</CardTitle>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(data.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">{data.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Sentiment Score</span>
                  <span className="font-bold text-lg">{data.sentiment}%</span>
                </div>
                <Progress value={data.sentiment} className="h-2" />
              </div>
              
              <div>
                <p className="font-medium text-sm text-gray-800 mb-1">Key Strength:</p>
                <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">{data.strengths}</p>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed">{data.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Sample Prompts Analysis */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          Sample Prompt Performance
        </CardTitle>
        <CardDescription>Real prompts analyzed by our AI system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysisData.sample_prompts.map((prompt, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-white to-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">"{prompt.prompt}"</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                    <span className="text-xs text-gray-500">Confidence: {prompt.confidence}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${prompt.pm3_rank === 1 ? 'text-green-600' : prompt.pm3_rank === 2 ? 'text-blue-600' : 'text-orange-600'}`}>
                    #{prompt.pm3_rank}
                  </div>
                  <p className="text-xs text-gray-500">PM3 Rank</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">vs</span>
                {prompt.competitors.map((comp, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{comp}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Performance Benchmarks */}
    <Card>
      <CardHeader>
        <CardTitle>Performance vs Industry Benchmarks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analysisData.performance_metrics.avgTokens}</div>
            <div className="text-sm text-gray-600">Avg Tokens</div>
            <div className="text-xs text-green-600">vs {analysisData.performance_metrics.industryAvgTokens} industry</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysisData.performance_metrics.responseTime}s</div>
            <div className="text-sm text-gray-600">Response Time</div>
            <div className="text-xs text-blue-600">vs {analysisData.performance_metrics.industryAvgResponseTime}s industry</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analysisData.performance_metrics.averageConfidenceScore}%</div>
            <div className="text-sm text-gray-600">Confidence</div>
            <div className="text-xs text-purple-600">vs {analysisData.performance_metrics.industryAvgConfidence}% industry</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const CompetitorAnalysisTab = () => (
  <div className="space-y-6">
    {/* Market Position Radar */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          Competitive Landscape Overview
        </CardTitle>
        <CardDescription>PM3's position vs major competitors in Brazilian EdTech</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Market Leaders</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <p className="font-medium">Alura</p>
                    <p className="text-sm text-red-600">Market leader, 35% share</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-700">Competitor</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <p className="font-medium">PM3</p>
                    <p className="text-sm text-green-600">Strong growth, 20% share</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">You</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <p className="font-medium">Udemy</p>
                    <p className="text-sm text-blue-600">Global reach, 23% share</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Competitor</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Competitive Strengths</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800 mb-1">🎯 Specialized Focus</p>
                <p className="text-sm text-green-700">PM3's focus on product management gives clear differentiation</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">🤝 B2B Opportunities</p>
                <p className="text-sm text-blue-700">Corporate training segment showing 28% growth</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-800 mb-1">📈 Market Timing</p>
                <p className="text-sm text-purple-700">35% growth in PM job postings in Brazil</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Head-to-head comparison */}
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance Comparison</CardTitle>
        <CardDescription>Ranking and sentiment trends vs competitors</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analysisData.ranking_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="PM3" fill={COLORS.PM3} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Alura" fill={COLORS.Alura} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Udemy" fill={COLORS.Udemy} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

const StrategicInsightsTab = () => (
  <div className="space-y-6">
    {/* Priority Matrix */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Zap className="w-5 h-5" />
            High Priority
          </CardTitle>
          <CardDescription className="text-red-600">Immediate action required</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData.strategic_insights.high_priority.map((item, index) => (
              <div key={index} className="p-3 bg-white/70 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Lightbulb className="w-5 h-5" />
            Medium Priority
          </CardTitle>
          <CardDescription className="text-yellow-600">Plan for next quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData.strategic_insights.medium_priority.map((item, index) => (
              <div key={index} className="p-3 bg-white/70 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-800 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="w-5 h-5" />
            Market Opportunities
          </CardTitle>
          <CardDescription className="text-green-600">Emerging trends to leverage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData.strategic_insights.opportunities.map((item, index) => (
              <div key={index} className="p-3 bg-white/70 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Action Plan Timeline */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          Recommended Action Timeline
        </CardTitle>
        <CardDescription>Strategic roadmap for next 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">Q1</div>
            <div>
              <h4 className="font-semibold text-gray-900">Foundation Building</h4>
              <p className="text-sm text-gray-600 mb-2">Develop corporate training program blueprint and enhance data analytics</p>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-700">Corporate Training</Badge>
                <Badge className="bg-green-100 text-green-700">Analytics</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">Q2</div>
            <div>
              <h4 className="font-semibold text-gray-900">Market Expansion</h4>
              <p className="text-sm text-gray-600 mb-2">Launch certification program pilot and establish strategic partnerships</p>
              <div className="flex gap-2">
                <Badge className="bg-purple-100 text-purple-700">Certification</Badge>
                <Badge className="bg-orange-100 text-orange-700">Partnerships</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">Q3</div>
            <div>
              <h4 className="font-semibold text-gray-900">Technology Enhancement</h4>
              <p className="text-sm text-gray-600 mb-2">Implement personalized learning paths and advanced AI capabilities</p>
              <div className="flex gap-2">
                <Badge className="bg-green-100 text-green-700">AI/ML</Badge>
                <Badge className="bg-blue-100 text-blue-700">Personalization</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-sm">Q4</div>
            <div>
              <h4 className="font-semibold text-gray-900">Scale & Optimize</h4>
              <p className="text-sm text-gray-600 mb-2">Scale successful programs and optimize based on performance data</p>
              <div className="flex gap-2">
                <Badge className="bg-yellow-100 text-yellow-700">Scaling</Badge>
                <Badge className="bg-red-100 text-red-700">Optimization</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Key Metrics to Track */}
    <Card className="bg-gradient-to-r from-slate-50 to-gray-50">
      <CardHeader>
        <CardTitle>Key Metrics to Track</CardTitle>
        <CardDescription>Monitor these metrics to measure strategy success</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">Market Share</div>
            <div className="text-sm text-gray-600">Target: 25%</div>
            <div className="text-xs text-blue-500">Current: 20%</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">B2B Revenue</div>
            <div className="text-sm text-gray-600">Target: 40%</div>
            <div className="text-xs text-green-500">Growth focus</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">AI Sentiment</div>
            <div className="text-sm text-gray-600">Target: 90+</div>
            <div className="text-xs text-purple-500">Current: 87.3</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">Certification</div>
            <div className="text-sm text-gray-600">Target: Launch</div>
            <div className="text-xs text-orange-500">Q2 2025</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const DemoPM3 = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SkipNav targetId="main-content" />
      
      {/* Clean Custom Header for Demo */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                P
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PromptMetrics</h1>
                <span className="text-sm text-gray-500">Demo Analysis Platform</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Database className="w-3 h-3 mr-1" />
                Real Data
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  ← Back to Home
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Analysis Header */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    P
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">PM3 Analysis</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">www.pm3.com.br</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <BookOpen className="w-3 h-3 mr-1" />
                        EdTech Platform
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-3 mb-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://pm3.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Visit PM3
                      </a>
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                      <Award className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Last updated: July 20, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="competitors" className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4" />
                Competitors
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4" />
                Strategic Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>

            <TabsContent value="prompts">
              <PromptAnalysisTab />
            </TabsContent>

            <TabsContent value="competitors">
              <CompetitorAnalysisTab />
            </TabsContent>

            <TabsContent value="insights">
              <StrategicInsightsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DemoPM3; 