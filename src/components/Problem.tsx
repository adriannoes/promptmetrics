
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';
import SectionHeader from './SectionHeader';
import FeatureCard from './FeatureCard';
import DecorativeBlobs from './DecorativeBlobs';

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
      <DecorativeBlobs
        blobs={[
          { className: 'absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200/15 sm:bg-blue-200/20 rounded-full blur-2xl sm:blur-3xl', ariaHidden: true },
          { className: 'absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200/15 sm:bg-indigo-200/20 rounded-full blur-2xl sm:blur-3xl', ariaHidden: true },
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <SectionHeader
            icon={AlertTriangle}
            tag={t('tags.currentChallenges')}
            title={t('problem.title')}
            subtitle={t('problem.subtitle')}
            align="center"
            tagClasses="bg-white/70 backdrop-blur-lg border border-slate-200/50 text-slate-700"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <FeatureCard
              key={index}
              icon={problem.icon}
              title={problem.title}
              description={problem.description}
              containerClasses={`bg-gradient-to-br ${problem.color} border-white/40 shadow-xl shadow-slate-200/10 hover:shadow-2xl hover:shadow-slate-300/20 animate-fade-in`}
              iconWrapperClasses={`${problem.iconBg} backdrop-blur-sm shadow-lg`}
              iconClasses={problem.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
