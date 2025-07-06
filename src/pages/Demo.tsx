
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardTab } from '@/components/demo/DashboardTab';
import { PromptAnalysisTab } from '@/components/demo/PromptAnalysisTab';
import { CompetitorAnalysisTab } from '@/components/demo/CompetitorAnalysisTab';
import { StrategicInsightsTab } from '@/components/demo/StrategicInsightsTab';
import { DomainAnalysisInput } from '@/components/DomainAnalysisInput';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Demo = () => {
  const [currentDomain, setCurrentDomain] = useState('lovable.dev');
  const { data: analysisData, loading, error, refetch } = useAnalysisData(currentDomain);

  const handleAnalyze = (domain: string) => {
    setCurrentDomain(domain);
    refetch(domain);
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
                {analysisData ? `Analyzing: ${analysisData.domain}` : 'No analysis yet'}
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
          
          <DomainAnalysisInput onAnalyze={handleAnalyze} loading={loading} />
          
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error: {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : !analysisData ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Enter a domain above to start the analysis
            </p>
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
              <DashboardTab analysisData={analysisData} />
            </TabsContent>

            <TabsContent value="prompt-analysis">
              <PromptAnalysisTab analysisData={analysisData} />
            </TabsContent>

            <TabsContent value="competitor-analysis">
              <CompetitorAnalysisTab analysisData={analysisData} />
            </TabsContent>

            <TabsContent value="strategic-insights">
              <StrategicInsightsTab analysisData={analysisData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Demo;
