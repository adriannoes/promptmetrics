import React from 'react';

export interface SectionHeaderProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tag?: string;
  title?: string;
  titleHTML?: string; // when provided, will be rendered with dangerouslySetInnerHTML
  subtitle?: string;
  align?: 'center' | 'left' | 'right';
  tagClasses?: string; // classes for the badge container (background, border, text color)
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  tag,
  title,
  titleHTML,
  subtitle,
  align = 'center',
  tagClasses = 'bg-white/70 backdrop-blur-lg border border-slate-200/50 text-slate-700',
}) => {
  const alignment = align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right';

  return (
    <div className={`pm-reduce-motion ${alignment} animate-fade-in`}>
      {tag && (
        <div className={`inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 md:mb-8 shadow-lg ${tagClasses}`}>
          {Icon ? <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" /> : null}
          <span>{tag}</span>
        </div>
      )}

      {titleHTML ? (
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight px-2 sm:px-0"
          dangerouslySetInnerHTML={{ __html: titleHTML }}
        />
      ) : title ? (
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight px-2 sm:px-0">
          {title}
        </h2>
      ) : null}

      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed px-2 sm:px-0">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;


