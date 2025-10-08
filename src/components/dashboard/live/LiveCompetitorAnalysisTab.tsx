import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface LiveCompetitorAnalysisTabProps {
  analysisData: AnalysisResult | null;
  loading: boolean;
}

export const LiveCompetitorAnalysisTab: React.FC<LiveCompetitorAnalysisTabProps> = ({ analysisData, loading }) => {
  const competitorData = analysisData?.analysis_data?.competitor_analysis || [];
  const competitorRankings = analysisData?.analysis_data?.competitor_rankings || [];
  const marketPosition = analysisData?.analysis_data?.market_position || {};

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData || !analysisData.analysis_data) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Competitor Analysis Available</h3>
        <p className="text-muted-foreground">
          Competitor analysis data will appear here once the analysis is completed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Position Overview */}
      {Object.keys(marketPosition).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Market Position Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  #{marketPosition.overall_rank || 'N/A'}
                </div>
                <div className="text-sm font-medium">Overall Rank</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {marketPosition.sentiment_score || 'N/A'}
                </div>
                <div className="text-sm font-medium">Avg Sentiment</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {marketPosition.mention_frequency || 'N/A'}
                </div>
                <div className="text-sm font-medium">Mention Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Rankings Table */}
      {competitorRankings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Competitor Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Sentiment Score</TableHead>
                  <TableHead>Mentions</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitorRankings.map((competitor: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      #{competitor.rank || index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {competitor.name || `Competitor ${index + 1}`}
                        {competitor.name === analysisData.domain && (
                          <Badge variant="outline">You</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        competitor.sentiment_score > 0.7 ? 'default' :
                        competitor.sentiment_score < 0.4 ? 'destructive' : 'secondary'
                      }>
                        {competitor.sentiment_score ? 
                          (competitor.sentiment_score * 100).toFixed(1) + '%' : 
                          'N/A'
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>{competitor.mentions || 0}</TableCell>
                    <TableCell>
                      {competitor.trend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      )}
                      {competitor.trend === 'down' && (
                        <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                      )}
                      {(!competitor.trend || competitor.trend === 'stable') && (
                        <div className="w-4 h-4 border-b-2 border-gray-400" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detailed Competitor Analysis */}
      {competitorData.length > 0 ? (
        competitorData.map((competitor: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {competitor.name || `Competitor ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Strengths:</h4>
                  {competitor.strengths && competitor.strengths.length > 0 ? (
                    <ul className="space-y-1">
                      {competitor.strengths.map((strength: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No strengths identified</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Weaknesses:</h4>
                  {competitor.weaknesses && competitor.weaknesses.length > 0 ? (
                    <ul className="space-y-1">
                      {competitor.weaknesses.map((weakness: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">•</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No weaknesses identified</p>
                  )}
                </div>
              </div>

              {competitor.ai_responses && competitor.ai_responses.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">AI Platform Responses:</h4>
                  <div className="space-y-3">
                    {competitor.ai_responses.map((response: any, idx: number) => (
                      <div key={idx} className="bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{response.platform}</Badge>
                          <Badge variant={
                            response.sentiment_score > 0.6 ? 'default' :
                            response.sentiment_score < 0.4 ? 'destructive' : 'secondary'
                          }>
                            {(response.sentiment_score * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-sm">{response.response_summary}</p>
                      </div>
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
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Detailed Competitor Data</h3>
            <p className="text-muted-foreground">
              Detailed competitor analysis will appear here once available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};