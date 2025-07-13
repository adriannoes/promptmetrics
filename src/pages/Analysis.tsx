import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccessibilityPanel from '../components/AccessibilityPanel';
import { DomainAnalysisInput } from '../components/DomainAnalysisInput';
import { AnalysisResults } from '../components/AnalysisResults';
import { ErrorReportButton } from '../components/ErrorReportButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Search, TrendingUp, Globe, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const AnalysisContent = () => {
  const { t } = useLanguage();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAutoRedirect, setShowAutoRedirect] = useState(false);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(10);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  console.log('Analysis Page: Rendered with currentDomain=', currentDomain, 'loading=', loading);

  const handleAnalyze = (domain: string) => {
    console.log('Analysis Page: handleAnalyze called with domain:', domain);
    setCurrentDomain(domain);
    setLoading(true);
    setShowAutoRedirect(true);
    setAutoRedirectCountdown(10);
    setAnalysisError(null);
    
    // Save domain to localStorage
    localStorage.setItem('lastAnalyzedDomain', domain);
    
    // Simulate analysis time and refresh results
    setTimeout(() => {
      console.log('Analysis Page: Analysis simulation completed');
      setLoading(false);
      setRefreshTrigger(prev => prev + 1);
    }, 3000);
  };

  const handleAnalysisError = (error: string) => {
    console.error('Analysis Page: Analysis error:', error);
    setAnalysisError(error);
    setLoading(false);
    setShowAutoRedirect(false);
  };

  // Auto-redirect countdown
  useEffect(() => {
    if (showAutoRedirect && autoRedirectCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showAutoRedirect && autoRedirectCountdown === 0) {
      // Redirect automatically
      window.location.href = `/my-rank?domain=${encodeURIComponent(currentDomain)}`;
    }
  }, [showAutoRedirect, autoRedirectCountdown, currentDomain]);

  const handleViewRanking = () => {
    // Navigate to /my-rank with domain parameter
    window.location.href = `/my-rank?domain=${encodeURIComponent(currentDomain)}`;
  };

  const cancelAutoRedirect = () => {
    setShowAutoRedirect(false);
    setAutoRedirectCountdown(10);
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

          {/* Auto-redirect notification */}
          {showAutoRedirect && (
            <div className="mb-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {t('analysis.analysisInProgress.title')}
                        </h3>
                        <p className="text-sm text-blue-700">
                          {t('analysis.analysisInProgress.desc').replace('{domain}', currentDomain)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Redirecionando para o ranking em {autoRedirectCountdown} segundos...
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleViewRanking}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {t('analysis.viewRanking')}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button 
                        onClick={cancelAutoRedirect}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  
                  {loading && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <div>
                          <p className="font-medium text-blue-900">{t('analysis.analysisInProgress.title')}</p>
                          <p className="text-sm text-blue-700">
                            {t('analysis.analysisInProgress.desc').replace('{domain}', currentDomain)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
      <Footer />
      <AccessibilityPanel />
      
      {/* Toast notifications */}
      <Toaster />
      <Sonner />
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