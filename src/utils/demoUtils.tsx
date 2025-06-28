import React from 'react';
import { PromptData, FilterState, CustomizationOptions } from '@/types/demo';

export const renderPresenceRank = (rank: number) => {
  const getColor = (rank: number) => {
    if (rank <= 3) return 'text-green-600';
    if (rank <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <span className={`font-semibold ${getColor(rank)}`}>
      #{rank}
    </span>
  );
};

export const renderSentimentBadge = (sentiment: string) => {
  const colors = {
    Positive: 'bg-green-100 text-green-800',
    Negative: 'bg-red-100 text-red-800',
    Neutral: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[sentiment as keyof typeof colors] || colors.Neutral}`}>
      {sentiment}
    </span>
  );
};

export const renderPriorityBadge = (priority: string) => {
  const colors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || colors.Medium}`}>
      {priority}
    </span>
  );
};

export const renderComplexityBadge = (complexity: string) => {
  const colors = {
    High: 'bg-purple-100 text-purple-800',
    Medium: 'bg-blue-100 text-blue-800',
    Low: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[complexity as keyof typeof colors] || colors.Medium}`}>
      {complexity}
    </span>
  );
};

export const filterPrompts = (prompts: PromptData[], filters: FilterState): PromptData[] => {
  return prompts.filter(prompt => {
    if (filters.sentiment && prompt.sentiment !== filters.sentiment) return false;
    if (filters.category && prompt.category !== filters.category) return false;
    if (filters.region && prompt.region !== filters.region) return false;
    if (filters.industry && prompt.industry !== filters.industry) return false;
    if (filters.userType && prompt.userType !== filters.userType) return false;
    if (filters.priority && prompt.priority !== filters.priority) return false;
    if (filters.complexity && prompt.complexity !== filters.complexity) return false;
    return true;
  });
};

export const generateTableRows = (prompts: PromptData[], customization: CustomizationOptions): (string | React.ReactElement)[][] => {
  return prompts.map((prompt) => {
    const baseRow: (string | React.ReactElement)[] = [
      prompt.prompt,
      prompt.category,
      renderSentimentBadge(prompt.sentiment)
    ];

    if (customization.showConfidence) {
      baseRow.push(`${prompt.confidence}%`);
    }
    if (customization.showTimestamp) {
      baseRow.push(prompt.timestamp);
    }
    if (customization.showSource) {
      baseRow.push(prompt.source);
    }
    if (customization.showKeywords) {
      baseRow.push(prompt.keywords.join(', '));
    }

    baseRow.push(renderPriorityBadge(prompt.priority));
    baseRow.push(renderComplexityBadge(prompt.complexity));

    return baseRow;
  });
};

export const getTableHeaders = (customization: CustomizationOptions): string[] => {
  const baseHeaders = ['Prompt', 'Category', 'Sentiment'];
  
  if (customization.showConfidence) baseHeaders.push('Confidence');
  if (customization.showTimestamp) baseHeaders.push('Timestamp');
  if (customization.showSource) baseHeaders.push('Source');
  if (customization.showKeywords) baseHeaders.push('Keywords');
  
  baseHeaders.push('Priority', 'Complexity');
  
  return baseHeaders;
};

export const getUniqueValues = (prompts: PromptData[], field: keyof PromptData): string[] => {
  const values = prompts.map(prompt => prompt[field]);
  return Array.from(new Set(values.filter(Boolean))).sort();
};
