
import React from 'react';
import { PromptFlashCards } from './PromptFlashCards';
import { PromptTable } from './PromptTable';
import { SentimentAnalysis } from './SentimentAnalysis';
import { usePromptFilters } from '@/hooks/usePromptFilters';

interface AnalysisResult {
  id: string;
  domain: string;
  status: string;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface PromptAnalysisTabProps {
  analysisData: AnalysisResult;
}

export const PromptAnalysisTab: React.FC<PromptAnalysisTabProps> = ({ analysisData }) => {
  const {
    selectedLlms,
    selectedCompetitors,
    handleLlmToggle,
    handleCompetitorToggle,
  } = usePromptFilters();

  return (
    <div className="space-y-8">
      <PromptFlashCards />
      
      <PromptTable
        selectedLlms={selectedLlms}
        selectedCompetitors={selectedCompetitors}
        onLlmToggle={handleLlmToggle}
        onCompetitorToggle={handleCompetitorToggle}
      />

      <SentimentAnalysis />
    </div>
  );
};
