
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
    <section 
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden"
      aria-labelledby="problem-heading"
    >
      {/* Optimized background decorative elements */}
      <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200/15 sm:bg-blue-200/20 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200/15 sm:bg-indigo-200/20 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 text-slate-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 md:mb-8 shadow-lg shadow-slate-200/20">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>{t('tags.currentChallenges')}</span>
          </div>
          <h2 
            id="problem-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight px-2 sm:px-0"
          >
            {t('problem.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed px-2 sm:px-0">
            {t('problem.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className={`group relative bg-gradient-to-br ${problem.color} backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/40 shadow-xl shadow-slate-200/10 hover:shadow-2xl hover:shadow-slate-300/20 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
              role="article"
              aria-labelledby={`problem-${index}-title`}
            >
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
              
              <div className="relative z-10">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 ${problem.iconBg} backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <problem.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${problem.iconColor}`} aria-hidden="true" />
                </div>
                <h3 
                  id={`problem-${index}-title`}
                  className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 md:mb-6 leading-snug"
                >
                  {problem.title}
                </h3>
                <p className="text-slate-700 leading-relaxed opacity-90 text-sm sm:text-base">
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
