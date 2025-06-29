
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DashboardTab } from '@/components/demo/DashboardTab';
import { PromptAnalysisTab } from '@/components/demo/PromptAnalysisTab';
import { CompetitorAnalysisTab } from '@/components/demo/CompetitorAnalysisTab';
import { StrategicInsightsTab } from '@/components/demo/StrategicInsightsTab';
import { Zap, Download, ExternalLink } from 'lucide-react';

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">PromptMetrics</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Analyzing:</span>
                <a 
                  href="https://lovable.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  lovable.dev
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <Button className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="prompt-analysis">
            <PromptAnalysisTab />
          </TabsContent>

          <TabsContent value="competitor-analysis">
            <CompetitorAnalysisTab />
          </TabsContent>

          <TabsContent value="strategic-insights">
            <StrategicInsightsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Demo;
