
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Play } from 'lucide-react';

const Demo = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/60 backdrop-blur-lg border border-white/50 text-indigo-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg">
            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
            {t('tags.demo')}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 tracking-tight leading-tight">
            {t('demo.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed mb-8 sm:mb-12">
            {t('demo.subtitle')}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-indigo-500/10">
              <img
                src="/lovable-uploads/15f59e8f-3071-4ae2-aa73-37762b237030.png"
                alt="Platform Dashboard Preview"
                className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 sm:mt-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('demo.description')}
          </p>
          <button
            onClick={scrollToForm}
            className="group inline-flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/30 border border-indigo-500/20 backdrop-blur-sm"
          >
            {t('demo.cta')}
            <div className="w-2 h-2 bg-white/80 rounded-full group-hover:bg-white group-hover:scale-125 transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
