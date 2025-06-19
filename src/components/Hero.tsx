
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, Sparkles } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-full text-sm font-medium text-slate-700 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t('hero.badge')}
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 leading-[0.9] tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
          
          <button
            onClick={scrollToForm}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 border border-blue-500/20"
          >
            {t('hero.cta')}
            <div className="w-2 h-2 bg-white/80 rounded-full group-hover:bg-white transition-colors"></div>
          </button>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center shadow-sm">
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
