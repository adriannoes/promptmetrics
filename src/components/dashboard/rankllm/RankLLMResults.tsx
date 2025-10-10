import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  FileText, 
  BarChart3,
  Zap
} from 'lucide-react';
import { RankLLMResponse, RankedCandidate } from '@/types/rankllm';

interface RankLLMResultsProps {
  results: RankLLMResponse[];
  loading?: boolean;
}

export const RankLLMResults: React.FC<RankLLMResultsProps> = ({ 
  results, 
  loading = false 
}) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing ranking...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Ranking Results</h3>
          <p className="text-muted-foreground">
            Submit a query and documents to see ranking results here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const latestResult = results[0];
  const { ranking_data, model_used, created_at } = latestResult;
  const { candidates, metrics } = ranking_data;

  const formatScore = (score: number) => (score * 100).toFixed(1);
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Ranking Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Documents</span>
              </div>
              <p className="text-2xl font-bold">{candidates.length}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Top Score</span>
              </div>
              <p className="text-2xl font-bold">{formatScore(candidates[0]?.score || 0)}%</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Processing Time</span>
              </div>
              <p className="text-2xl font-bold">{formatTime(metrics?.processing_time_ms || 0)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Model</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {model_used.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {candidates.slice(0, 5).map((candidate, index) => (
              <div key={candidate.docid} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Rank #{index + 1} - {candidate.doc.title || `Document ${candidate.docid}`}
                  </span>
                  <span className="text-sm font-bold">
                    {formatScore(candidate.score)}%
                  </span>
                </div>
                <Progress 
                  value={candidate.score * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Ranked Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {candidates.map((candidate, index) => (
                <Card key={candidate.docid} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {candidate.doc.title || `Document ${candidate.docid}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {candidate.docid}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {formatScore(candidate.score)}%
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Score: {candidate.score.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {candidate.doc.content}
                    </p>
                    {candidate.doc.metadata && Object.keys(candidate.doc.metadata).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(candidate.doc.metadata).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Processing Time</span>
                <p className="text-lg font-bold">{formatTime(metrics.processing_time_ms)}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Score Range</span>
                <p className="text-lg font-bold">
                  {formatScore(metrics.score_range?.min || 0)}% - {formatScore(metrics.score_range?.max || 0)}%
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Analysis Date</span>
                <p className="text-lg font-bold">
                  {new Date(created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
