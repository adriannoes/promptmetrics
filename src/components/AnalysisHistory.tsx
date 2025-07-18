import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Clock, ExternalLink } from 'lucide-react';

interface AnalysisResult {
  id: string;
  domain: string;
  created_at: string;
  status: string;
}

interface AnalysisHistoryProps {
  onSelectAnalysis?: (domain: string) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onSelectAnalysis }) => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('id, domain, created_at, status')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar análises:', error);
        return;
      }

      setAnalyses(data || []);
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnalysis = (domain: string) => {
    if (onSelectAnalysis) {
      onSelectAnalysis(domain);
    } else {
      // Salva no localStorage e redireciona para MyRank
      localStorage.setItem('lastAnalyzedDomain', domain);
      navigate('/my-rank');
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
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Nenhuma análise encontrada
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Análises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium">{analysis.domain}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(analysis.created_at)}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAnalysis(analysis.domain)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ver Análise
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};