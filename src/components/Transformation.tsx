
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Calculator, BarChart3, ArrowRight } from 'lucide-react';

const Transformation = () => {
  const { t, tHTML } = useLanguage();

  const features = [
    {
      icon: Target,
      title: t('transformation.feature1.title'),
      description: t('transformation.feature1.desc'),
    },
    {
      icon: Calculator,
      title: t('transformation.feature2.title'),
      description: t('transformation.feature2.desc'),
    },
    {
      icon: BarChart3,
      title: t('transformation.feature3.title'),
      description: t('transformation.feature3.desc'),
    }
  ];

  return (
    <section 
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white relative overflow-hidden"
      aria-labelledby="transformation-heading"
    >
      {/* Optimized background decoration */}
      <div className="absolute top-0 right-0 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-gradient-to-br from-blue-100/30 sm:from-blue-100/40 to-indigo-100/30 sm:to-indigo-100/40 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-purple-100/30 sm:from-purple-100/40 to-pink-100/30 sm:to-pink-100/40 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 md:mb-8 shadow-lg">
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>{t('tags.transformation')}</span>
          </div>
          <h2 
            id="transformation-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight px-2 sm:px-0"
            dangerouslySetInnerHTML={tHTML('transformation.title')}
          />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed px-2 sm:px-0">
            {t('transformation.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center group animate-fade-in" 
              style={{ animationDelay: `${index * 150}ms` }}
              role="article"
              aria-labelledby={`feature-${index}-title`}
            >
              <div className="relative mb-6 sm:mb-8 md:mb-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg border border-white/50 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-blue-500/10 group-hover:shadow-blue-500/20">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" aria-hidden="true" />
                </div>
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
              </div>
              <h3 
                id={`feature-${index}-title`}
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4 md:mb-6 leading-snug px-2 sm:px-0"
              >
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-0">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Transformation;
