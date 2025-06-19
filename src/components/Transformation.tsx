
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Calculator, BarChart3, ArrowRight } from 'lucide-react';

const Transformation = () => {
  const { t } = useLanguage();

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
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/40 to-pink-100/40 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 text-blue-800 rounded-full text-sm font-medium mb-8 shadow-lg">
            <ArrowRight className="w-4 h-4" />
            Transformação
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
            {t('transformation.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
            {t('transformation.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="relative mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg border border-white/50 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-blue-500/10 group-hover:shadow-blue-500/20">
                  <feature.icon className="w-12 h-12 text-blue-600" />
                </div>
                <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 leading-snug">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
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
