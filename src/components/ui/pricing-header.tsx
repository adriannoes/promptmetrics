
import React from 'react';

interface PricingHeaderProps {
  title: string;
  description: string;
}

export function PricingHeader({ title, description }: PricingHeaderProps) {
  return (
    <div className="text-center space-y-3 mb-8 sm:mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="text-slate-600 text-sm sm:text-base md:text-lg whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
