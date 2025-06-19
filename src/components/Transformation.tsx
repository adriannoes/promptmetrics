
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Calculator, BarChart3 } from 'lucide-react';

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('transformation.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('transformation.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
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
