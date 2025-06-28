import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ScatterChart, Scatter, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Users, MessageSquare, Target, BarChart3, ExternalLink, Info, Edit, Plus, Settings } from 'lucide-react';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Customize view state
  const [selectedLLMs, setSelectedLLMs] = useState(['ChatGPT', 'Google AI Search', 'Claude', 'Perplexity', 'Grok']);
  const [promptsPerPage, setPromptsPerPage] = useState(10);
  const [selectedCompetitors, setSelectedCompetitors] = useState(['bolt', 'v0', 'figmaMake']);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Available options
  const availableLLMs = [
    { id: 'ChatGPT', name: 'ChatGPT', logo: '🤖' },
    { id: 'Google AI Search', name: 'Google AI Search', logo: '🔍' },
    { id: 'Claude', name: 'Claude', logo: '🧠' },
    { id: 'Perplexity', name: 'Perplexity', logo: '🔮' },
    { id: 'Grok', name: 'Grok', logo: '⚡' }
  ];

  const availableCompetitors = [
    { id: 'bolt', name: 'Bolt', color: '#10b981' },
    { id: 'v0', name: 'V0', color: '#8b5cf6' },
    { id: 'figmaMake', name: 'Figma Make', color: '#f59e0b' }
  ];

  const promptsPerPageOptions = [5, 10, 15, 20, 25];

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

  // Enhanced data for prompt analysis with LLM breakdown
  const promptAnalysisDataWithLLMs = [
    { 
      prompt: "best AI code editor",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: false, rank: null },
          figmaMake: { present: false, rank: null }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 4 },
          figmaMake: { present: false, rank: null }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 5 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 4 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        }
      },
      volume: 'high' 
    },
    { 
      prompt: "visual programming platforms",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 4 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 5 }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 }
        },
        "Claude": {
          lovable: { present: true, rank: 3 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 2 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: false, rank: null }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 3 }
        }
      },
      volume: 'medium' 
    },
    { 
      prompt: "no-code web development",
      llms: {
        "ChatGPT": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 1 }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 4 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        },
        "Claude": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 2 }
        }
      },
      volume: 'high' 
    },
    { 
      prompt: "AI-powered design tools",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 1 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 4 },
          figmaMake: { present: true, rank: 2 }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 4 }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 2 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 4 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 1 }
        },
        "Grok": {
          lovable: { present: true, rank: 3 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 1 }
        }
      },
      volume: 'medium' 
    },
    { 
      prompt: "frontend development tools",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: false, rank: null }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 4 }
        },
        "Claude": {
          lovable: { present: true, rank: 4 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        }
      },
      volume: 'low' 
    },
    { 
      prompt: "rapid prototyping platforms",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 3 }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 4 }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 2 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 4 },
          figmaMake: { present: true, rank: 3 }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 2 }
        }
      },
      volume: 'low' 
    },
    { 
      prompt: "web application builders",
      llms: {
        "ChatGPT": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: false, rank: null }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 }
        },
        "Claude": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 3 }
        }
      },
      volume: 'medium' 
    },
    { 
      prompt: "code generation tools",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 2 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 1 },
          figmaMake: { present: false, rank: null }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: false, rank: null }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: false, rank: null }
        },
        "Grok": {
          lovable: { present: true, rank: 2 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 1 },
          figmaMake: { present: false, rank: null }
        }
      },
      volume: 'high' 
    },
    { 
      prompt: "drag and drop website builders",
      llms: {
        "ChatGPT": {
          lovable: { present: false, rank: null },
          bolt: { present: false, rank: null },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 1 }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 4 },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 1 }
        },
        "Claude": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 1 }
        },
        "Perplexity": {
          lovable: { present: false, rank: null },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 1 }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: false, rank: null },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 1 }
        }
      },
      volume: 'low' 
    },
    { 
      prompt: "developer productivity tools",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 4 },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 1 }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 }
        },
        "Claude": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: true, rank: 4 }
        },
        "Perplexity": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null }
        },
        "Grok": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 }
        }
      },
      volume: 'medium' 
    }
  ];

  const competitorAnalysis = [
    { name: 'Udemy', website: 'udemy.com', prevalence: 42.5, averageRank: 2.8 },
    { name: 'Coursera', website: 'coursera.org', prevalence: 37.5, averageRank: 1.5 },
    { name: 'Bolt', website: 'bolt.new', prevalence: 30.0, averageRank: 2.8 },
    { name: 'V0', website: 'v0.dev', prevalence: 22.5, averageRank: 6.7 },
    { name: 'Figma Make', website: 'figma.com', prevalence: 17.5, averageRank: 4.0 },
    { name: 'Lovable', website: 'lovable.dev', prevalence: 12.5, averageRank: 3.0, highlight: true },
    { name: 'Replit', website: 'replit.com', prevalence: 12.5, averageRank: 4.0 },
    { name: 'Claude', website: 'claude.ai', prevalence: 10.0, averageRank: 2.0 }
  ];

  const getVolumeIcon = (volume) => {
    const bars = volume === 'high' ? 5 : volume === 'medium' ? 3 : 1;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 h-3 rounded-sm ${
              i < bars ? 'bg-blue-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderPresenceRank = (brand) => {
    if (brand.present) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Yes</Badge>
          <span className="font-medium text-sm">{brand.rank}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center gap-1">
          <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">No</Badge>
          <span className="text-slate-400 text-sm">-</span>
        </div>
      );
    }
  };

  // Filter data based on selections
  const filteredPrompts = promptAnalysisDataWithLLMs.slice(0, promptsPerPage);
  
  // Generate table rows with multi-row structure based on selected options
  const generateTableRows = () => {
    const rows = [];
    
    filteredPrompts.forEach((promptData, promptIndex) => {
      const filteredLLMs = selectedLLMs.filter(llmName => promptData.llms[llmName]);
      
      filteredLLMs.forEach((llmName, llmIndex) => {
        const llmData = promptData.llms[llmName];
        const isFirstRowOfPrompt = llmIndex === 0;
        const isLastRowOfPrompt = llmIndex === filteredLLMs.length - 1;
        
        rows.push(
          <TableRow key={`${promptIndex}-${llmIndex}`} className={isLastRowOfPrompt ? 'border-b-2 border-slate-200' : ''}>
            {isFirstRowOfPrompt && (
              <TableCell 
                className="font-medium max-w-xs align-top border-r border-slate-200" 
                rowSpan={filteredLLMs.length}
              >
                <div className="space-y-2">
                  <div className="text-sm">{promptData.prompt}</div>
                  <div className="flex items-center gap-2">
                    {getVolumeIcon(promptData.volume)}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            )}
            <TableCell className="text-sm font-medium text-slate-700 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {availableLLMs.find(llm => llm.id === llmName)?.logo}
                </span>
                {llmName}
              </div>
            </TableCell>
            <TableCell className="text-center">
              {renderPresenceRank(llmData.lovable)}
            </TableCell>
            {selectedCompetitors.includes('bolt') && (
              <TableCell className="text-center">
                {renderPresenceRank(llmData.bolt)}
              </TableCell>
            )}
            {selectedCompetitors.includes('v0') && (
              <TableCell className="text-center">
                {renderPresenceRank(llmData.v0)}
              </TableCell>
            )}
            {selectedCompetitors.includes('figmaMake') && (
              <TableCell className="text-center">
                {renderPresenceRank(llmData.figmaMake)}
              </TableCell>
            )}
          </TableRow>
        );
      });
    });
    
    return rows;
  };

  const handleLLMToggle = (llmId: string, checked: boolean) => {
    if (checked) {
      setSelectedLLMs([...selectedLLMs, llmId]);
    } else {
      setSelectedLLMs(selectedLLMs.filter(id => id !== llmId));
    }
  };

  const handleCompetitorToggle = (competitorId: string, checked: boolean) => {
    if (checked) {
      setSelectedCompetitors([...selectedCompetitors, competitorId]);
    } else {
      setSelectedCompetitors(selectedCompetitors.filter(id => id !== competitorId));
    }
  };

  const applyCustomizations = () => {
    setIsCustomizeOpen(false);
  };

  // Chart configs for ChartContainer
  const chartConfig = {
    positive: {
      label: "Positive",
      color: "#10b981",
    },
    neutral: {
      label: "Neutral", 
      color: "#f59e0b",
    },
    negative: {
      label: "Negative",
      color: "#ef4444",
    },
    lovable: {
      label: "Lovable",
      color: "#3b82f6",
    },
    bolt: {
      label: "Bolt",
      color: "#10b981",
    },
    v0: {
      label: "V0",
      color: "#8b5cf6",
    },
    figmaMake: {
      label: "Figma Make",
      color: "#f59e0b",
    }
  };

  return (
    <TooltipProvider>
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
              <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
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
                    <ResponsiveContainer width="100%" height={256}>
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Share vs. Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={256}>
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
                        <Tooltip />
                      </ScatterChart>
                    </ResponsiveContainer>
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

            <TabsContent value="prompt-analysis" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Prompt Analysis</h1>
                  <p className="text-slate-600 mt-2">How Lovable appears in LLM responses across different queries</p>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-sm text-slate-600 mb-2">Average Rank</h3>
                    <p className="text-3xl font-bold text-slate-900">2.3</p>
                    <p className="text-xs text-slate-500 mt-1">Average product position within prompt results</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <h3 className="text-sm text-slate-600 mb-2">Prevalence</h3>
                    <p className="text-3xl font-bold text-slate-900">60%</p>
                    <p className="text-xs text-slate-500 mt-1">% of total prompt runs in which your product appears</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <h3 className="text-sm text-slate-600 mb-2">Category Rank</h3>
                    <p className="text-3xl font-bold text-slate-900">2<span className="text-lg text-slate-500">/4</span></p>
                    <p className="text-xs text-slate-500 mt-1">Ranked by prevalence relative to all products in prompt results</p>
                  </CardContent>
                </Card>
              </div>

              {/* Prompt Analysis Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Prompts
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Customize view
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Customize View</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* LLM Selection */}
                            <div>
                              <h3 className="font-semibold mb-3">Select LLMs to Display</h3>
                              <div className="grid grid-cols-2 gap-3">
                                {availableLLMs.map((llm) => (
                                  <div key={llm.id} className="flex items-center space-x-3">
                                    <Checkbox
                                      id={llm.id}
                                      checked={selectedLLMs.includes(llm.id)}
                                      onCheckedChange={(checked) => handleLLMToggle(llm.id, checked)}
                                    />
                                    <label htmlFor={llm.id} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                      <span className="text-lg">{llm.logo}</span>
                                      {llm.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Prompts per page */}
                            <div>
                              <h3 className="font-semibold mb-3">Prompts per Page</h3>
                              <div className="flex gap-2">
                                {promptsPerPageOptions.map((option) => (
                                  <Button
                                    key={option}
                                    variant={promptsPerPage === option ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPromptsPerPage(option)}
                                  >
                                    {option}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Competitor Selection */}
                            <div>
                              <h3 className="font-semibold mb-3">Select Competitors</h3>
                              <div className="grid grid-cols-2 gap-3">
                                {availableCompetitors.map((competitor) => (
                                  <div key={competitor.id} className="flex items-center space-x-3">
                                    <Checkbox
                                      id={competitor.id}
                                      checked={selectedCompetitors.includes(competitor.id)}
                                      onCheckedChange={(checked) => handleCompetitorToggle(competitor.id, checked)}
                                    />
                                    <label htmlFor={competitor.id} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                      <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: competitor.color }}
                                      />
                                      {competitor.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsCustomizeOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={applyCustomizations}>
                                Apply Changes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit prompts
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add new prompt
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Local:</span>
                      <Badge variant="outline">Global</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Language:</span>
                      <Badge variant="outline">English</Badge>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Coming soon: choose your preferred Local and Language</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-64">Prompt</TableHead>
                        <TableHead className="w-32">LLM</TableHead>
                        <TableHead className="text-center">Lovable<br/><span className="text-xs text-slate-500">Present | Rank</span></TableHead>
                        {selectedCompetitors.includes('bolt') && (
                          <TableHead className="text-center">Bolt<br/><span className="text-xs text-slate-500">Present | Rank</span></TableHead>
                        )}
                        {selectedCompetitors.includes('v0') && (
                          <TableHead className="text-center">V0<br/><span className="text-xs text-slate-500">Present | Rank</span></TableHead>
                        )}
                        {selectedCompetitors.includes('figmaMake') && (
                          <TableHead className="text-center">Figma Make<br/><span className="text-xs text-slate-500">Present | Rank</span></TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generateTableRows()}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationPrevious href="#" />
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardContent>
              </Card>

              {/* All Competitors Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Competitors</CardTitle>
                  <p className="text-sm text-slate-600">105 Competitors identified across all prompts</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competitor</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead className="text-center">Prevalence %</TableHead>
                        <TableHead className="text-center">Average Rank</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitorAnalysis.map((competitor, index) => (
                        <TableRow key={index} className={competitor.highlight ? 'bg-blue-50' : undefined}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {competitor.name}
                              {competitor.highlight && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                  Your Product
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a 
                              href={`https://${competitor.website}`} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {competitor.website}
                            </a>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {competitor.prevalence}%
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {competitor.averageRank}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Product Sentiment Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Sentiment</CardTitle>
                  <p className="text-sm text-slate-600">Sentiment analysis reveals how ChatGPT views your product's strengths and weaknesses.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-slate-900">Strengths</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <strong>Strong AI-powered development:</strong> Lovable offers advanced AI-driven code generation tailored to modern web development, ensuring high-quality, maintainable code output.
                        </div>
                        <div className="text-sm">
                          <strong>Visual interface design:</strong> Emphasis on intuitive visual programming allows developers to see changes in real-time, setting Lovable apart from more traditional development tools.
                        </div>
                        <div className="text-sm">
                          <strong>Rapid prototyping capabilities:</strong> Enables quick iteration and testing of ideas, making it ideal for startups and rapid development cycles.
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-slate-900">Drawbacks</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <strong>Limited enterprise features:</strong> Compared to competitors, resulting in fewer options for large-scale enterprise deployments and advanced security requirements.
                        </div>
                        <div className="text-sm">
                          <strong>Pricing structure concerns:</strong> Some users find the pricing less justified compared to feature-rich alternatives offered by competitors.
                        </div>
                        <div className="text-sm">
                          <strong>Team collaboration limitations:</strong> Advanced team features and collaborative development tools need improvement for larger development teams.
                        </div>
                      </div>
                    </div>
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
                    <ResponsiveContainer width="100%" height={256}>
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
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
                      <h3 className="font-semibold text-slate-900">Dominate AI-Powered Development</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      35% market share in AI development tools—expand visual programming to outpace competitors.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-green-100 text-green-800">2</Badge>
                      <h3 className="font-semibold text-slate-900">Win Enterprise Market</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Compete with Bolt/V0 (28%/22% share) via enterprise-grade security and collaboration features.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-purple-100 text-purple-800">3</Badge>
                      <h3 className="font-semibold text-slate-900">Lead Content & Education</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Invest in tutorial content and developer education to maintain thought leadership position.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-orange-100 text-orange-800">4</Badge>
                      <h3 className="font-semibold text-slate-900">Expand Integration Ecosystem</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Leverage API integrations and third-party tools to increase developer adoption and retention.
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
                    <ResponsiveContainer width="100%" height={256}>
                      <LineChart data={competitiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Lovable" stroke="#3b82f6" strokeWidth={3} />
                        <Line type="monotone" dataKey="Bolt" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="V0" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Figma Make" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Share Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={256}>
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Demo;
