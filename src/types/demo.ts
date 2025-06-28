export interface MetricData {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface TimeSeriesDataPoint {
  name: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface PromptData {
  id: string;
  prompt: string;
  category: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  confidence: number;
  timestamp: string;
  source: string;
  region: string;
  industry: string;
  userType: string;
  keywords: string[];
  length: number;
  complexity: 'Low' | 'Medium' | 'High';
  responseTime: number;
  satisfaction: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface CompetitorData {
  company: string;
  marketShare: number;
  growth: number;
  satisfaction: number;
  features: number;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
}

export interface FilterState {
  sentiment?: string;
  category?: string;
  region?: string;
  industry?: string;
  userType?: string;
  dateRange?: string;
  priority?: string;
  complexity?: string;
}

export interface CustomizationOptions {
  showConfidence: boolean;
  showTimestamp: boolean;
  showSource: boolean;
  showKeywords: boolean;
  showMetrics: boolean;
  compactView: boolean;
  darkMode: boolean;
  autoRefresh: boolean;
  groupByCategory: boolean;
  highlightHighPriority: boolean;
}
