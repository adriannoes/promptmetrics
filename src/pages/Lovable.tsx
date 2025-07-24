import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LovableDashboardTab } from '@/components/lovable/LovableDashboardTab';
import { LovablePromptAnalysisTab } from '@/components/lovable/LovablePromptAnalysisTab';
import { LovableCompetitorAnalysisTab } from '@/components/lovable/LovableCompetitorAnalysisTab';
import { LovableStrategicInsightsTab } from '@/components/lovable/LovableStrategicInsightsTab';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

const Lovable = () => {
  const { data: analysisData, loading, error, refetch } = useAnalysisData('www.lovable.dev');

  const handleRefresh = () => {
    refetch('www.lovable.dev');
  };

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
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Live Analysis
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Analysis for: www.lovable.dev
              </span>
              <button 
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
          
          {analysisData && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Status: <span className="capitalize font-medium">{analysisData.status}</span></span>
              <span>•</span>
              <span>Score: <span className="font-bold text-blue-600">{analysisData.analysis_data?.score || 'N/A'}</span></span>
              <span>•</span>
              <span>Last Updated: {new Date(analysisData.updated_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error loading analysis data: {error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {loading && !analysisData ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
              <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
              <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <LovableDashboardTab analysisData={analysisData} />
            </TabsContent>

            <TabsContent value="prompt-analysis">
              <LovablePromptAnalysisTab analysisData={analysisData} />
            </TabsContent>

            <TabsContent value="competitor-analysis">
              <LovableCompetitorAnalysisTab analysisData={analysisData} />
            </TabsContent>

            <TabsContent value="strategic-insights">
              <LovableStrategicInsightsTab analysisData={analysisData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Lovable;