import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
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
import { formatDateTime } from '@/lib/format';
import { signOut } from '@/services/authService';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-foreground">
      <SkipNav />
      <main ref={mainRef} id="main-content" tabIndex={-1} role="main" className="pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6" data-testid="analysis-container">
          {/* Header como na /demo, com nossas cores (compactado) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">P</div>
                <h1 className="text-2xl font-bold">PromptMetrics</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-colors">Export Report</button>
                <button
                  onClick={async () => { await signOut(); navigate('/'); }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary"
                >
                  {language === 'pt-BR' ? 'Sair' : 'Sign out'}
                </button>
              </div>
            </div>
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

          {/* Removido grid de features e cabeçalho. Abas ficam dentro do dashboard (como na /demo). */}

          {/* Quando existir análise completa, mostrar o dashboard. Caso contrário, manter o layout com histórico/preview. */}
          {rtLoading ? (
            <div data-testid="analysis-skeleton" className="grid lg:grid-cols-2 gap-6 animate-pulse">
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
            <div className="grid lg:grid-cols-2 gap-6" data-testid="analysis-grid">
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