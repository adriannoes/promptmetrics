
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PromptAnalysisTab from '@/components/demo/PromptAnalysisTab';
import ProductSentimentTab from '@/components/demo/ProductSentimentTab';

const Demo = () => {
  const [activeTab, setActiveTab] = useState("prompt-analysis");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Dashboard</h1>
        <p className="text-gray-600">Explore our AI-powered insights and analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
          <TabsTrigger value="product-sentiment">Product Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt-analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Analysis</CardTitle>
              <CardDescription>
                Analyze AI prompts and their performance across different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptAnalysisTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-sentiment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Sentiment Analysis</CardTitle>
              <CardDescription>
                Monitor sentiment trends and competitor analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSentimentTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Demo;
