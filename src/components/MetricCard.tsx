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
    <Card className={`backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 pm-reduce-motion ${classes.card} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-2 ${classes.title}`}>
              {title}
            </p>
            
            <div className="flex items-end gap-2">
              <span className={`text-2xl sm:text-3xl font-bold leading-none ${classes.value}`}>
                {displayValue || value}
              </span>
              
              {typeof trend === 'number' && (
                <div className={`flex items-center gap-1 text-sm font-medium ${classes.trend}`}>
                  {trend > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${classes.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;