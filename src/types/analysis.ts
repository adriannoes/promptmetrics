export interface ChartDataPoint {
  month: string;
  [key: string]: string | number;
}

export interface SentimentTrendData {
  month: string;
  [competitor: string]: string | number;
}

export interface RankingData {
  month: string;
  [competitor: string]: string | number;
}

export interface OverallSentimentItem {
  name: string;
  score: number;
  color: string;
}

export interface MarketShareItem {
  name: string;
  value: number;
  color: string;
}

export interface StrategicPriority {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  marketShare: number;
}

export interface CompetitorOpportunity {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

export interface CompetitorAnalysisData {
  market_share: MarketShareItem[];
  market_trends: ChartDataPoint[];
  strategic_priorities: StrategicPriority[];
  opportunities: CompetitorOpportunity[];
}

export interface LLMSentiment {
  score: number;
  confidence: number;
  explanation: string;
}

export interface PromptRanking {
  rank: number;
  score: number;
  prompt: string;
  competitors: Array<{
    name: string;
    rank: number;
    score: number;
  }>;
}

export interface PerformanceMetrics {
  responseTime: number;
  accuracy: number;
  consistency: number;
  relevance: number;
}

export interface PromptAnalysisData {
  sentiment_by_llm: Record<string, LLMSentiment>;
  ranking_by_prompt: Record<string, PromptRanking>;
  performance_metrics: Record<string, PerformanceMetrics>;
}

export interface StrategicInsightsData {
  key_insights: string[];
  recommendations: string[];
  action_items: string[];
  growth_opportunities: string[];
  competitive_threats: string[];
}

export interface AnalysisDataStructure {
  // Basic analysis info (already implemented)
  summary: string;
  score: number;
  recommendations: string[];
  
  // Advanced dashboard data
  sentiment_trends: SentimentTrendData[];
  ranking_data: RankingData[];
  overall_sentiment: OverallSentimentItem[];
  share_of_rank: ChartDataPoint[];
  
  // Competitor analysis
  competitor_analysis: CompetitorAnalysisData;
  
  // Prompt analysis  
  prompt_analysis: PromptAnalysisData;
  
  // Strategic insights
  strategic_insights: StrategicInsightsData;
}

export interface CompleteAnalysisResult {
  id: string;
  domain: string;
  status: 'processing' | 'completed' | 'failed';
  analysis_data: AnalysisDataStructure;
  created_at: string;
  updated_at: string;
}