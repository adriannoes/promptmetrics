import React from 'react';

export interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  containerClasses?: string;
  iconWrapperClasses?: string;
  iconClasses?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  containerClasses = '',
  iconWrapperClasses = '',
  iconClasses = 'text-blue-600',
}) => {
  return (
    <div
      className={`group relative backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border shadow-xl transition-all duration-500 md:hover:-translate-y-1 md:sm:hover:-translate-y-2 pm-reduce-motion ${containerClasses}`}
      role="article"
      aria-labelledby={`feature-${title.replace(/\s+/g, '-').toLowerCase()}-title`}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

      <div className="relative z-10">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8 md:group-hover:scale-110 md:group-hover:rotate-3 transition-all duration-300 shadow-lg pm-reduce-motion ${iconWrapperClasses}`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${iconClasses}`} aria-hidden="true" />
        </div>
        <h3 id={`feature-${title.replace(/\s+/g, '-').toLowerCase()}-title`} className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 md:mb-6 leading-snug">
          {title}
        </h3>
        <p className="text-slate-700 leading-relaxed opacity-90 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;


