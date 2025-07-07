import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MyRankDashboardTab } from '@/components/myrank/MyRankDashboardTab';
import { MyRankPromptAnalysisTab } from '@/components/myrank/MyRankPromptAnalysisTab';
import { MyRankCompetitorAnalysisTab } from '@/components/myrank/MyRankCompetitorAnalysisTab';
import { MyRankStrategicInsightsTab } from '@/components/myrank/MyRankStrategicInsightsTab';
import { ErrorReportButton } from '@/components/ErrorReportButton';
import { RealTimeNotification } from '@/components/RealTimeNotification';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart3, ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeAnalysis } from '@/hooks/useRealTimeAnalysis';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import LanguageSelector from '@/components/LanguageSelector';

const MyRankContent = () => {
  const { t } = useLanguage();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [isAnalysisInProgress, setIsAnalysisInProgress] = useState(false);

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

  // Use Real-time analysis hook
  const {
    data: analysisData,
    loading,
    error,
    isConnected,
    lastUpdated,
    refetch,
    hasNewData,
    markAsRead,
  } = useRealTimeAnalysis(currentDomain);

  // Check if analysis is in progress when no data is available
  useEffect(() => {
    if (currentDomain && !analysisData && !loading) {
      const lastSubmissionTime = localStorage.getItem(`analysis_started_${currentDomain}`);
      if (lastSubmissionTime) {
        const timeDiff = Date.now() - parseInt(lastSubmissionTime);
        if (timeDiff < 30 * 60 * 1000) { // 30 minutes
          setIsAnalysisInProgress(true);
        }
      }
    } else if (analysisData) {
      setIsAnalysisInProgress(false);
    }
  }, [currentDomain, analysisData, loading]);

  const handleDomainChange = async (newDomain: string) => {
    setCurrentDomain(newDomain);
    localStorage.setItem('lastAnalyzedDomain', newDomain);
    localStorage.setItem(`analysis_started_${newDomain}`, Date.now().toString());
    
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
      } else {
        setIsAnalysisInProgress(true);
      }
    } catch (error) {
      console.error('💥 MyRank: Error triggering analysis:', error);
    }
  };

  const handleBackToAnalysis = () => {
    window.location.href = '/analysis';
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
              <CardTitle className="text-2xl">{t('myrank.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                {t('myrank.subtitle')}
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('myrank.domainPlaceholder')}
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
                  {t('myrank.analysisPageLink').split('página de análise').map((part, index) => (
                    <span key={index}>
                      {part}
                      {index === 0 && (
                        <button 
                          onClick={handleBackToAnalysis}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          página de análise
                        </button>
                      )}
                    </span>
                  ))}
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
                {t('myrank.title')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <span className="text-sm text-gray-600">
                {analysisData ? `${t('myrank.analyzing')}: ${analysisData.domain}` : `${t('myrank.domain')}: ${currentDomain}`}
              </span>
              <Button
                onClick={handleBackToAnalysis}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar à Análise
              </Button>
              <button
                onClick={() => refetch(currentDomain)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('myrank.updateData')}
              </button>
              <button
                onClick={() => {
                  const newDomain = prompt(t('myrank.promptNewDomain'), currentDomain);
                  if (newDomain && newDomain.trim()) {
                    handleDomainChange(newDomain.trim());
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('myrank.changeDomain')}
              </button>
            </div>
          </div>

          {/* Real-time Status and Notifications */}
          {currentDomain && (
            <RealTimeNotification
              isConnected={isConnected}
              hasNewData={hasNewData}
              lastUpdated={lastUpdated}
              onMarkAsRead={markAsRead}
              onRefresh={() => refetch(currentDomain)}
              className="mb-4"
            />
          )}
          
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{t('myrank.error')}:</strong> {error}
                  </div>
                  <ErrorReportButton 
                    domain={currentDomain}
                    error={error}
                    additionalInfo={{
                      page: 'my-rank',
                      action: 'data_loading',
                      step: 'fetch_analysis_data'
                    }}
                    variant="destructive"
                    className="ml-4"
                  />
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <p className="ml-4 text-gray-600">{t('myrank.loadingAnalysis')}</p>
          </div>
        ) : !analysisData ? (
          <div className="text-center py-12">
            {isAnalysisInProgress ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {t('analysis.analysisInProgress.title')}
                  </h3>
                  <p className="text-blue-700 mb-4">
                    {t('analysis.analysisInProgress.desc').replace('{domain}', currentDomain)}
                  </p>
                  <p className="text-sm text-blue-600 mb-4">
                    A análise pode levar alguns minutos. Esta página será atualizada automaticamente quando os dados estiverem disponíveis.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={() => refetch(currentDomain)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {t('myrank.updateData')}
                    </Button>
                    <Button
                      onClick={handleBackToAnalysis}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Voltar à Análise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div>
                      {t('myrank.noAnalysisFound').replace('{domain}', currentDomain)}
                      <br />
                      <button 
                        onClick={handleBackToAnalysis}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {t('myrank.createNewAnalysis')}
                      </button>
                    </div>
                    <div className="pt-2">
                      <ErrorReportButton 
                        domain={currentDomain}
                        error="Análise não encontrada para o domínio"
                        additionalInfo={{
                          page: 'my-rank',
                          action: 'analysis_not_found',
                          step: 'data_retrieval',
                          expected_domain: currentDomain
                        }}
                        variant="outline"
                        size="sm"
                      />
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

const MyRank = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <MyRankContent />
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default MyRank;