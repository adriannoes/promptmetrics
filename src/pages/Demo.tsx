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
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, MessageSquare, Target, BarChart3, ExternalLink, Info, Edit, Plus, Settings, ThumbsUp, ThumbsDown, AlertTriangle, Star, Clock, Filter, Download, XCircle } from 'lucide-react';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Customize view state - removed promptsPerPage
  const [selectedLLMs, setSelectedLLMs] = useState(['ChatGPT', 'Google AI Search', 'Claude', 'Perplexity', 'Grok']);
  const [selectedCompetitors, setSelectedCompetitors] = useState(['bolt', 'v0', 'figmaMake']);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedPromptDetails, setSelectedPromptDetails] = useState(null);
  const [isPromptDetailsOpen, setIsPromptDetailsOpen] = useState(false);

  // Available options - removed promptsPerPageOptions
  const availableLLMs = [
    { id: 'ChatGPT', name: 'ChatGPT' },
    { id: 'Google AI Search', name: 'Google AI Search' },
    { id: 'Claude', name: 'Claude' },
    { id: 'Perplexity', name: 'Perplexity' },
    { id: 'Grok', name: 'Grok' }
  ];

  const availableCompetitors = [
    { id: 'bolt', name: 'Bolt', color: '#10b981' },
    { id: 'v0', name: 'V0', color: '#8b5cf6' },
    { id: 'figmaMake', name: 'Figma Make', color: '#f59e0b' }
  ];

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

  // Enhanced data for prompt analysis with LLM breakdown and detailed answers - set to 5 prompts
  const promptAnalysisDataWithLLMs = [
    { 
      prompt: "best AI code editor",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: false, rank: null },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable stands out as an exceptional AI-powered code editor with intuitive visual programming capabilities.' },
              { name: 'GitHub Copilot', rank: 2, sentiment: 'positive', mention: 'GitHub Copilot provides excellent code suggestions and completions.' },
              { name: 'Bolt', rank: 3, sentiment: 'neutral', mention: 'Bolt offers decent AI assistance for web development.' }
            ]
          }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 4 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt.new is a popular choice for rapid web development with AI assistance.' },
              { name: 'Lovable', rank: 2, sentiment: 'positive', mention: 'Lovable provides powerful visual programming with AI code generation.' },
              { name: 'Cursor', rank: 3, sentiment: 'positive', mention: 'Cursor offers advanced AI-powered coding features.' },
              { name: 'V0', rank: 4, sentiment: 'neutral', mention: 'V0 by Vercel provides AI-powered component generation.' }
            ]
          }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 5 },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable excels in AI-driven development with excellent visual interface design.' },
              { name: 'Bolt', rank: 2, sentiment: 'positive', mention: 'Bolt provides solid AI coding assistance for web projects.' },
              { name: 'Replit', rank: 3, sentiment: 'neutral', mention: 'Replit offers collaborative coding with AI features.' },
              { name: 'Tabnine', rank: 4, sentiment: 'neutral', mention: 'Tabnine provides AI code completions across multiple IDEs.' },
              { name: 'Figma Make', rank: 5, sentiment: 'negative', mention: 'Figma Make has limited AI coding capabilities compared to dedicated code editors.' }
            ]
          }
        },
        "Perplexity": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 4 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable is highly regarded for its AI-powered visual development environment.' },
              { name: 'GitHub Copilot', rank: 2, sentiment: 'positive', mention: 'GitHub Copilot remains a top choice for AI-assisted coding.' },
              { name: 'V0', rank: 3, sentiment: 'neutral', mention: 'V0 offers good component generation capabilities.' },
              { name: 'Bolt', rank: 4, sentiment: 'neutral', mention: 'Bolt provides reasonable AI coding support.' }
            ]
          }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 3 },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt.new is recommended for quick AI-powered web development.' },
              { name: 'V0', rank: 2, sentiment: 'positive', mention: 'V0 by Vercel provides excellent component generation.' },
              { name: 'Figma Make', rank: 3, sentiment: 'neutral', mention: 'Figma Make offers design-to-code capabilities.' }
            ]
          }
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
          figmaMake: { present: true, rank: 5 },
          details: {
            products: [
              { name: 'V0', rank: 1, sentiment: 'positive', mention: 'V0 leads in visual component generation with excellent UI previews.' },
              { name: 'Lovable', rank: 2, sentiment: 'positive', mention: 'Lovable excels at visual programming with real-time code generation.' },
              { name: 'Webflow', rank: 3, sentiment: 'positive', mention: 'Webflow provides comprehensive visual web development.' },
              { name: 'Bolt', rank: 4, sentiment: 'neutral', mention: 'Bolt offers some visual programming features.' },
              { name: 'Figma Make', rank: 5, sentiment: 'negative', mention: 'Figma Make has limited visual programming capabilities.' }
            ]
          }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable stands out for visual programming with AI assistance.' },
              { name: 'V0', rank: 2, sentiment: 'positive', mention: 'V0 provides excellent visual component creation.' },
              { name: 'Bolt', rank: 3, sentiment: 'neutral', mention: 'Bolt offers visual development features.' },
              { name: 'Figma Make', rank: 4, sentiment: 'neutral', mention: 'Figma Make bridges design and development.' }
            ]
          }
        },
        "Claude": {
          lovable: { present: true, rank: 3 },
          bolt: { present: false, rank: null },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 2 },
          details: {
            products: [
              { name: 'V0', rank: 1, sentiment: 'positive', mention: 'V0 is excellent for visual programming and component generation.' },
              { name: 'Figma Make', rank: 2, sentiment: 'neutral', mention: 'Figma Make provides design-to-code capabilities.' },
              { name: 'Lovable', rank: 3, sentiment: 'positive', mention: 'Lovable offers strong visual programming features.' }
            ]
          }
        },
        "Perplexity": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'V0', rank: 1, sentiment: 'positive', mention: 'V0 leads in visual programming for React components.' },
              { name: 'Lovable', rank: 2, sentiment: 'positive', mention: 'Lovable provides excellent visual development environment.' },
              { name: 'Bolt', rank: 3, sentiment: 'neutral', mention: 'Bolt offers visual programming capabilities.' }
            ]
          }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 1 },
          figmaMake: { present: true, rank: 3 },
          details: {
            products: [
              { name: 'V0', rank: 1, sentiment: 'positive', mention: 'V0 by Vercel is top choice for visual programming.' },
              { name: 'Bolt', rank: 2, sentiment: 'neutral', mention: 'Bolt provides visual development features.' },
              { name: 'Figma Make', rank: 3, sentiment: 'neutral', mention: 'Figma Make offers design-to-code workflow.' }
            ]
          }
        }
      },
      volume: 'medium' 
    },
    { 
      prompt: "no-code web development",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 3 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: true, rank: 4 },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt.new excels in no-code web development with AI assistance.' },
              { name: 'V0', rank: 2, sentiment: 'positive', mention: 'V0 provides excellent no-code component generation.' },
              { name: 'Lovable', rank: 3, sentiment: 'positive', mention: 'Lovable offers intuitive no-code development with visual programming.' },
              { name: 'Figma Make', rank: 4, sentiment: 'neutral', mention: 'Figma Make provides basic no-code capabilities.' }
            ]
          }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt is highly recommended for no-code web development.' },
              { name: 'Lovable', rank: 2, sentiment: 'positive', mention: 'Lovable makes web development accessible without coding.' },
              { name: 'V0', rank: 3, sentiment: 'neutral', mention: 'V0 offers no-code component creation.' }
            ]
          }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 3 },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable leads in no-code development with excellent visual tools.' },
              { name: 'Bolt', rank: 2, sentiment: 'positive', mention: 'Bolt provides solid no-code development features.' },
              { name: 'Figma Make', rank: 3, sentiment: 'neutral', mention: 'Figma Make offers limited no-code functionality.' }
            ]
          }
        },
        "Perplexity": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 3 },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable is top choice for no-code web development.' },
              { name: 'Bolt', rank: 2, sentiment: 'positive', mention: 'Bolt offers excellent no-code capabilities.' },
              { name: 'V0', rank: 3, sentiment: 'neutral', mention: 'V0 provides no-code component generation.' }
            ]
          }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt is recommended for no-code development.' },
              { name: 'V0', rank: 2, sentiment: 'neutral', mention: 'V0 provides no-code tools.' }
            ]
          }
        }
      },
      volume: 'low' 
    },
    { 
      prompt: "web development automation",
      llms: {
        "ChatGPT": {
          lovable: { present: true, rank: 2 },
          bolt: { present: true, rank: 1 },
          v0: { present: false, rank: null },
          figmaMake: { present: true, rank: 3 },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt leads in web development automation.' },
              { name: 'Lovable', rank: 2, sentiment: 'positive', mention: 'Lovable provides excellent automation features.' },
              { name: 'Figma Make', rank: 3, sentiment: 'neutral', mention: 'Figma Make offers basic automation capabilities.' }
            ]
          }
        },
        "Google AI Search": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: true, rank: 3 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable excels in development automation.' },
              { name: 'Bolt', rank: 2, sentiment: 'positive', mention: 'Bolt provides strong automation capabilities.' },
              { name: 'V0', rank: 3, sentiment: 'neutral', mention: 'V0 offers automation features.' }
            ]
          }
        },
        "Claude": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 2 },
          v0: { present: false, rank: null },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable is top choice for web development automation.' },
              { name: 'Bolt', rank: 2, sentiment: 'positive', mention: 'Bolt provides good automation tools.' }
            ]
          }
        },
        "Perplexity": {
          lovable: { present: true, rank: 1 },
          bolt: { present: true, rank: 3 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Lovable', rank: 1, sentiment: 'positive', mention: 'Lovable leads in development automation.' },
              { name: 'V0', rank: 2, sentiment: 'neutral', mention: 'V0 provides automation capabilities.' },
              { name: 'Bolt', rank: 3, sentiment: 'neutral', mention: 'Bolt offers automation features.' }
            ]
          }
        },
        "Grok": {
          lovable: { present: false, rank: null },
          bolt: { present: true, rank: 1 },
          v0: { present: true, rank: 2 },
          figmaMake: { present: false, rank: null },
          details: {
            products: [
              { name: 'Bolt', rank: 1, sentiment: 'positive', mention: 'Bolt is recommended for automation.' },
              { name: 'V0', rank: 2, sentiment: 'neutral', mention: 'V0 provides automation tools.' }
            ]
          }
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

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800 text-xs">Positive</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800 text-xs">Negative</Badge>;
      case 'neutral':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Neutral</Badge>;
    }
  };

  // Filter data to show only 5 prompts
  const filteredPrompts = promptAnalysisDataWithLLMs.slice(0, 5);
  
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedPromptDetails(promptData);
                        setIsPromptDetailsOpen(true);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            )}
            <TableCell className="text-sm font-medium text-slate-700 bg-slate-50">
              <div className="flex items-center gap-2">
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

  // Enhanced sentiment analysis data
  const sentimentByLLM = [
    { llm: 'ChatGPT', lovable: 78, bolt: 72, v0: 65, figmaMake: 58 },
    { llm: 'Google AI Search', lovable: 82, bolt: 69, v0: 71, figmaMake: 62 },
    { llm: 'Claude', lovable: 85, bolt: 75, v0: 68, figmaMake: 55 },
    { llm: 'Perplexity', lovable: 80, bolt: 73, v0: 66, figmaMake: 60 },
    { llm: 'Grok', lovable: 65, bolt: 78, v0: 74, figmaMake: 63 }
  ];

  const criticalPrompts = [
    { 
      prompt: "enterprise development tools", 
      sentiment: -15, 
      mentions: 89,
      issue: "Limited enterprise features compared to competitors",
      impact: "high"
    },
    { 
      prompt: "team collaboration platforms", 
      sentiment: -8, 
      mentions: 67,
      issue: "Weak team collaboration tools",
      impact: "high"
    },
    { 
      prompt: "scalable web development", 
      sentiment: -12, 
      mentions: 45,
      issue: "Scalability concerns for large projects",
      impact: "medium"
    },
    { 
      prompt: "API integration tools", 
      sentiment: -6, 
      mentions: 38,
      issue: "Limited third-party integrations",
      impact: "medium"
    }
  ];

  const sentimentStrengths = [
    { 
      strength: "AI-Powered Development", 
      sentiment: 92, 
      mentions: 234,
      description: "Users consistently praise Lovable's intelligent code generation and AI assistance"
    },
    { 
      strength: "Visual Programming Interface", 
      sentiment: 88, 
      mentions: 198,
      description: "Real-time visual feedback and intuitive design tools receive high praise"
    },
    { 
      strength: "Rapid Prototyping", 
      sentiment: 85, 
      mentions: 167,
      description: "Speed of development and quick iteration capabilities are highly valued"
    },
    { 
      strength: "User Experience", 
      sentiment: 83, 
      mentions: 145,
      description: "Clean interface and ease of use consistently mentioned positively"
    }
  ];

  const sentimentDrawbacks = [
    { 
      drawback: "Enterprise Features", 
      sentiment: -18, 
      mentions: 156,
      description: "Lack of advanced enterprise security, compliance, and management features"
    },
    { 
      drawback: "Team Collaboration", 
      sentiment: -15, 
      mentions: 123,
      description: "Limited real-time collaboration tools for development teams"
    },
    { 
      drawback: "Advanced Integrations", 
      sentiment: -12, 
      mentions: 98,
      description: "Fewer third-party integrations compared to established competitors"
    },
    { 
      drawback: "Custom Deployment", 
      sentiment: -10, 
      mentions: 87,
      description: "Limited options for custom hosting and deployment configurations"
    }
  ];

  const overallSentimentComparison = [
    { brand: 'Lovable', sentiment: 77.6, color: '#3b82f6' },
    { brand: 'Bolt', sentiment: 73.4, color: '#10b981' },
    { brand: 'V0', sentiment: 68.8, color: '#8b5cf6' },
    { brand: 'Figma Make', sentiment: 59.6, color: '#f59e0b' }
  ];

  const sentimentTrends = [
    { month: 'Jan', lovable: 75, bolt: 70, v0: 65, figmaMake: 58 },
    { month: 'Feb', lovable: 76, bolt: 72, v0: 67, figmaMake: 59 },
    { month: 'Mar', lovable: 78, bolt: 73, v0: 68, figmaMake: 60 },
    { month: 'Apr', lovable: 77, bolt: 74, v0: 69, figmaMake: 59 },
    { month: 'May', lovable: 79, bolt: 73, v0: 68, figmaMake: 61 },
    { month: 'Jun', lovable: 78, bolt: 73, v0: 69, figmaMake: 60 }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="prompt-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt-analysis" className="space-y-8">
            {/* First section with 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">Total Prompts</h3>
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-blue-900">2,847</p>
                  <p className="text-sm text-blue-600">+12% from last month</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800">Avg Response Time</h3>
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-green-900">1.2s</p>
                  <p className="text-sm text-green-600">-0.3s improvement</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-800">Success Rate</h3>
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-900">94.2%</p>
                  <p className="text-sm text-purple-600">+2.1% increase</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-800">Sentiment Score</h3>
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-orange-900">7.4/10</p>
                  <p className="text-sm text-orange-600">Above competitor avg</p>
                </div>
              </Card>
            </div>

            {/* Prompts Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Prompts</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Customize View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Customize View</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Columns to display</label>
                          <div className="mt-2 space-y-2">
                            {['Prompt', 'Model', 'Sentiment', 'Response Time', 'Success Rate'].map((column) => (
                              <div key={column} className="flex items-center space-x-2">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <label className="text-sm">{column}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Fixed header table */}
              <div className="border rounded-lg">
                <div className="overflow-hidden">
                  {/* Fixed header */}
                  <div className="bg-gray-50 border-b sticky top-0 z-10">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm text-gray-700">
                      <div>Prompt</div>
                      <div>Model</div>
                      <div>Sentiment</div>
                      <div>Response Time</div>
                      <div>Success Rate</div>
                    </div>
                  </div>
                  
                  {/* Scrollable content */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="divide-y">
                      {[
                        {
                          prompt: "What are the best features of TechFlow?",
                          model: "GPT-4",
                          sentiment: "Positive",
                          responseTime: "1.2s",
                          successRate: "98%"
                        },
                        {
                          prompt: "Compare TechFlow with competitors",
                          model: "Claude",
                          sentiment: "Neutral",
                          responseTime: "0.9s",
                          successRate: "95%"
                        },
                        {
                          prompt: "TechFlow pricing concerns",
                          model: "Gemini",
                          sentiment: "Negative",
                          responseTime: "1.5s",
                          successRate: "89%"
                        },
                        {
                          prompt: "How reliable is TechFlow?",
                          model: "GPT-4",
                          sentiment: "Positive",
                          responseTime: "1.1s",
                          successRate: "97%"
                        },
                        {
                          prompt: "TechFlow customer support experience",
                          model: "Claude",
                          sentiment: "Positive",
                          responseTime: "1.3s",
                          successRate: "94%"
                        }
                      ].map((row, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50">
                          <div className="text-sm">{row.prompt}</div>
                          <div className="text-sm">
                            <Badge variant="outline">{row.model}</Badge>
                          </div>
                          <div className="text-sm">
                            <Badge 
                              variant={row.sentiment === 'Positive' ? 'default' : row.sentiment === 'Negative' ? 'destructive' : 'secondary'}
                            >
                              {row.sentiment}
                            </Badge>
                          </div>
                          <div className="text-sm">{row.responseTime}</div>
                          <div className="text-sm">{row.successRate}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sentiment Analysis Section - renamed from Product Sentiment Analysis */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              {/* ... keep existing code (sentiment analysis content remains the same) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Overall Sentiment Comparison
                  </h3>
                  <div className="space-y-4">
                    {[
                      { brand: "Your Product", score: 7.4, change: "+0.3", color: "bg-blue-500" },
                      { brand: "Competitor A", score: 6.8, change: "-0.1", color: "bg-gray-400" },
                      { brand: "Competitor B", score: 6.2, change: "+0.2", color: "bg-gray-400" },
                      { brand: "Competitor C", score: 5.9, change: "-0.4", color: "bg-gray-400" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.brand}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.score}/10</span>
                          <span className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Critical Prompts (Negative Sentiment)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { prompt: "TechFlow pricing too expensive", severity: "High", score: 2.1 },
                      { prompt: "Customer support response time", severity: "Medium", score: 3.4 },
                      { prompt: "Integration complexity issues", severity: "Medium", score: 3.8 },
                      { prompt: "Limited customization options", severity: "Low", score: 4.2 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                        <div>
                          <p className="text-sm font-medium text-red-800">{item.prompt}</p>
                          <Badge 
                            variant={item.severity === 'High' ? 'destructive' : item.severity === 'Medium' ? 'secondary' : 'outline'}
                            className="mt-1"
                          >
                            {item.severity} Priority
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-red-600">{item.score}/10</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Top Strengths (Positive Sentiment)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { strength: "Reliability & Uptime", mentions: 342, score: 8.9 },
                      { strength: "User-Friendly Interface", mentions: 298, score: 8.7 },
                      { strength: "Performance & Speed", mentions: 276, score: 8.5 },
                      { strength: "Security Features", mentions: 201, score: 8.3 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                        <div>
                          <p className="text-sm font-medium text-green-800">{item.strength}</p>
                          <p className="text-xs text-green-600">{item.mentions} mentions</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">{item.score}/10</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Major Drawbacks (Negative Sentiment)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { drawback: "Pricing Structure", mentions: 156, score: 3.2 },
                      { drawback: "Learning Curve", mentions: 134, score: 3.8 },
                      { drawback: "Limited Integrations", mentions: 98, score: 4.1 },
                      { drawback: "Mobile Experience", mentions: 87, score: 4.3 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                        <div>
                          <p className="text-sm font-medium text-red-800">{item.drawback}</p>
                          <p className="text-xs text-red-600">{item.mentions} mentions</p>
                        </div>
                        <span className="text-sm font-bold text-red-600">{item.score}/10</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="strategic-insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Strategic Insights</h1>
                <p className="text-slate-600 mt-2">AI Tone, Critical Shifts</p>
              </div>
            </div>

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

          <TabsContent value="competitor-analysis" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Competitor Analysis</h1>
                <p className="text-slate-600 mt-2">Market Position: AI Urgent Strategic Priorities</p>
              </div>
            </div>

            {/* All Competitors Section - moved from Prompt Analysis */}
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

            {/* Business Landscape strategic priorities and charts */}
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
      </main>
    </div>
  );
};

export default Demo;
