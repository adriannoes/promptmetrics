
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

// Esta versão do PromptAnalysisTab é usada apenas na página /demo e exibe dados estáticos simulando o domínio lovable.dev. Não depende de Supabase nem de autenticação.
export const PromptAnalysisTab = () => {
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
