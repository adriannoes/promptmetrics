import { LanguageProvider } from '../contexts/LanguageContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccessibilityPanel from '../components/AccessibilityPanel';
import { useAnalysisData } from '../hooks/useAnalysisData';
import { useOrganizationData } from '../hooks/useOrganizationData';
import { LiveDashboardTab } from '../components/live/LiveDashboardTab';
import { LivePromptAnalysisTab } from '../components/live/LivePromptAnalysisTab';
import { LiveCompetitorAnalysisTab } from '../components/live/LiveCompetitorAnalysisTab';
import { LiveStrategicInsightsTab } from '../components/live/LiveStrategicInsightsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, RefreshCw, AlertCircle, CheckCircle, Clock, Download, Settings } from 'lucide-react';

const AnalysisContent = () => {

  // Use custom hooks for better separation of concerns
  const { organization, currentDomain, loading: orgLoading, error: orgError, hasDomain } = useOrganizationData();
  const { data: analysisData, loading: analysisLoading, error: analysisError, isRefreshing, refetch } = useAnalysisData(currentDomain);

  const loading = orgLoading || analysisLoading;
  const error = orgError || analysisError;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  Dashboard de Análise
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  {organization && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {organization.name}
                      </Badge>
                    </div>
                  )}
                  {currentDomain && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {currentDomain}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status indicator */}
                {analysisData && (
                  <div className="flex items-center gap-2">
                    {analysisData.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : analysisData.status === 'processing' ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <Badge variant={
                      analysisData.status === 'completed' ? 'default' :
                      analysisData.status === 'processing' ? 'secondary' : 'destructive'
                    }>
                      {analysisData.status === 'completed' ? 'Concluído' :
                       analysisData.status === 'processing' ? 'Processando' : analysisData.status}
                    </Badge>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {analysisData && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentDomain && refetch(currentDomain)}
                    disabled={loading || isRefreshing || !currentDomain}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="mt-4 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar dados de análise</h3>
                        <p className="text-red-700 text-sm mb-4">{error}</p>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={() => currentDomain && refetch(currentDomain)}
                            variant="outline"
                            size="sm"
                            disabled={loading || !currentDomain}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Tentar Novamente
                          </Button>

                          <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Recarregar Página
                          </Button>

                          {error.includes('Domínio não encontrado') && (
                            <Button
                              onClick={() => window.location.href = '/domain-setup'}
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Settings className="w-4 h-4" />
                              Configurar Domínio
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organization Setup Prompt */}
            {!hasDomain && !loading && (
              <Card className="mt-4 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Configure seu domínio</p>
                        <p className="text-blue-700 text-sm">Configure o domínio da sua organização para começar as análises</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.location.href = '/domain-setup'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Configurar Domínio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis Dashboard Tabs */}
          {hasDomain ? (
            <Tabs defaultValue="dashboard" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Visão Geral</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="prompt-analysis"
                    className="flex items-center gap-2 py-3 px-4"
                    disabled={!analysisData}
                  >
                    <div className="w-4 h-4 rounded bg-current opacity-60" />
                    <span className="hidden sm:inline">Análise de Prompt</span>
                    <span className="sm:hidden">Prompts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="competitor-analysis"
                    className="flex items-center gap-2 py-3 px-4"
                    disabled={!analysisData}
                  >
                    <div className="w-4 h-4 rounded bg-current opacity-60" />
                    <span className="hidden sm:inline">Concorrentes</span>
                    <span className="sm:hidden">VS</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="strategic-insights"
                    className="flex items-center gap-2 py-3 px-4"
                    disabled={!analysisData}
                  >
                    <div className="w-4 h-4 rounded bg-current opacity-60" />
                    <span className="hidden sm:inline">Insights</span>
                    <span className="sm:hidden">Estratégia</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="dashboard" className="space-y-6">
                <LiveDashboardTab analysisData={analysisData} loading={loading} />
              </TabsContent>

              <TabsContent value="prompt-analysis" className="space-y-6">
                {analysisData ? (
                  <LivePromptAnalysisTab analysisData={analysisData} loading={loading} />
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Análise não disponível</h3>
                      <p className="text-muted-foreground">
                        Execute uma análise primeiro para visualizar os dados de prompt.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="competitor-analysis" className="space-y-6">
                {analysisData ? (
                  <LiveCompetitorAnalysisTab analysisData={analysisData} loading={loading} />
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Dados de concorrentes não disponíveis</h3>
                      <p className="text-muted-foreground">
                        Execute uma análise completa para comparar com seus concorrentes.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="strategic-insights" className="space-y-6">
                {analysisData ? (
                  <LiveStrategicInsightsTab analysisData={analysisData} loading={loading} />
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Insights estratégicos não disponíveis</h3>
                      <p className="text-muted-foreground">
                        Complete uma análise para receber recomendações estratégicas personalizadas.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Configure seu domínio</h3>
                <p className="text-muted-foreground mb-6">
                  Para começar a análise da sua marca em IA, primeiro configure o domínio da sua organização.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => window.location.href = '/domain-setup'}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Configurar Domínio
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/home'}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Voltar ao Dashboard
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Configure seu domínio para acessar análises completas,
                    comparações com concorrentes e insights estratégicos da sua marca.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

const Analysis = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AnalysisContent />
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default Analysis;