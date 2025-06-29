import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Target, TrendingUp, Heart, Edit, Plus, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const flashCardData = [
  { title: 'Average Rank', value: '2.3', subtitle: 'Average product position within prompt results', icon: BarChart3, color: 'bg-blue-100 text-blue-600' },
  { title: 'Prevalence', value: '60%', subtitle: '% of total prompt runs in which your product appears', icon: Target, color: 'bg-orange-100 text-orange-600' },
  { title: 'Category Rank', value: '2/4', subtitle: 'Ranked by prevalence relative to all products in prompt results', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600' },
  { title: '% Positive Sentiment', value: '78%', subtitle: 'Percentage of positive mentions across all prompts', icon: Heart, color: 'bg-green-100 text-green-600' },
];

const overallSentimentData = [
  { name: 'Lovable', score: 77.6, color: '#3B82F6' },
  { name: 'Bolt', score: 73.4, color: '#10B981' },
  { name: 'V0', score: 68.8, color: '#8B5CF6' },
  { name: 'Figma Make', score: 59.6, color: '#F59E0B' },
];

const llmSentimentData = [
  { llm: 'ChatGPT', lovable: 78, bolt: 72, v0: 65, figmaMake: 58 },
  { llm: 'Google AI Search', lovable: 82, bolt: 69, v0: 71, figmaMake: 62 },
  { llm: 'Claude', lovable: 85, bolt: 75, v0: 68, figmaMake: 55 },
  { llm: 'Perplexity', lovable: 80, bolt: 73, v0: 66, figmaMake: 60 },
  { llm: 'Grok', lovable: 65, bolt: 78, v0: 74, figmaMake: 63 },
];

const promptsData = [
  {
    prompt: 'best AI code editor',
    volume: 5,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: false, rank: null }, figmaMake: { present: false, rank: null } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 4 }, figmaMake: { present: false, rank: null } },
      { llm: 'Claude', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: false, rank: null }, figmaMake: { present: true, rank: 5 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 4 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: false, rank: null }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 3 } },
    ]
  },
  {
    prompt: 'visual programming platforms',
    volume: 3,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 4 }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 5 } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 4 } },
      { llm: 'Claude', lovable: { present: true, rank: 3 }, bolt: { present: false, rank: null }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 2 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 1 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: false, rank: null }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 3 } },
    ]
  },
  {
    prompt: 'no-code web development',
    volume: 4,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 4 }, figmaMake: { present: true, rank: 3 } },
      { llm: 'Claude', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 2 }, figmaMake: { present: false, rank: null } },
      { llm: 'Perplexity', lovable: { present: true, rank: 3 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 4 } },
      { llm: 'Grok', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: false, rank: null }, figmaMake: { present: true, rank: 3 } },
    ]
  },
  {
    prompt: 'rapid prototyping tools',
    volume: 2,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 3 }, bolt: { present: false, rank: null }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 2 } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 4 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 3 } },
      { llm: 'Claude', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: false, rank: null }, figmaMake: { present: true, rank: 3 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: false, rank: null }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 2 } },
    ]
  },
  {
    prompt: 'AI-powered development platforms',
    volume: 5,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: false, rank: null }, figmaMake: { present: false, rank: null } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 2 }, figmaMake: { present: false, rank: null } },
      { llm: 'Claude', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: true, rank: 4 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: true, rank: 4 } },
    ]
  },
];

const allLlms = [
  { id: 'ChatGPT', name: 'ChatGPT' },
  { id: 'Google AI Search', name: 'Google AI Search' },
  { id: 'Claude', name: 'Claude' },
  { id: 'Perplexity', name: 'Perplexity' },
  { id: 'Grok', name: 'Grok' },
];

const allCompetitors = [
  { id: 'lovable', name: 'Lovable' },
  { id: 'bolt', name: 'Bolt' },
  { id: 'v0', name: 'V0' },
  { id: 'figmaMake', name: 'Figma Make' },
];

const VolumeIndicator = ({ volume }: { volume: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-1 h-4 rounded ${
            bar <= volume ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

const PresenceRankCell = ({ data }: { data: { present: boolean; rank: number | null } }) => {
  if (!data.present) {
    return <Badge variant="secondary" className="bg-red-100 text-red-700">No</Badge>;
  }
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="bg-green-100 text-green-700">Yes</Badge>
      <span className="text-sm font-medium">{data.rank}</span>
    </div>
  );
};

export const PromptAnalysisTab = () => {
  const [selectedLlms, setSelectedLlms] = useState<string[]>(allLlms.map(llm => llm.id));
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(allCompetitors.map(comp => comp.id));
  const [isCustomizeViewOpen, setIsCustomizeViewOpen] = useState(false);

  const handleLlmToggle = (llmId: string) => {
    setSelectedLlms(prev => 
      prev.includes(llmId) 
        ? prev.filter(id => id !== llmId)
        : [...prev, llmId]
    );
  };

  const handleCompetitorToggle = (competitorId: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(competitorId) 
        ? prev.filter(id => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  const filteredPromptsData = promptsData.map(prompt => ({
    ...prompt,
    llmData: prompt.llmData.filter(llmRow => selectedLlms.includes(llmRow.llm))
  }));

  const visibleCompetitors = allCompetitors.filter(comp => selectedCompetitors.includes(comp.id));

  return (
    <div className="space-y-8">
      {/* Flash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashCardData.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <p className="text-sm text-gray-600">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prompts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Prompts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={isCustomizeViewOpen} onOpenChange={setIsCustomizeViewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Customize view
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Customize View</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select LLMs to Display</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {allLlms.map((llm) => (
                          <div key={llm.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`llm-${llm.id}`}
                              checked={selectedLlms.includes(llm.id)}
                              onCheckedChange={() => handleLlmToggle(llm.id)}
                            />
                            <label
                              htmlFor={`llm-${llm.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {llm.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select Competitors to Display</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {allCompetitors.map((competitor) => (
                          <div key={competitor.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`competitor-${competitor.id}`}
                              checked={selectedCompetitors.includes(competitor.id)}
                              onCheckedChange={() => handleCompetitorToggle(competitor.id)}
                            />
                            <label
                              htmlFor={`competitor-${competitor.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {competitor.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => setIsCustomizeViewOpen(false)}>
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit prompts
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add new prompt
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Local:</span>
              <span className="font-medium">Global</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Language:</span>
              <span className="font-medium">English</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Showing:</span>
              <span className="font-medium">5 prompts</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-96 relative">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 border-b">
                <TableRow>
                  <TableHead className="bg-white">Prompt</TableHead>
                  <TableHead className="bg-white">LLM</TableHead>
                  {visibleCompetitors.map((competitor) => (
                    <TableHead key={competitor.id} className="text-center bg-white">
                      <div className="flex items-center justify-center gap-2">
                        {competitor.name}<br />Present | Rank
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromptsData.map((prompt) => (
                  prompt.llmData.map((llmRow, index) => (
                    <TableRow key={`${prompt.prompt}-${llmRow.llm}`}>
                      {index === 0 && (
                        <TableCell rowSpan={prompt.llmData.length} className="font-medium align-top">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-2">
                              <span>{prompt.prompt}</span>
                              <div className="flex items-center gap-2">
                                <VolumeIndicator volume={prompt.volume} />
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{llmRow.llm}</TableCell>
                      {visibleCompetitors.map((competitor) => (
                        <TableCell key={competitor.id} className="text-center">
                          <PresenceRankCell data={llmRow[competitor.id as keyof typeof llmRow] as { present: boolean; rank: number | null }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={overallSentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {overallSentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment by LLM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Sentiment by LLM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>LLM</TableHead>
                  <TableHead>Lovable</TableHead>
                  <TableHead>Bolt</TableHead>
                  <TableHead>V0</TableHead>
                  <TableHead>Figma Make</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {llmSentimentData.map((row) => (
                  <TableRow key={row.llm}>
                    <TableCell className="font-medium">{row.llm}</TableCell>
                    <TableCell>{row.lovable} {row.lovable >= 80 ? '👍' : row.lovable >= 70 ? '⚠️' : '👎'}</TableCell>
                    <TableCell>{row.bolt}</TableCell>
                    <TableCell>{row.v0}</TableCell>
                    <TableCell>{row.figmaMake}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Critical Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Critical Prompts (Negative Sentiment)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">"enterprise development tools"</h4>
                  <Badge variant="destructive">-15</Badge>
                </div>
                <p className="text-sm text-gray-600">Limited enterprise features compared to competitors</p>
                <p className="text-xs text-gray-500">89 mentions | Sentiment: -15</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">"team collaboration platforms"</h4>
                  <Badge variant="destructive">-8</Badge>
                </div>
                <p className="text-sm text-gray-600">Weak team collaboration tools</p>
                <p className="text-xs text-gray-500">67 mentions | Sentiment: -8</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">"scalable web development"</h4>
                  <Badge variant="secondary">-12</Badge>
                </div>
                <p className="text-sm text-gray-600">Scalability concerns for large projects</p>
                <p className="text-xs text-gray-500">45 mentions | Sentiment: -12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Actionable Sentiment Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-blue-600 mb-2">Immediate Actions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    Address enterprise features gap - highest negative sentiment driver
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    Improve team collaboration tools to match competitor offerings
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    Leverage AI-powered development strength in marketing content
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-600 mb-2">Strategic Opportunities</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                    Claude shows highest sentiment (85) - focus partnership efforts
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                    Rapid prototyping strength underutilized in messaging
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Strengths & Drawbacks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sentiment Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="flex items-center gap-2 font-medium text-green-600 mb-3">
                  <CheckCircle className="w-4 h-4" />
                  Top Sentiment Strengths
                </h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">AI-Powered Development</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+92</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Users consistently praise Lovable's intelligent code generation and AI assistance</p>
                    <p className="text-xs text-gray-500">234 positive mentions</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Visual Programming Interface</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+88</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Real-time visual feedback and intuitive design tools receive high praise</p>
                    <p className="text-xs text-gray-500">189 positive mentions</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-medium text-red-600 mb-3">
                  <XCircle className="w-4 h-4" />
                  Key Sentiment Drawbacks
                </h4>
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Enterprise Features</span>
                      <Badge variant="destructive">-18</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Lack of advanced enterprise security, compliance, and management features</p>
                    <p className="text-xs text-gray-500">156 negative mentions</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Team Collaboration</span>
                      <Badge variant="destructive">-15</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Limited real-time collaboration tools for development teams</p>
                    <p className="text-xs text-gray-500">123 negative mentions</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
