
import React from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export function CTAButton({ 
  children, 
  onClick, 
  className,
  size = 'md',
  variant = 'primary'
}: CTAButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 sm:px-6 sm:py-3 text-sm',
    md: 'px-6 py-4 sm:px-10 sm:py-5 text-sm sm:text-base',
    lg: 'px-8 py-5 sm:px-12 sm:py-6 text-base sm:text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30',
    secondary: 'bg-white/80 hover:bg-white text-slate-900 shadow-xl hover:shadow-2xl border border-slate-200/50'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-3 sm:gap-4 font-semibold rounded-xl sm:rounded-2xl transform hover:scale-[1.02] transition-all duration-300 border border-blue-500/20 backdrop-blur-sm min-h-[44px]',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
      <div className="w-2 h-2 bg-white/80 rounded-full group-hover:bg-white group-hover:scale-125 transition-all duration-300"></div>
    </button>
  );
}
