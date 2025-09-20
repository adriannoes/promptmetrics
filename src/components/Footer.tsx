
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold tracking-tight">PromptMetrics</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-8">
            <div className="flex items-center gap-8">
              <Link 
                to="/demo"
                className="text-slate-400 hover:text-white transition-colors font-medium"
              >
                How it works
              </Link>
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
