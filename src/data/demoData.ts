import { PromptData, CompetitorData, ChartDataPoint, MetricData, TimeSeriesDataPoint, EnhancedPromptData } from '@/types/demo';

export const mockPrompts: PromptData[] = [
  {
    id: '1',
    prompt: 'How can I improve my marketing strategy for Q4?',
    category: 'Marketing',
    sentiment: 'Positive',
    confidence: 85,
    timestamp: '2024-01-15 14:30',
    source: 'Web App',
    region: 'North America',
    industry: 'Technology',
    userType: 'Business',
    keywords: ['marketing', 'strategy', 'Q4', 'improvement'],
    length: 48,
    complexity: 'Medium',
    responseTime: 1.2,
    satisfaction: 4.5,
    priority: 'High'
  },
  {
    id: '2',
    prompt: 'The new feature is confusing and hard to use',
    category: 'Product Feedback',
    sentiment: 'Negative',
    confidence: 92,
    timestamp: '2024-01-15 13:45',
    source: 'Mobile App',
    region: 'Europe',
    industry: 'Healthcare',
    userType: 'Individual',
    keywords: ['feature', 'confusing', 'usability'],
    length: 42,
    complexity: 'Low',
    responseTime: 0.8,
    satisfaction: 2.1,
    priority: 'High'
  },
  {
    id: '3',
    prompt: 'What are the best practices for customer retention?',
    category: 'Customer Success',
    sentiment: 'Neutral',
    confidence: 78,
    timestamp: '2024-01-15 12:15',
    source: 'API',
    region: 'Asia',
    industry: 'Finance',
    userType: 'Business',
    keywords: ['customer', 'retention', 'best practices'],
    length: 52,
    complexity: 'High',
    responseTime: 2.1,
    satisfaction: 4.2,
    priority: 'Medium'
  },
  {
    id: '4',
    prompt: 'Love the new dashboard design! Very intuitive.',
    category: 'Product Feedback',
    sentiment: 'Positive',
    confidence: 96,
    timestamp: '2024-01-15 11:30',
    source: 'Web App',
    region: 'North America',
    industry: 'Education',
    userType: 'Individual',
    keywords: ['dashboard', 'design', 'intuitive'],
    length: 45,
    complexity: 'Low',
    responseTime: 0.9,
    satisfaction: 4.8,
    priority: 'Low'
  },
  {
    id: '5',
    prompt: 'Can you help me analyze sales data trends?',
    category: 'Analytics',
    sentiment: 'Neutral',
    confidence: 88,
    timestamp: '2024-01-15 10:45',
    source: 'Mobile App',
    region: 'Europe',
    industry: 'Retail',
    userType: 'Business',
    keywords: ['sales', 'data', 'trends', 'analysis'],
    length: 43,
    complexity: 'High',
    responseTime: 1.8,
    satisfaction: 4.1,
    priority: 'Medium'
  }
];

export const availableLLMs = ['ChatGPT', 'Google AI Search', 'Claude', 'Perplexity', 'Grok'];
export const availableCompetitors = ['bolt', 'v0', 'Figma Make'];

export const enhancedMockPrompts: EnhancedPromptData[] = [
  {
    id: '1',
    prompt: 'How can I improve my marketing strategy for Q4?',
    category: 'Marketing',
    sentiment: 'Positive',
    confidence: 85,
    timestamp: '2024-01-15 14:30',
    source: 'Web App',
    region: 'North America',
    industry: 'Technology',
    userType: 'Business',
    keywords: ['marketing', 'strategy', 'Q4', 'improvement'],
    length: 48,
    complexity: 'Medium',
    responseTime: 1.2,
    satisfaction: 4.5,
    priority: 'High',
    volume: 4,
    llmData: [
      {
        llm: 'ChatGPT',
        lovablePresence: true,
        lovableRank: 3,
        competitors: {
          'bolt': { presence: true, rank: 1 },
          'v0': { presence: true, rank: 2 },
          'Figma Make': { presence: false }
        }
      },
      {
        llm: 'Google AI Search',
        lovablePresence: true,
        lovableRank: 2,
        competitors: {
          'bolt': { presence: true, rank: 1 },
          'v0': { presence: false },
          'Figma Make': { presence: true, rank: 4 }
        }
      },
      {
        llm: 'Claude',
        lovablePresence: false,
        competitors: {
          'bolt': { presence: true, rank: 1 },
          'v0': { presence: true, rank: 2 },
          'Figma Make': { presence: false }
        }
      },
      {
        llm: 'Perplexity',
        lovablePresence: true,
        lovableRank: 1,
        competitors: {
          'bolt': { presence: true, rank: 2 },
          'v0': { presence: false },
          'Figma Make': { presence: true, rank: 3 }
        }
      },
      {
        llm: 'Grok',
        lovablePresence: false,
        competitors: {
          'bolt': { presence: false },
          'v0': { presence: true, rank: 1 },
          'Figma Make': { presence: false }
        }
      }
    ]
  },
  {
    id: '2',
    prompt: 'The new feature is confusing and hard to use',
    category: 'Product Feedback',
    sentiment: 'Negative',
    confidence: 92,
    timestamp: '2024-01-15 13:45',
    source: 'Mobile App',
    region: 'Europe',
    industry: 'Healthcare',
    userType: 'Individual',
    keywords: ['feature', 'confusing', 'usability'],
    length: 42,
    complexity: 'Low',
    responseTime: 0.8,
    satisfaction: 2.1,
    priority: 'High',
    volume: 3,
    llmData: [
      {
        llm: 'ChatGPT',
        lovablePresence: true,
        lovableRank: 2,
        competitors: {
          'bolt': { presence: false },
          'v0': { presence: true, rank: 1 },
          'Figma Make': { presence: true, rank: 3 }
        }
      },
      {
        llm: 'Google AI Search',
        lovablePresence: false,
        competitors: {
          'bolt': { presence: true, rank: 1 },
          'v0': { presence: false },
          'Figma Make': { presence: false }
        }
      },
      {
        llm: 'Claude',
        lovablePresence: true,
        lovableRank: 1,
        competitors: {
          'bolt': { presence: true, rank: 2 },
          'v0': { presence: true, rank: 3 },
          'Figma Make': { presence: false }
        }
      },
      {
        llm: 'Perplexity',
        lovablePresence: false,
        competitors: {
          'bolt': { presence: true, rank: 1 },
          'v0': { presence: false },
          'Figma Make': { presence: true, rank: 2 }
        }
      },
      {
        llm: 'Grok',
        lovablePresence: true,
        lovableRank: 1,
        competitors: {
          'bolt': { presence: false },
          'v0': { presence: false },
          'Figma Make': { presence: false }
        }
      }
    ]
  }
];

export const sentimentData: ChartDataPoint[] = [
  { name: 'Positive', value: 45, color: '#10B981' },
  { name: 'Neutral', value: 30, color: '#6B7280' },
  { name: 'Negative', value: 25, color: '#EF4444' }
];

export const categoryData: ChartDataPoint[] = [
  { name: 'Product Feedback', value: 35 },
  { name: 'Marketing', value: 25 },
  { name: 'Customer Success', value: 20 },
  { name: 'Analytics', value: 20 }
];

export const timeSeriesData: TimeSeriesDataPoint[] = [
  { name: 'Jan', positive: 65, negative: 35, neutral: 45 },
  { name: 'Feb', positive: 70, negative: 30, neutral: 50 },
  { name: 'Mar', positive: 75, negative: 25, neutral: 55 },
  { name: 'Apr', positive: 80, negative: 20, neutral: 60 },
  { name: 'May', positive: 85, negative: 15, neutral: 65 },
  { name: 'Jun', positive: 90, negative: 10, neutral: 70 }
];

export const competitorData: CompetitorData[] = [
  {
    company: 'Competitor A',
    marketShare: 35,
    growth: 12,
    satisfaction: 4.2,
    features: 85,
    pricing: '$99/month',
    strengths: ['Strong brand', 'Good support'],
    weaknesses: ['High price', 'Complex UI']
  },
  {
    company: 'Competitor B',
    marketShare: 28,
    growth: 8,
    satisfaction: 3.9,
    features: 78,
    pricing: '$79/month',
    strengths: ['Affordable', 'Easy to use'],
    weaknesses: ['Limited features', 'Poor integration']
  },
  {
    company: 'Our Product',
    marketShare: 22,
    growth: 25,
    satisfaction: 4.5,
    features: 92,
    pricing: '$89/month',
    strengths: ['Innovation', 'Great UX'],
    weaknesses: ['New brand', 'Limited market presence']
  }
];

export const dashboardMetrics: MetricData[] = [
  { label: 'Total Prompts', value: '12,847', change: '+12%', trend: 'up' },
  { label: 'Avg Confidence', value: '87.3%', change: '+2.1%', trend: 'up' },
  { label: 'Response Time', value: '1.2s', change: '-15%', trend: 'up' },
  { label: 'User Satisfaction', value: '4.2/5', change: '+0.3', trend: 'up' }
];
