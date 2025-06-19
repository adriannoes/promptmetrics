
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 text-blue-800 rounded-full text-sm font-medium mb-6">
            <ArrowRight className="w-4 h-4" />
            Transformação
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t('transformation.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            {t('transformation.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-snug">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
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
