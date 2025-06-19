
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-xl border border-slate-200/60 hover:bg-slate-200/80 transition-colors">
      <Globe className="w-4 h-4 text-slate-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'pt-BR' | 'en')}
        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
      >
        <option value="pt-BR">PT</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
