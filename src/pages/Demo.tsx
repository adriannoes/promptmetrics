
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from '@/components/demo/DashboardTab';
import { PromptAnalysisTab } from '@/components/demo/PromptAnalysisTab';
import { StrategicInsightsTab } from '@/components/demo/StrategicInsightsTab';
import { CompetitorAnalysisTab } from '@/components/demo/CompetitorAnalysisTab';

const Demo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Analytics Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive insights into your AI prompt performance, strategic analysis, and competitive intelligence.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="prompt-analysis" className="space-y-6">
            <PromptAnalysisTab />
          </TabsContent>

          <TabsContent value="strategic-insights" className="space-y-6">
            <StrategicInsightsTab />
          </TabsContent>

          <TabsContent value="competitor-analysis" className="space-y-6">
            <CompetitorAnalysisTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Demo;
