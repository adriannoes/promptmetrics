import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Database,
  Clock,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAnalysis } from '@/hooks/useUserAnalysis';
import { RealTimeNotification } from '@/components/RealTimeNotification';
import { ErrorReportButton } from '@/components/ErrorReportButton';
import { MyRankDashboardTab } from '@/components/myrank/MyRankDashboardTab';
import { MyRankPromptAnalysisTab } from '@/components/myrank/MyRankPromptAnalysisTab';
import { MyRankCompetitorAnalysisTab } from '@/components/myrank/MyRankCompetitorAnalysisTab';
import { MyRankStrategicInsightsTab } from '@/components/myrank/MyRankStrategicInsightsTab';
import { toast } from 'sonner';
import Header from '@/components/Header';
import SkipNav from '@/components/SkipNav';

const MyRankContent = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const { analysisData, loading, error, triggerNewAnalysis, hasData, userDomain } = useUserAnalysis();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleRefreshAnalysis = async () => {
    try {
      await triggerNewAnalysis();
      toast.success('Nova análise solicitada! Os resultados aparecerão em alguns minutos.');
    } catch (err) {
      toast.error('Erro ao solicitar nova análise. Tente novamente.');
    }
  };

  // Show loading state
  if (loading && !hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600">Carregando dados de análise...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!hasData && userDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Nenhuma análise encontrada</CardTitle>
              <CardDescription>
                Não encontramos dados de análise para seu domínio: {userDomain}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleRefreshAnalysis} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Solicitando análise...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Solicitar nova análise
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const domain = analysisData?.domain || userDomain?.replace(/^https?:\/\//, '').replace(/^www\./, '') || '';
  const lastUpdated = analysisData?.updated_at ? new Date(analysisData.updated_at) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SkipNav targetId="main-content" />
      <Header />
      <RealTimeNotification />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Minha Análise
              </h1>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-4 h-4" />
                <span className="font-medium">{domain}</span>
                {analysisData?.status === 'completed' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completa
                  </Badge>
                )}
              </div>
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Última atualização: {lastUpdated.toLocaleDateString('pt-BR')} às {lastUpdated.toLocaleTimeString('pt-BR')}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefreshAnalysis}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Nova análise
              </Button>
              <ErrorReportButton />
            </div>
          </div>
        </div>

        {/* Analysis Tabs */}
        {hasData && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="prompts">
                Análise de Prompts
              </TabsTrigger>
              <TabsTrigger value="competitors">
                Concorrentes
              </TabsTrigger>
              <TabsTrigger value="insights">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <MyRankDashboardTab 
                domain={domain}
                analysisData={analysisData?.analysis_data}
              />
            </TabsContent>

            <TabsContent value="prompts">
              <MyRankPromptAnalysisTab 
                domain={domain}
                analysisData={analysisData?.analysis_data}
              />
            </TabsContent>

            <TabsContent value="competitors">
              <MyRankCompetitorAnalysisTab 
                domain={domain}
                analysisData={analysisData?.analysis_data}
              />
            </TabsContent>

            <TabsContent value="insights">
              <MyRankStrategicInsightsTab 
                domain={domain}
                analysisData={analysisData?.analysis_data}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default function MyRank() {
  return <MyRankContent />;
}
