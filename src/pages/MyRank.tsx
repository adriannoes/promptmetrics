import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyRankDashboardTab } from '@/components/myrank/MyRankDashboardTab';
import { MyRankPromptAnalysisTab } from '@/components/myrank/MyRankPromptAnalysisTab';
import { MyRankCompetitorAnalysisTab } from '@/components/myrank/MyRankCompetitorAnalysisTab';
import { MyRankStrategicInsightsTab } from '@/components/myrank/MyRankStrategicInsightsTab';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const MyRank = () => {
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get domain from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const domainParam = urlParams.get('domain');
    const savedDomain = localStorage.getItem('lastAnalyzedDomain');
    
    const targetDomain = domainParam || savedDomain || '';
    if (targetDomain) {
      setCurrentDomain(targetDomain);
    }
  }, []);

  // Fetch usando FETCH DIRETO (que funcionou!)
  const fetchAnalysisData = async (domain: string) => {
    setLoading(true);
    setError(null);

    try {
      // URL direta para a API do Supabase (método que funcionou)
      const url = `https://racfoelvuhdifnekjsro.supabase.co/rest/v1/analysis_results?domain=eq.${domain}&select=*`;
      const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0',
        'Content-Type': 'application/json'
      };
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setAnalysisData(data[0]);
      } else {
        setError('Nenhuma análise encontrada para este domínio');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentDomain) {
      fetchAnalysisData(currentDomain);
    }
  }, [currentDomain]);

  // Auto-refresh every 5 seconds when no data exists
  useEffect(() => {
    if (currentDomain && !analysisData && !loading) {
      const interval = setInterval(() => {
        fetchAnalysisData(currentDomain);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentDomain, analysisData, loading]);

  const handleDomainChange = async (newDomain: string) => {
    setCurrentDomain(newDomain);
    localStorage.setItem('lastAnalyzedDomain', newDomain);
    const url = new URL(window.location.href);
    url.searchParams.set('domain', newDomain);
    window.history.pushState({}, '', url.toString());
    
    // Trigger new analysis for the new domain
    try {
      const { error } = await supabase.functions.invoke('trigger-analysis', {
        body: { domain: newDomain }
      });

      if (error) {
        console.error('❌ MyRank: Error triggering analysis:', error);
      }
    } catch (error) {
      console.error('💥 MyRank: Error triggering analysis:', error);
    }
  };

  if (!currentDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Meu Ranking IA</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Para ver seu ranking, você precisa primeiro analisar um domínio.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Digite seu domínio (ex: pipefy.com)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        handleDomainChange(value);
                      }
                    }
                  }}
                />
                <p className="text-sm text-gray-500">
                  Ou acesse a <a href="/analysis" className="text-blue-600 hover:underline">página de análise</a> para começar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                P
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PromptMetrics</h1>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                Meu Ranking
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {analysisData ? `Analisando: ${analysisData.domain}` : `Domínio: ${currentDomain}`}
              </span>
              <button
                onClick={() => fetchAnalysisData(currentDomain)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Atualizar Dados
              </button>
              <button
                onClick={() => {
                  const newDomain = prompt('Digite o novo domínio:', currentDomain);
                  if (newDomain && newDomain.trim()) {
                    handleDomainChange(newDomain.trim());
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Trocar Domínio
              </button>
            </div>
          </div>
          
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro: {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <p className="ml-4 text-gray-600">Carregando análise...</p>
          </div>
        ) : !analysisData ? (
          <div className="text-center py-12">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma análise encontrada para o domínio "{currentDomain}". 
                <br />
                <a href="/analysis" className="text-blue-600 hover:underline">
                  Clique aqui para criar uma nova análise.
                </a>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="prompt-analysis">Análise de Prompts</TabsTrigger>
              <TabsTrigger value="competitor-analysis">Análise Competitiva</TabsTrigger>
              <TabsTrigger value="strategic-insights">Insights Estratégicos</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <MyRankDashboardTab analysisData={analysisData as any} />
            </TabsContent>

            <TabsContent value="prompt-analysis">
              <MyRankPromptAnalysisTab analysisData={analysisData as any} />
            </TabsContent>

            <TabsContent value="competitor-analysis">
              <MyRankCompetitorAnalysisTab analysisData={analysisData as any} />
            </TabsContent>

            <TabsContent value="strategic-insights">
              <MyRankStrategicInsightsTab analysisData={analysisData as any} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MyRank;