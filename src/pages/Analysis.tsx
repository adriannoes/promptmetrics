import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import SkipNav from '@/components/SkipNav';
import { DomainAnalysisInput } from '@/components/DomainAnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisHistory } from '@/components/AnalysisHistory';
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
import { extractDomain } from '@/utils/domain';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import type { CompleteAnalysisResult } from '@/types/analysis';
import { useRealTimeAnalysis } from '@/hooks/useRealTimeAnalysis';

const AnalysisContent = () => {
  const { t } = useLanguage();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CompleteAnalysisResult | null>(null);
  const { data: rtData, loading: rtLoading } = useRealTimeAnalysis(currentDomain);
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  console.log('Analysis Page: Rendered with currentDomain=', currentDomain, 'loading=', loading);

  const handleAnalyze = (domain: string) => {
    console.log('[DEBUG] handleAnalyze chamado com domain:', domain);
    setCurrentDomain(domain);
    setLoading(true);
    setAnalysisError(null);
    
    // Save domain to localStorage
    localStorage.setItem('lastAnalyzedDomain', domain);
  };

  const handleAnalysisError = (error: string) => {
    console.error('Analysis Page: Analysis error:', error);
    setAnalysisError(error);
    setLoading(false);
  };

  // 5.1.1/5.1.2/5.1.3: Ler domínio (query param > localStorage) e normalizar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domainParam = params.get('domain');
    if (domainParam) {
      setCurrentDomain(extractDomain(domainParam));
      try { localStorage.setItem('lastAnalyzedDomain', extractDomain(domainParam)); } catch {}
      return;
    }

    // Fallbacks em cascata
    const stored = localStorage.getItem('lastAnalyzedDomain');
    if (stored) {
      setCurrentDomain(extractDomain(stored));
      return;
    }

    const lastSavedWebsiteUrl = localStorage.getItem('lastSavedWebsiteUrl');
    const lastSavedDomain = localStorage.getItem('lastSavedDomain');
    if (lastSavedWebsiteUrl) {
      setCurrentDomain(extractDomain(lastSavedWebsiteUrl));
      try { localStorage.setItem('lastAnalyzedDomain', extractDomain(lastSavedWebsiteUrl)); } catch {}
      return;
    }
    if (lastSavedDomain) {
      setCurrentDomain(extractDomain(lastSavedDomain));
      try { localStorage.setItem('lastAnalyzedDomain', extractDomain(lastSavedDomain)); } catch {}
    }
  }, [location.search]);

  // Acessibilidade: focar no main após montar
  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  // Sincronizar resultado com o hook de Realtime
  useEffect(() => {
    if (rtData) {
      setAnalysisResult(rtData as unknown as CompleteAnalysisResult);
      try { localStorage.setItem('lastAnalyzedDomain', rtData.domain); } catch {}
    }
  }, [rtData]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipNav />
      <Header />
      <main ref={mainRef} id="main-content" tabIndex={-1} role="main" className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="analysis-container">
          {/* Header Summary (sempre que existir analysisResult) */}
          {analysisResult && (
            <div className="mb-8" data-testid="analysis-header-summary">
              <Card>
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      <strong>{analysisResult.domain}</strong>
                    </CardTitle>
                    <CardDescription>
                      {analysisResult.analysis_data?.summary || ''}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={analysisResult.status === 'completed' ? 'bg-green-100 text-green-700' : analysisResult.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                      {analysisResult.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground" data-testid="analysis-last-updated">
                      Last updated:{' '}
                      {(() => {
                        const iso = (analysisResult as any)?.analysis_data?.generated_at || analysisResult.updated_at;
                        try { return new Date(iso).toLocaleString(); } catch { return String(iso); }
                      })()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {typeof (analysisResult as any)?.analysis_data?.score === 'number' && (
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">{(analysisResult as any).analysis_data.score}<span className="text-lg text-muted-foreground">/100</span></div>
                      <div className="w-full max-w-md bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min((analysisResult as any).analysis_data.score, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
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

          {/* Live region for domain updates */}
          <div data-testid="analysis-live-region" role="status" aria-live="polite" className="sr-only">
            {currentDomain}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12" data-testid="features-grid">
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

          {/* Quando existir análise completa, mostrar o dashboard. Caso contrário, manter o layout com histórico/preview. */}
          {rtLoading ? (
            <div data-testid="analysis-skeleton" className="grid lg:grid-cols-2 gap-8 animate-pulse">
              <div className="space-y-6">
                <div className="h-40 bg-muted rounded" />
                <div className="h-64 bg-muted rounded" />
              </div>
              <div className="h-96 bg-muted rounded" />
            </div>
          ) : analysisResult && analysisResult.status === 'completed' && analysisResult.analysis_data ? (
            <div data-testid="analysis-dashboard">
              <AnalysisDashboard result={analysisResult as any} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8" data-testid="analysis-grid">
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
                      {currentDomain ? (
                        <AnalysisResults 
                          domain={currentDomain}
                          refreshTrigger={refreshTrigger}
                        />
                      ) : (
                        <AnalysisHistory />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
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