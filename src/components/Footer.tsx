
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import nvidiaInceptionImage from '../assets/nvidia-inception.png';

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left side - Existing content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">PromptMetrics</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-8">
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
              <div className="hidden sm:block text-slate-600">|</div>
              <Link 
                to="/changelog"
                className="text-slate-400 hover:text-white transition-colors font-medium"
              >
                {t('footer.changelog')}
              </Link>
            </div>
            
            <div className="pt-8 border-t border-slate-800 w-full lg:border-t-0 lg:pt-0">
              <p className="text-slate-400">
                {t('footer.copyright')}
              </p>
            </div>
          </div>

          {/* Right side - NVIDIA Inception */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right flex-shrink-0">
            <div className="flex flex-col items-center lg:items-end gap-2">
              <p className="text-sm text-slate-400 font-medium">
                Proud member of
              </p>
              <img 
                src={nvidiaInceptionImage} 
                alt="NVIDIA Inception Program"
                className="h-20 lg:h-28 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => window.open('https://www.nvidia.com/en-us/startups/', '_blank')}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
