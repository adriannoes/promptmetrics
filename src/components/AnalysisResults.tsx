import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface AnalysisResultsProps {
  domain?: string;
  refreshTrigger?: number;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  domain, 
  refreshTrigger = 0 
}) => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      let query = supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (domain) {
        query = query.eq('domain', domain);
      }

      const { data, error } = await query.limit(10);

      if (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load analysis results');
        return;
      }

      setResults(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [domain, refreshTrigger]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Resultados da Análise</h3>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
        <p className="text-muted-foreground">
          {domain 
            ? `Nenhuma análise foi encontrada para o domínio "${domain}".`
            : 'Ainda não há análises realizadas. Faça sua primeira análise!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resultados da Análise</h3>
        <Badge variant="outline">{results.length} resultado(s)</Badge>
      </div>
      
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {getStatusIcon(result.status)}
                {result.domain}
              </CardTitle>
              <Badge className={getStatusColor(result.status)}>
                {result.status}
              </Badge>
            </div>
            <CardDescription>
              Analisado em {formatDate(result.created_at)}
              {result.updated_at !== result.created_at && (
                <span> • Atualizado em {formatDate(result.updated_at)}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.analysis_data && typeof result.analysis_data === 'object' ? (
              <div className="space-y-3">
                {/* Preview dos dados de análise */}
                {result.analysis_data.summary && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Resumo:</h4>
                    <p className="text-sm text-muted-foreground">{result.analysis_data.summary}</p>
                  </div>
                )}
                
                {result.analysis_data.score && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Pontuação:</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(result.analysis_data.score, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{result.analysis_data.score}/100</span>
                    </div>
                  </div>
                )}

                {result.analysis_data.recommendations && Array.isArray(result.analysis_data.recommendations) && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Recomendações:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.analysis_data.recommendations.slice(0, 3).map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                      {result.analysis_data.recommendations.length > 3 && (
                        <li className="text-xs text-muted-foreground italic">
                          +{result.analysis_data.recommendations.length - 3} mais recomendações
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* JSON compacto para dados complexos */}
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Ver dados completos
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.analysis_data, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Dados de análise não disponíveis
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};