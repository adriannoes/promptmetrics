
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertCircle, DollarSign, TrendingDown } from 'lucide-react';

const Problem = () => {
  const { t } = useLanguage();

  const problems = [
    {
      icon: AlertCircle,
      title: t('problem.point1.title'),
      description: t('problem.point1.desc'),
    },
    {
      icon: DollarSign,
      title: t('problem.point2.title'),
      description: t('problem.point2.desc'),
    },
    {
      icon: TrendingDown,
      title: t('problem.point3.title'),
      description: t('problem.point3.desc'),
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('problem.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('problem.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {problem.title}
              </h3>
              <p className="text-gray-600">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
