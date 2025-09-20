
import { useState } from 'react';
import { allLlms, allCompetitors } from '@/constants/PromptAnalysisData';

export const usePromptFilters = () => {
  const [selectedLlms, setSelectedLlms] = useState<string[]>(allLlms.map(llm => llm.id));
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(allCompetitors.map(comp => comp.id));

  const handleLlmToggle = (llmId: string) => {
    setSelectedLlms(prev => 
      prev.includes(llmId) 
        ? prev.filter(id => id !== llmId)
        : [...prev, llmId]
    );
  };

  const handleCompetitorToggle = (competitorId: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(competitorId) 
        ? prev.filter(id => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  return {
    selectedLlms,
    selectedCompetitors,
    handleLlmToggle,
    handleCompetitorToggle,
  };
};
