import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import SkipNav from '@/components/SkipNav';
import { DomainAnalysisInput } from '@/components/DomainAnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { SectionHeader } from '@/components/SectionHeader';
import { DecorativeBlobs } from '@/components/DecorativeBlobs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BarChart3, 
  AlertCircle,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ErrorReportButton } from '@/components/ErrorReportButton';
import { extractDomain } from '@/utils/domain';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import type { CompleteAnalysisResult } from '@/types/analysis';
import { useRealTimeAnalysis } from '@/hooks/useRealTimeAnalysis';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const AnalysisContent = () => {
  const { t, language } = useLanguage();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CompleteAnalysisResult | null>(null);
  const { data: rtData, loading: rtLoading } = useRealTimeAnalysis(currentDomain);
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-foreground relative">
      {/* Decorative Background */}
      <DecorativeBlobs blobs={[
        {
          className: 'fixed -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl',
          ariaHidden: true
        },
        {
          className: 'fixed -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl',
          ariaHidden: true
        }
      ]} />

      <SkipNav />
      <main ref={mainRef} id="main-content" tabIndex={-1} role="main" className="relative pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6" data-testid="analysis-container">
          {/* Breadcrumb acessível */}
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analysis</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Hero Section */}
          {!analysisResult?.analysis_data && (
            <div className="mb-12">
              <SectionHeader
                icon={Brain}
                tag="AI Analysis"
                title="Discover How AI Perceives Your Domain"
                subtitle="Get comprehensive insights about your website's AI visibility, sentiment analysis, and competitive positioning in the digital landscape."
                align="center"
                tagClasses="bg-blue-100/80 backdrop-blur-lg border-blue-200/50 text-blue-800"
              />
            </div>
          )}

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

          {/* Removido grid de features e cabeçalho. Abas ficam dentro do dashboard (como na /demo). */}

          {/* Quando existir análise completa, mostrar o dashboard. Caso contrário, manter o layout com histórico/preview. */}
          {rtLoading ? (
            <div data-testid="analysis-skeleton" className="grid lg:grid-cols-2 gap-6 animate-pulse">
              <div className="space-y-6">
                <div className="h-40 bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl shadow-lg" />
                <div className="h-64 bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl shadow-lg" />
              </div>
              <div className="h-96 bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl shadow-lg" />
            </div>
          ) : analysisResult && analysisResult.status === 'completed' && analysisResult.analysis_data ? (
            <div data-testid="analysis-dashboard">
              <AnalysisDashboard result={analysisResult as any} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6" data-testid="analysis-grid">
              <div className="space-y-6">
                <Card className="backdrop-blur-lg bg-white/60 border-white/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-600" />
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
                <Card className="backdrop-blur-lg bg-white/60 border-white/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('analysis.howItWorks.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg">1</div>
                      <div>
                        <p className="font-semibold text-blue-900">{t('analysis.step1.title')}</p>
                        <p className="text-sm text-blue-700 mt-1">{t('analysis.step1.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg">2</div>
                      <div>
                        <p className="font-semibold text-indigo-900">{t('analysis.step2.title')}</p>
                        <p className="text-sm text-indigo-700 mt-1">{t('analysis.step2.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg">3</div>
                      <div>
                        <p className="font-semibold text-purple-900">{t('analysis.step3.title')}</p>
                        <p className="text-sm text-purple-700 mt-1">{t('analysis.step3.desc')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="h-full backdrop-blur-lg bg-white/60 border-white/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
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