
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { Zap } from 'lucide-react';

const Header = () => {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">RankMeLLM</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollTo('pricing')}
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
            >
              {t('pricing')}
            </button>
            <button 
              onClick={() => scrollTo('faq')}
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
            >
              {t('faq')}
            </button>
            
            <div className="flex items-center gap-6">
              <LanguageSelector />
              <button className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm">
                {t('login')}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
