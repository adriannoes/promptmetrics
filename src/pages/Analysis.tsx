import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import SkipNav from '@/components/SkipNav';
import { DomainAnalysisInput } from '@/components/DomainAnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  ArrowRight, 
  AlertCircle, 
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ErrorReportButton } from '@/components/ErrorReportButton';
import { toast } from 'sonner';
import AnalysisProgressModal from '@/components/AnalysisProgressModal';

const AnalysisContent = () => {
  const { t } = useLanguage();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAutoRedirect, setShowAutoRedirect] = useState(false);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(10);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [maxWaitTime, setMaxWaitTime] = useState(300); // 5 minutos máximo
  const [elapsedTime, setElapsedTime] = useState(0);

  console.log('Analysis Page: Rendered with currentDomain=', currentDomain, 'loading=', loading, 'status=', analysisStatus);

  // Função para verificar se os dados chegaram
  const checkAnalysisData = async (domain: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking analysis data:', error);
        return false;
      }

      if (data && data.status === 'completed' && data.analysis_data) {
        console.log('✅ Analysis data found and completed:', data);
        return true;
      }

      console.log('⏳ Analysis data not ready yet:', data);
      return false;
    } catch (error) {
      console.error('Error in checkAnalysisData:', error);
      return false;
    }
  };

  // Função para iniciar polling
  const startPolling = (domain: string) => {
    console.log('🔄 Starting polling for domain:', domain);
    
    // Limpar polling anterior
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      setElapsedTime(prev => prev + 10);
      
      const hasData = await checkAnalysisData(domain);
      
      if (hasData) {
        console.log('🎉 Analysis completed! Redirecting to results...');
        setAnalysisStatus('completed');
        setLoading(false);
        setShowAutoRedirect(false);
        clearInterval(interval);
        
        // Redirecionar imediatamente
        window.location.href = `/my-rank?domain=${encodeURIComponent(domain)}`;
        return;
      }

      // Verificar timeout
      if (elapsedTime >= maxWaitTime) {
        console.log('⏰ Max wait time reached, redirecting anyway...');
        setAnalysisStatus('failed');
        setLoading(false);
        setShowAutoRedirect(false);
        clearInterval(interval);
        
        toast.warning('A análise está demorando mais que o esperado. Você pode verificar o status em "Ver sua análise".');
        
        // Redirecionar mesmo sem dados
        window.location.href = `/my-rank?domain=${encodeURIComponent(domain)}`;
        return;
      }
    }, 10000); // Verificar a cada 10 segundos

    setPollingInterval(interval);
  };

  const handleAnalyze = (domain: string) => {
    console.log('Analysis Page: handleAnalyze called with domain:', domain);
    setCurrentDomain(domain);
    setLoading(true);
    setShowAutoRedirect(true);
    setAutoRedirectCountdown(10);
    setAnalysisError(null);
    setAnalysisStatus('processing');
    setElapsedTime(0);
    
    // Save domain to localStorage
    localStorage.setItem('lastAnalyzedDomain', domain);
    
    // Iniciar polling para aguardar dados
    startPolling(domain);
  };

  const handleAnalysisError = (error: string) => {
    console.error('Analysis Page: Analysis error:', error);
    setAnalysisError(error);
    setLoading(false);
    setShowAutoRedirect(false);
    setAnalysisStatus('failed');
    
    // Limpar polling se houver erro
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Auto-redirect countdown (fallback)
  useEffect(() => {
    if (showAutoRedirect && autoRedirectCountdown > 0 && analysisStatus === 'processing') {
      const timer = setTimeout(() => {
        setAutoRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showAutoRedirect && autoRedirectCountdown === 0 && analysisStatus === 'processing') {
      // Fallback: redirect after countdown if still processing
      console.log('⏰ Auto-redirect countdown finished, redirecting...');
      window.location.href = `/my-rank?domain=${encodeURIComponent(currentDomain)}`;
    }
  }, [showAutoRedirect, autoRedirectCountdown, currentDomain, analysisStatus]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleViewRanking = () => {
    // Navigate to /my-rank with domain parameter
    window.location.href = `/my-rank?domain=${encodeURIComponent(currentDomain)}`;
  };

  const cancelAutoRedirect = () => {
    setShowAutoRedirect(false);
    setAutoRedirectCountdown(10);
    
    // Limpar polling se cancelar
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                {t('analysis.title')}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('analysis.subtitle')}
            </p>
          </div>

          {/* Error Alert */}
          {analysisError && (
            <div className="mb-8">
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-red-800">Erro na análise:</strong>
                      <br />
                      <span className="text-red-700">{analysisError}</span>
                    </div>
                    <ErrorReportButton 
                      domain={currentDomain}
                      error={analysisError}
                      additionalInfo={{
                        page: 'analysis',
                        action: 'domain_analysis',
                        step: 'analysis_execution'
                      }}
                      variant="destructive"
                      className="ml-4"
                    />
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Analysis Progress Modal */}
          {['processing', 'completed', 'failed'].includes(analysisStatus) && (
            <AnalysisProgressModal
              open={true}
              onClose={() => {
                setAnalysisStatus('idle');
                setLoading(false);
                setShowAutoRedirect(false);
                if (pollingInterval) {
                  clearInterval(pollingInterval);
                  setPollingInterval(null);
                }
              }}
              status={analysisStatus as 'processing' | 'completed' | 'failed'}
              domain={currentDomain}
              elapsedTime={elapsedTime}
              onViewRanking={handleViewRanking}
              onCancel={() => {
                setAnalysisStatus('idle');
                setLoading(false);
                setShowAutoRedirect(false);
                if (pollingInterval) {
                  clearInterval(pollingInterval);
                  setPollingInterval(null);
                }
              }}
            />
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{t('analysis.completeAnalysis.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('analysis.completeAnalysis.desc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">{t('analysis.strategicInsights.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('analysis.strategicInsights.desc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">{t('analysis.multiplePlatforms.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('analysis.multiplePlatforms.desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    {t('analysis.newAnalysis.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('analysis.newAnalysis.desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DomainAnalysisInput 
                    onAnalyze={handleAnalyze}
                    loading={loading}
                    onError={handleAnalysisError}
                  />
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('analysis.howItWorks.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">1</Badge>
                    <div>
                      <p className="font-medium">{t('analysis.step1.title')}</p>
                      <p className="text-sm text-muted-foreground">{t('analysis.step1.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">2</Badge>
                    <div>
                      <p className="font-medium">{t('analysis.step2.title')}</p>
                      <p className="text-sm text-muted-foreground">{t('analysis.step2.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">3</Badge>
                    <div>
                      <p className="font-medium">{t('analysis.step3.title')}</p>
                      <p className="text-sm text-muted-foreground">{t('analysis.step3.desc')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t('analysis.analysisHistory.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('analysis.analysisHistory.desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto">
                    <AnalysisResults 
                      domain={currentDomain || undefined}
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* Removed Footer, AccessibilityPanel, Toaster, Sonner as they are not in the new_code */}
    </div>
  );
};

const Analysis = () => {
  return (
    <LanguageProvider>
      <AnalysisContent />
    </LanguageProvider>
  );
};

export default Analysis;