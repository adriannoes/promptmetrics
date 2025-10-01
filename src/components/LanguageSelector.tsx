

import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const getFlag = (lang: string) => {
    switch (lang) {
      case 'pt-BR':
        return '🇧🇷';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-xl border border-slate-200/60 hover:bg-slate-200/80 transition-colors">
      <Globe className="w-4 h-4 text-slate-600" />
      <div className="flex items-center gap-2">
        <span className="text-lg" role="img" aria-label="flag">
          {getFlag(language)}
        </span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'pt-BR')}
          className="bg-transparent border-none text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="en">EN</option>
          <option value="pt-BR">PT</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
