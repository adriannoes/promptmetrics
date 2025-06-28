
import { useState } from 'react';
import { FilterState, CustomizationOptions } from '@/types/demo';

export const useDemoState = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState<FilterState>({});
  const [customization, setCustomization] = useState<CustomizationOptions>({
    showConfidence: true,
    showTimestamp: true,
    showSource: true,
    showKeywords: false,
    showMetrics: true,
    compactView: false,
    darkMode: false,
    autoRefresh: false,
    groupByCategory: false,
    highlightHighPriority: true
  });

  const updateFilter = (key: keyof FilterState, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateCustomization = (key: keyof CustomizationOptions, value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    activeTab,
    setActiveTab,
    filters,
    customization,
    updateFilter,
    updateCustomization,
    resetFilters
  };
};
