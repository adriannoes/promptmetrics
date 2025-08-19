import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export interface MetricCardProps {
  title: string;
  value: number;
  displayValue?: string;
  trend?: number;
  icon: LucideIcon;
  variant?: 'success' | 'warning' | 'error' | 'primary' | 'neutral';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  displayValue,
  trend,
  icon: Icon,
  variant = 'primary',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return {
          card: 'bg-gradient-to-br from-green-50/80 to-emerald-100/80 border-green-200/50 hover:border-green-300/60',
          icon: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white',
          value: 'text-green-700',
          title: 'text-green-800',
          trend: 'text-green-600'
        };
      case 'warning':
        return {
          card: 'bg-gradient-to-br from-amber-50/80 to-yellow-100/80 border-amber-200/50 hover:border-amber-300/60',
          icon: 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white',
          value: 'text-amber-700',
          title: 'text-amber-800',
          trend: 'text-amber-600'
        };
      case 'error':
        return {
          card: 'bg-gradient-to-br from-red-50/80 to-rose-100/80 border-red-200/50 hover:border-red-300/60',
          icon: 'bg-gradient-to-br from-red-500 to-rose-600 text-white',
          value: 'text-red-700',
          title: 'text-red-800',
          trend: 'text-red-600'
        };
      case 'primary':
        return {
          card: 'bg-gradient-to-br from-blue-50/80 to-indigo-100/80 border-blue-200/50 hover:border-blue-300/60',
          icon: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
          value: 'text-blue-700',
          title: 'text-blue-800',
          trend: 'text-blue-600'
        };
      default:
        return {
          card: 'bg-gradient-to-br from-slate-50/80 to-gray-100/80 border-slate-200/50 hover:border-slate-300/60',
          icon: 'bg-gradient-to-br from-slate-500 to-gray-600 text-white',
          value: 'text-slate-700',
          title: 'text-slate-800',
          trend: 'text-slate-600'
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <Card className={`group backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 ${classes.card} ${className}`}>
      <CardContent className="p-6 relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-3 ${classes.title} group-hover:scale-105 transition-transform duration-300`}>
              {title}
            </p>
            
            <div className="flex items-end gap-3">
              <span className={`text-3xl sm:text-4xl font-bold leading-none ${classes.value} group-hover:scale-110 transition-transform duration-300`}>
                {displayValue || value}
              </span>
              
              {typeof trend === 'number' && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${classes.trend} group-hover:scale-110 transition-transform duration-300`}>
                  {trend > 0 ? (
                    <TrendingUp className="w-4 h-4 animate-bounce" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {trend > 0 ? '+' : ''}{Math.abs(trend)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 ${classes.icon}`}>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="relative w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;