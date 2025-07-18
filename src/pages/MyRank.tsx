import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BarChart3, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Database,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealTimeAnalysis } from '@/hooks/useRealTimeAnalysis';
import { RealTimeNotification } from '@/components/RealTimeNotification';
import { ErrorReportButton } from '@/components/ErrorReportButton';
import { MyRankDashboardTab } from '@/components/myrank/MyRankDashboardTab';
import { MyRankPromptAnalysisTab } from '@/components/myrank/MyRankPromptAnalysisTab';
import { MyRankCompetitorAnalysisTab } from '@/components/myrank/MyRankCompetitorAnalysisTab';
import { MyRankStrategicInsightsTab } from '@/components/myrank/MyRankStrategicInsightsTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import SkipNav from '@/components/SkipNav';

const MyRankContent = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get domain from URL params or localStorage
  useEffect(() => {
    const urlDomain = searchParams.get('domain');
    const savedDomain = localStorage.getItem('lastAnalyzedDomain');
    const domain = urlDomain || savedDomain || '';
    
    setCurrentDomain(domain);
    console.log('🎯 MyRank: Domain set to:', domain);
  }, [searchParams]);

  // Use real-time analysis hook
  const {
    data: analysisData,
    loading,
    error,
    isConnected,
    lastUpdated,
    refetch,
    hasNewData,
    markAsRead
  } = useRealTimeAnalysis(currentDomain);

  const handleNewAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setIsSubmitting(true);
    try {
      // Save domain to localStorage
      localStorage.setItem('lastAnalyzedDomain', newDomain.trim());
      
      // Update URL
      window.history.pushState({}, '', `/my-rank?domain=${encodeURIComponent(newDomain.trim())}`);
      
      // Set new domain
      setCurrentDomain(newDomain.trim());
      setShowDomainInput(false);
      setNewDomain('');
      
      toast.success(`Análise iniciada para ${newDomain.trim()}`);
    } catch (error) {
      console.error('Error starting new analysis:', error);
      toast.error('Erro ao iniciar nova análise');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    if (currentDomain) {
      refetch(currentDomain);
      toast.info('Atualizando dados...');
    }
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}min atrás`;
    }
    return `${seconds}s atrás`;
  };

  // Loading state
  if (loading && !analysisData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SkipNav />
        <Header />
        <main id="main-content" tabIndex={-1} role="main" className="pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {t('myrank.loadingAnalysis')}
              </h1>
              <p className="text-muted-foreground">
                Carregando análise para <strong>{currentDomain}</strong>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No domain state
  if (!currentDomain) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SkipNav />
        <Header />
        <main id="main-content" tabIndex={-1} role="main" className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {t('myrank.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t('myrank.subtitle')}
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowDomainInput(true)}
                  size="lg"
                  className="px-8"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Analisar Novo Domínio
                </Button>
                
                <div>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/analysis'}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ir para Página de Análise
                  </Button>
                </div>
              </div>

              {showDomainInput && (
                <Card className="mt-8 max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Analisar Novo Domínio</CardTitle>
                    <CardDescription>
                      Digite o domínio que você deseja analisar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleNewAnalysis} className="space-y-4">
                      <Input
                        type="text"
                        placeholder={t('myrank.domainPlaceholder')}
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          disabled={!newDomain.trim() || isSubmitting}
                          className="flex-1"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Iniciando...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Analisar
                            </>
                          )}
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setShowDomainInput(false)}
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SkipNav />
        <Header />
        <main id="main-content" tabIndex={-1} role="main" className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-red-600">
                Erro ao Carregar Análise
              </h1>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <div>
                  <Button 
                    onClick={() => window.location.href = '/analysis'}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Análise
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No data state
  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SkipNav />
        <Header />
        <main id="main-content" tabIndex={-1} role="main" className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">
                Análise em Andamento
              </h1>
              <p className="text-muted-foreground mb-6">
                A análise para <strong>{currentDomain}</strong> ainda está sendo processada.
                <br />
                Os dados aparecerão automaticamente quando estiverem prontos.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Novamente
                </Button>
                
                <div>
                  <Button 
                    onClick={() => window.location.href = '/analysis'}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Análise
                  </Button>
                </div>
              </div>

              {/* Real-time status */}
              <div className="mt-8">
                <RealTimeNotification
                  isConnected={isConnected}
                  hasNewData={hasNewData}
                  lastUpdated={lastUpdated}
                  onMarkAsRead={markAsRead}
                  onRefresh={handleRefresh}
                  className="max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Success state - show analysis data
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {t('myrank.title')}
              </h1>
              <p className="text-muted-foreground">
                Análise para <strong>{analysisData.domain}</strong>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('myrank.updateData')}
              </Button>
              
              <Button 
                onClick={() => setShowDomainInput(true)}
                variant="outline"
                size="sm"
              >
                <Search className="w-4 h-4 mr-2" />
                {t('myrank.changeDomain')}
              </Button>
            </div>
          </div>

          {/* Real-time notification */}
          <div className="mb-6">
            <RealTimeNotification
              isConnected={isConnected}
              hasNewData={hasNewData}
              lastUpdated={lastUpdated}
              onMarkAsRead={markAsRead}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Analysis status */}
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Análise Completa
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Última atualização: {lastUpdated ? formatLastUpdated(lastUpdated) : 'Agora'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      {analysisData.status}
                    </Badge>
                    
                    {analysisData.analysis_data?.score && (
                      <Badge variant="default">
                        Score: {analysisData.analysis_data.score}/100
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Domain input modal */}
          {showDomainInput && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analisar Novo Domínio</CardTitle>
                <CardDescription>
                  Digite o domínio que você deseja analisar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewAnalysis} className="space-y-4">
                  <Input
                    type="text"
                    placeholder={t('myrank.domainPlaceholder')}
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={!newDomain.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Iniciando...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Analisar
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowDomainInput(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Analysis Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">{t('myrank.tabs.dashboard')}</TabsTrigger>
              <TabsTrigger value="prompt-analysis">{t('myrank.tabs.promptAnalysis')}</TabsTrigger>
              <TabsTrigger value="competitor-analysis">{t('myrank.tabs.competitorAnalysis')}</TabsTrigger>
              <TabsTrigger value="strategic-insights">{t('myrank.tabs.strategicInsights')}</TabsTrigger>
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
        </div>
      </main>
    </div>
  );
};

const MyRank = () => {
  return <MyRankContent />;
};

export default MyRank;