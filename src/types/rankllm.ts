export interface RankLLMRequest {
  query: string;
  documents: Array<{ id: string; content: string; title?: string }>;
  model?: 'zephyr' | 'vicuna' | 'monot5' | 'duot5';
  top_k?: number;
  domain: string;
}

export interface RankLLMCandidate {
  docid: string;
  score: number;
  rank: number;
  doc: {
    title?: string;
    content: string;
  };
}

export interface RankLLMResult {
  query: {
    text: string;
    qid: string;
  };
  candidates: RankLLMCandidate[];
  metrics?: {
    ndcg_at_10?: number;
    processing_time_ms: number;
    model_used: string;
  };
}

export interface RankLLMResponse {
  id: string;
  domain: string;
  query: string;
  model_used: string;
  ranking_data: RankLLMResult;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface RankLLMHealthCheck {
  status: 'healthy' | 'unhealthy';
  models_available: string[];
  uptime: number;
  version: string;
}

export interface RankLLMModel {
  name: string;
  type: 'listwise' | 'pointwise' | 'pairwise';
  size: string;
  description: string;
  recommended_for: string[];
}

export interface RankLLMAnalysisData {
  summary: string;
  score: number;
  recommendations: string[];
  ranking_results: RankLLMResult[];
  model_performance: {
    model_used: string;
    processing_time_ms: number;
    confidence_score: number;
  };
  document_insights: {
    total_documents: number;
    average_relevance_score: number;
    top_keywords: string[];
  };
}
