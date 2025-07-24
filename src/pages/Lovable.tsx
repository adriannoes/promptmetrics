import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LovableDashboardTab } from '@/components/lovable/LovableDashboardTab';
import { LovablePromptAnalysisTab } from '@/components/lovable/LovablePromptAnalysisTab';
import { LovableCompetitorAnalysisTab } from '@/components/lovable/LovableCompetitorAnalysisTab';
import { LovableStrategicInsightsTab } from '@/components/lovable/LovableStrategicInsightsTab';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { Skeleton } from '@/components/ui/skeleton';
import SkipNav from '@/components/SkipNav';
import { 
  RefreshCw, 
  BarChart3, 
  Brain, 
  Target, 
  Lightbulb,
  Globe,
  ExternalLink,
  Award,
  Sparkles,
  Code2,
  Zap
} from 'lucide-react';

const Lovable = () => {
  const { data: analysisData, loading, error, refetch } = useAnalysisData('www.lovable.dev');

  const handleRefresh = () => {
    refetch('www.lovable.dev');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SkipNav />
      
      {/* Enhanced Header matching DemoPM3 style */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                P
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PromptMetrics</h1>
                <span className="text-sm text-gray-500">Live Analysis Platform</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Zap className="w-3 h-3 mr-1" />
                Real Data
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  ← Back to Home
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Analysis Header */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    L
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Lovable.dev Analysis</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">www.lovable.dev</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Code2 className="w-3 h-3 mr-1" />
                        AI Platform
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        No-Code Development
                      </Badge>
                      {analysisData && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Score: {analysisData.analysis_data?.score || 'N/A'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-3 mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Visit Lovable.dev
                      </a>
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                      <Award className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {analysisData ? `Last updated: ${new Date(analysisData.updated_at).toLocaleDateString()}` : 'Loading...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">Error loading analysis data: {error}</p>
              <Button 
                variant="outline"
                onClick={handleRefresh}
                className="mt-2 text-red-700 hover:text-red-800"
              >
                Try again
              </Button>
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
              <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="prompt-analysis" className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4" />
                  Prompt Analysis
                </TabsTrigger>
                <TabsTrigger value="competitor-analysis" className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4" />
                  Competitor Analysis
                </TabsTrigger>
                <TabsTrigger value="strategic-insights" className="flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4" />
                  Strategic Insights
                </TabsTrigger>
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
      </main>
    </div>
  );
};

export default Lovable;