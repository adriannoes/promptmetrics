
import React from 'react';
import { Zap } from 'lucide-react';

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Zap className="w-4 h-4 text-white" aria-hidden="true" />
      </div>
      <span className="text-lg font-bold text-slate-900 tracking-tight">PromptMetrics</span>
    </div>
  );
}
