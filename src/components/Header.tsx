
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RankMeLLM</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollTo('pricing')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('pricing')}
            </button>
            <button 
              onClick={() => scrollTo('faq')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('faq')}
            </button>
            
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
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
