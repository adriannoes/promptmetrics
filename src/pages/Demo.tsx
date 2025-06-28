
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from '@/components/demo/DashboardTab';
import { PromptAnalysisTab } from '@/components/demo/PromptAnalysisTab';
import { StrategicInsightsTab } from '@/components/demo/StrategicInsightsTab';
import { CompetitorAnalysisTab } from '@/components/demo/CompetitorAnalysisTab';
import { useDemoState } from '@/hooks/useDemoState';

const Demo = () => {
  const {
    activeTab,
    setActiveTab,
    filters,
    customization,
    updateFilter,
    updateCustomization,
    resetFilters
  } = useDemoState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Prompt Analysis Dashboard</h1>
          <p className="text-lg text-gray-600">
            Comprehensive analytics and insights for your AI interactions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab customization={customization} />
          </TabsContent>

          <TabsContent value="prompt-analysis">
            <PromptAnalysisTab
              filters={filters}
              customization={customization}
              updateFilter={updateFilter}
              updateCustomization={updateCustomization}
              resetFilters={resetFilters}
            />
          </TabsContent>

          <TabsContent value="strategic-insights">
            <StrategicInsightsTab />
          </TabsContent>

          <TabsContent value="competitor-analysis">
            <CompetitorAnalysisTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Demo;
