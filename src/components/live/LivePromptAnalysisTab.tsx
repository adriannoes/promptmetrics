import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface LivePromptAnalysisTabProps {
  analysisData: AnalysisResult | null;
  loading: boolean;
}

export const LivePromptAnalysisTab: React.FC<LivePromptAnalysisTabProps> = ({ analysisData, loading }) => {
  const promptAnalysis = analysisData?.analysis_data?.prompt_analysis || [];
  const sentimentAnalysis = analysisData?.analysis_data?.sentiment_analysis || [];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analysisData || !analysisData.analysis_data) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Prompt Analysis Available</h3>
        <p className="text-muted-foreground">
          Prompt analysis data will appear here once the analysis is completed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sentiment Analysis Overview */}
      {sentimentAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Sentiment Analysis Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sentimentAnalysis.map((sentiment, index) => (
                <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {sentiment.score || 'N/A'}
                  </div>
                  <div className="text-sm font-medium mb-1">
                    {sentiment.platform || `Platform ${index + 1}`}
                  </div>
                  <Badge variant={
                    sentiment.sentiment === 'positive' ? 'default' :
                    sentiment.sentiment === 'negative' ? 'destructive' : 'secondary'
                  }>
                    {sentiment.sentiment || 'neutral'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompt Analysis Results */}
      {promptAnalysis.length > 0 ? (
        promptAnalysis.map((prompt, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                {prompt.platform || `AI Platform ${index + 1}`}
              </CardTitle>
              {prompt.timestamp && (
                <p className="text-sm text-muted-foreground">
                  Analyzed on {new Date(prompt.timestamp).toLocaleDateString()}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {prompt.query && (
                <div>
                  <h4 className="font-semibold mb-2">Query Used:</h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-md italic">
                    "{prompt.query}"
                  </p>
                </div>
              )}
              
              {prompt.response && (
                <div>
                  <h4 className="font-semibold mb-2">AI Response:</h4>
                  <div className="bg-background border rounded-md p-4">
                    <p className="text-foreground leading-relaxed">
                      {prompt.response}
                    </p>
                  </div>
                </div>
              )}

              {prompt.sentiment_score !== undefined && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sentiment Score:</span>
                    <Badge variant={
                      prompt.sentiment_score > 0.6 ? 'default' :
                      prompt.sentiment_score < 0.4 ? 'destructive' : 'secondary'
                    }>
                      {(prompt.sentiment_score * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  {prompt.ranking && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Ranking:</span>
                      <Badge variant="outline">
                        #{prompt.ranking}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {prompt.keywords && prompt.keywords.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Topics Mentioned:</h4>
                  <div className="flex flex-wrap gap-2">
                    {prompt.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Prompt Analysis Data</h3>
            <p className="text-muted-foreground">
              Detailed prompt analysis results will appear here once available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};