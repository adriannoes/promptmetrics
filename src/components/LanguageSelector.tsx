
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'pt-BR' | 'en')}
        className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
      >
        <option value="pt-BR">PT</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
