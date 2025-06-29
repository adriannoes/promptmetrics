import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Heart, 
  Trophy, 
  MapPin, 
  Globe, 
  Settings, 
  Edit, 
  Plus, 
  ExternalLink,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';

const promptsData = [
  {
    name: "Why is prompt engineering important?",
    volume: 4,
    llms: [
      {
        name: "GPT-4",
        lovable: { present: true, rank: 1 },
        competitors: [
          { name: "Bard", present: true, rank: 2 },
          { name: "Claude", present: false },
        ],
      },
      {
        name: "Bard",
        lovable: { present: true, rank: 2 },
        competitors: [
          { name: "GPT-4", present: true, rank: 1 },
          { name: "Claude", present: false },
        ],
      },
    ],
  },
  {
    name: "Best practices for prompt design",
    volume: 5,
    llms: [
      {
        name: "GPT-4",
        lovable: { present: true, rank: 1 },
        competitors: [
          { name: "Bard", present: true, rank: 3 },
          { name: "Claude", present: true, rank: 2 },
        ],
      },
      {
        name: "Claude",
        lovable: { present: true, rank: 2 },
        competitors: [
          { name: "GPT-4", present: true, rank: 1 },
          { name: "Bard", present: true, rank: 3 },
        ],
      },
    ],
  },
  {
    name: "How to avoid prompt injection attacks",
    volume: 3,
    llms: [
      {
        name: "GPT-4",
        lovable: { present: true, rank: 2 },
        competitors: [
          { name: "Bard", present: true, rank: 1 },
          { name: "Claude", present: false },
        ],
      },
      {
        name: "Bard",
        lovable: { present: true, rank: 1 },
        competitors: [
          { name: "GPT-4", present: true, rank: 2 },
          { name: "Claude", present: false },
        ],
      },
    ],
  },
];

const sentimentByLLMData = [
  { llm: 'GPT-4', positive: 85, neutral: 10, negative: 5 },
  { llm: 'Bard', positive: 78, neutral: 15, negative: 7 },
  { llm: 'Claude', positive: 80, neutral: 12, negative: 8 },
];

const criticalPrompts = [
  { name: 'Inaccurate Information', issue: 'Provides misleading data', sentiment: 35 },
  { name: 'Biased Responses', issue: 'Shows unfair preferences', sentiment: 42 },
];

const sentimentStrengths = [
  { category: 'Clarity', description: 'Clear and concise responses', score: 92 },
  { category: 'Relevance', description: 'Highly relevant to the query', score: 88 },
];

const sentimentDrawbacks = [
  { category: 'Inconsistency', description: 'Responses vary in quality', impact: 'High' },
  { category: 'Lack of Creativity', description: 'Struggles with open-ended tasks', impact: 'Medium' },
];

const actionableInsights = [
  { title: 'Improve Data Accuracy', description: 'Verify data sources for accuracy', priority: 'High', timeframe: 'Immediate' },
  { title: 'Reduce Bias', description: 'Implement bias detection algorithms', priority: 'Medium', timeframe: 'Next Month' },
];

export const PromptAnalysisTab = () => {
  return (
    <div className="space-y-8">
      {/* Flash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rank</p>
                <p className="text-2xl font-bold text-gray-900">2.3</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.2 from last month
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prevalence</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last month
                </p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Category Rank</p>
                <p className="text-2xl font-bold text-gray-900">#2</p>
                <p className="text-xs text-gray-500">in AI Development</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">% Positive Sentiment</p>
                <p className="text-2xl font-bold text-gray-900">82%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +3% from last month
                </p>
              </div>
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prompts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prompts Analysis</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Location: Global</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>Language: English</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Customize View
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Prompts
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add New Prompt
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-700">Prompt</th>
                  <th className="text-left p-4 font-medium text-gray-700">LLM</th>
                  <th className="text-left p-4 font-medium text-gray-700">Lovable Presence & Rank</th>
                  <th className="text-left p-4 font-medium text-gray-700">Competitor Presence & Rank</th>
                  <th className="text-left p-4 font-medium text-gray-700">Volume</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promptsData.map((prompt, promptIndex) => (
                  prompt.llms.map((llm, llmIndex) => (
                    <tr key={`${promptIndex}-${llmIndex}`} className="border-b hover:bg-gray-50">
                      {llmIndex === 0 && (
                        <td className="p-4 font-medium" rowSpan={prompt.llms.length}>
                          {prompt.name}
                        </td>
                      )}
                      <td className="p-4">{llm.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={llm.lovable.present ? "default" : "secondary"}>
                            {llm.lovable.present ? "Present" : "Not Present"}
                          </Badge>
                          {llm.lovable.present && (
                            <span className="text-sm font-medium">#{llm.lovable.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {llm.competitors.map((comp, compIndex) => (
                            <div key={compIndex} className="flex items-center gap-2 text-sm">
                              <span className="w-16">{comp.name}:</span>
                              <Badge variant={comp.present ? "default" : "secondary"} className="text-xs">
                                {comp.present ? `#${comp.rank}` : "Not Present"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                      {llmIndex === 0 && (
                        <>
                          <td className="p-4" rowSpan={prompt.llms.length}>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((bar) => (
                                <div
                                  key={bar}
                                  className={`w-2 h-6 rounded ${
                                    bar <= prompt.volume ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-4" rowSpan={prompt.llms.length}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Sentiment Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Overall Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">82%</div>
              <p className="text-gray-600">Positive Sentiment</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: 82, color: '#10B981' },
                    { name: 'Neutral', value: 12, color: '#F59E0B' },
                    { name: 'Negative', value: 6, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {[
                    { name: 'Positive', value: 82, color: '#10B981' },
                    { name: 'Neutral', value: 12, color: '#F59E0B' },
                    { name: 'Negative', value: 6, color: '#EF4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment by LLM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Sentiment by LLM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sentimentByLLMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="llm" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" fill="#10B981" name="Positive" />
                <Bar dataKey="neutral" fill="#F59E0B" name="Neutral" />
                <Bar dataKey="negative" fill="#EF4444" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Critical Prompts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Critical Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalPrompts.map((prompt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{prompt.name}</p>
                    <p className="text-sm text-gray-600">{prompt.issue}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{prompt.sentiment}%</Badge>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Sentiment Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Top Sentiment Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentimentStrengths.map((strength, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{strength.category}</p>
                    <p className="text-sm text-gray-600">{strength.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {strength.score}%
                    </Badge>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Sentiment Drawbacks & Actionable Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Sentiment Drawbacks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-orange-600" />
              Key Sentiment Drawbacks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentimentDrawbacks.map((drawback, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{drawback.category}</p>
                    <p className="text-sm text-gray-600 mt-1">{drawback.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      Impact: {drawback.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actionable Sentiment Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Actionable Sentiment Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionableInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{insight.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        {insight.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{insight.timeframe}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
