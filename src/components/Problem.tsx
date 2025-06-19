
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';

const Problem = () => {
  const { t } = useLanguage();

  const problems = [
    {
      icon: AlertTriangle,
      title: t('problem.point1.title'),
      description: t('problem.point1.desc'),
      color: 'from-red-50 to-orange-50',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    {
      icon: DollarSign,
      title: t('problem.point2.title'),
      description: t('problem.point2.desc'),
      color: 'from-amber-50 to-yellow-50',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100'
    },
    {
      icon: TrendingDown,
      title: t('problem.point3.title'),
      description: t('problem.point3.desc'),
      color: 'from-rose-50 to-pink-50',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100'
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100/80 text-red-800 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Desafios Atuais
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t('problem.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            {t('problem.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className={`relative bg-gradient-to-br ${problem.color} rounded-3xl p-8 border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
              <div className={`w-14 h-14 ${problem.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <problem.icon className={`w-7 h-7 ${problem.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-snug">
                {problem.title}
              </h3>
              <p className="text-slate-700 leading-relaxed">
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
