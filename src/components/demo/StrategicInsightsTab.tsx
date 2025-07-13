
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface StrategicInsightsTabProps {
  analysisData: AnalysisResult;
}

// Esta versão do StrategicInsightsTab é usada apenas na página /demo e exibe dados estáticos simulando o domínio lovable.dev. Não depende de Supabase nem de autenticação.
export const StrategicInsightsTab = () => {
  const strategicInsights = null; // Static demo data
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Strategic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">Strategic insights content coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
