
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">PromptMetrics</span>
          </div>
          
          <div className="flex justify-center gap-8 mb-8">
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
              type="button"
            >
              {t('footer.terms')}
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
              type="button"
            >
              {t('footer.privacy')}
            </button>
          </div>
          
          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
