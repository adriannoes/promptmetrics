import React from 'react';
import { LucideIcon, FileX, Users, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { CTAButton } from './ui/cta-button';
import { DecorativeBlobs } from './DecorativeBlobs';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'analysis' | 'data' | 'team';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  className = ''
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'analysis':
        return {
          icon: icon || BarChart3,
          gradientFrom: 'from-blue-400/10',
          gradientTo: 'to-indigo-600/10',
          iconColor: 'text-blue-500'
        };
      case 'data':
        return {
          icon: icon || FileX,
          gradientFrom: 'from-purple-400/10',
          gradientTo: 'to-pink-600/10',
          iconColor: 'text-purple-500'
        };
      case 'team':
        return {
          icon: icon || Users,
          gradientFrom: 'from-green-400/10',
          gradientTo: 'to-emerald-600/10',
          iconColor: 'text-green-500'
        };
      default:
        return {
          icon: icon || Zap,
          gradientFrom: 'from-slate-400/10',
          gradientTo: 'to-gray-600/10',
          iconColor: 'text-slate-500'
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Decorative Background */}
      <DecorativeBlobs blobs={[
        {
          className: `absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} rounded-full blur-2xl`,
          ariaHidden: true
        }
      ]} />

      <Card className="relative backdrop-blur-xl bg-white/60 border-white/60 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            {/* Icon with glow effect */}
            <div className="relative mx-auto w-fit">
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} rounded-full blur-xl opacity-60`} />
              <div className="relative w-20 h-20 bg-gradient-to-br from-white/80 to-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40">
                <Icon className={`w-10 h-10 ${config.iconColor}`} />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
              <p className="text-lg text-slate-600 max-w-md mx-auto">{description}</p>
            </div>

            {/* Action Button */}
            {actionLabel && onAction && (
              <div className="pt-4">
                <CTAButton
                  size="lg"
                  variant="primary"
                  onClick={onAction}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {actionLabel}
                </CTAButton>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;