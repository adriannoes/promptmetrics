import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LazyMyRankDashboardTab,
  LazyMyRankPromptAnalysisTab,
  LazyMyRankCompetitorAnalysisTab,
  LazyMyRankStrategicInsightsTab
} from '@/components/lazy-components';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { LoadingSpinner } from '@/components';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const MyRank = () => {
  const { t } = useLanguage();
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const { data: analysisData, loading, error, isRefreshing, refetch } = useAnalysisData(currentDomain);

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

  // No redundant useEffect needed - useAnalysisData handles domain changes

  const handleDomainChange = async (newDomain: string) => {
    setCurrentDomain(newDomain);
    localStorage.setItem('lastAnalyzedDomain', newDomain);
    const url = new URL(window.location.href);
    url.searchParams.set('domain', newDomain);
    window.history.pushState({}, '', url.toString());
    
    // Trigger new analysis for the new domain
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { toast } = await import('sonner');
      
      const { error } = await supabase.functions.invoke('trigger-analysis', {
        body: { domain: newDomain }
      });

      if (error) {
        console.error('❌ MyRank: Error triggering analysis:', error);
        toast.error(t('myrank.toast.analysisFailed'));
      } else {
        toast.success(t('myrank.toast.analysisStarted'));
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
              <CardTitle className="text-2xl">{t('myrank.noAnalysisTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                {t('myrank.noAnalysisDescription')}
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('myrank.inputPlaceholder')}
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
                  Or visit the <a href="/analysis" className="text-blue-600 hover:underline">analysis page</a> to get started.
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
              <span className="text-sm text-gray-600">
                {analysisData ? t('myrank.analyzing').replace('{domain}', analysisData.domain) : t('myrank.domain').replace('{domain}', currentDomain)}
              </span>
              {analysisData?.has_complete_data && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Real Data
                </span>
              )}
              {analysisData && !analysisData.has_complete_data && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Sample Data
                </span>
              )}
              <button
                onClick={() => {
                  refetch(currentDomain);
                }}
                disabled={loading || isRefreshing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || isRefreshing ? t('myrank.refreshingButton') : t('myrank.refreshButton')}
              </button>
              <button
                onClick={() => {
                  const newDomain = prompt('Enter the new domain:', currentDomain);
                  if (newDomain && newDomain.trim()) {
                    handleDomainChange(newDomain.trim());
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('myrank.changeDomainButton')}
              </button>
            </div>
          </div>
          
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('myrank.error').replace('{error}', error)}
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
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('myrank.noAnalysisFound').replace('"{domain}"', `"${currentDomain}"`)}
                <br />
                <a href="/analysis" className="text-blue-600 hover:underline">
                  Click here to create a new analysis.
                </a>
              </AlertDescription>
            </Alert>
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
              <LazyMyRankDashboardTab analysisData={analysisData as any} />
            </TabsContent>

            <TabsContent value="prompt-analysis">
              <LazyMyRankPromptAnalysisTab analysisData={analysisData as any} />
            </TabsContent>

            <TabsContent value="competitor-analysis">
              <LazyMyRankCompetitorAnalysisTab analysisData={analysisData as any} />
            </TabsContent>

            <TabsContent value="strategic-insights">
              <LazyMyRankStrategicInsightsTab analysisData={analysisData as any} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MyRank;