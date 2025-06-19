
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
      color: 'from-slate-50/80 to-blue-50/80',
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100/80'
    },
    {
      icon: DollarSign,
      title: t('problem.point2.title'),
      description: t('problem.point2.desc'),
      color: 'from-blue-50/80 to-indigo-50/80',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100/80'
    },
    {
      icon: TrendingDown,
      title: t('problem.point3.title'),
      description: t('problem.point3.desc'),
      color: 'from-indigo-50/80 to-purple-50/80',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100/80'
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-lg border border-slate-200/50 text-slate-700 rounded-full text-sm font-medium mb-8 shadow-lg shadow-slate-200/20">
            <AlertTriangle className="w-4 h-4" />
            Desafios Atuais
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
            {t('problem.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
            {t('problem.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className={`group relative bg-gradient-to-br ${problem.color} backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-xl shadow-slate-200/10 hover:shadow-2xl hover:shadow-slate-300/20 transition-all duration-500 hover:-translate-y-2 animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${problem.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <problem.icon className={`w-8 h-8 ${problem.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-6 leading-snug">
                  {problem.title}
                </h3>
                <p className="text-slate-700 leading-relaxed opacity-90">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
