import React from 'react';
import { SectionHeader } from './SectionHeader';
import { DecorativeBlobs } from './DecorativeBlobs';
import { CTAButton } from './ui/cta-button';
import { MetricCard } from './MetricCard';
import { ProgressTimeline } from './ProgressTimeline';
import { Clock, Zap, TrendingUp, BarChart3 } from 'lucide-react';

export interface StatusHeroProps {
  domain?: string;
  status: 'analyzing' | 'ready' | 'error' | 'empty';
  metrics?: {
    score?: number;
    trend?: number;
    lastUpdate?: string;
    progress?: number;
  };
  onViewAnalysis?: () => void;
  onNewAnalysis?: () => void;
  className?: string;
}

export const StatusHero: React.FC<StatusHeroProps> = ({
  domain,
  status,
  metrics,
  onViewAnalysis,
  onNewAnalysis,
  className = ''
}) => {
  const getStatusContent = () => {
    switch (status) {
      case 'analyzing':
        return {
          tag: 'Analysis in Progress',
          title: 'Your AI Analysis is Being Prepared',
          subtitle: 'We\'re analyzing your domain and generating comprehensive insights. This usually takes 2-3 minutes.',
          primaryCTA: null,
          secondaryCTA: onNewAnalysis ? { label: 'New Analysis', action: onNewAnalysis, disabled: false } : null
        };
      case 'ready':
        return {
          tag: 'Analysis Ready',
          title: `Your Analysis for <span class="text-blue-600">${domain}</span> is Complete`,
          subtitle: 'Discover how AI perceives your domain with comprehensive insights and actionable recommendations.',
          primaryCTA: onViewAnalysis ? { label: 'View Analysis Results', action: onViewAnalysis, disabled: false } : null,
          secondaryCTA: onNewAnalysis ? { label: 'Start New Analysis', action: onNewAnalysis, disabled: false } : null
        };
      case 'error':
        return {
          tag: 'Analysis Error',
          title: 'Something Went Wrong',
          subtitle: 'We encountered an issue while analyzing your domain. Please try again or contact support.',
          primaryCTA: onNewAnalysis ? { label: 'Try Again', action: onNewAnalysis, disabled: false } : null,
          secondaryCTA: null
        };
      default:
        return {
          tag: 'Welcome',
          title: 'Start Your First AI Analysis',
          subtitle: 'Discover how AI perceives your domain with comprehensive insights and competitive analysis.',
          primaryCTA: onNewAnalysis ? { label: 'Start Analysis', action: onNewAnalysis, disabled: false } : null,
          secondaryCTA: null
        };
    }
  };

  const content = getStatusContent();

  return (
    <section className={`relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden ${className}`}>
      {/* Decorative Background */}
      <DecorativeBlobs blobs={[
        {
          className: 'absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl',
          ariaHidden: true
        },
        {
          className: 'absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl',
          ariaHidden: true
        }
      ]} />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            tag={content.tag}
            titleHTML={content.title}
            subtitle={content.subtitle}
            align="center"
            tagClasses={status === 'ready' ? 'bg-green-100/80 border-green-200 text-green-800' : 
                        status === 'analyzing' ? 'bg-blue-100/80 border-blue-200 text-blue-800' :
                        status === 'error' ? 'bg-red-100/80 border-red-200 text-red-800' :
                        'bg-slate-100/80 border-slate-200 text-slate-800'}
          />

          {/* Metrics Grid */}
          {status === 'ready' && metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
              <MetricCard
                title="AI Sentiment Score"
                value={metrics.score || 0}
                trend={metrics.trend}
                icon={TrendingUp}
                variant="success"
              />
              <MetricCard
                title="Analysis Quality"
                value={85}
                icon={BarChart3}
                variant="primary"
              />
              <MetricCard
                title="Last Updated"
                value={0}
                displayValue={metrics.lastUpdate ? new Date(metrics.lastUpdate).toLocaleDateString() : 'Today'}
                icon={Clock}
                variant="neutral"
              />
            </div>
          )}

          {/* Progress Timeline */}
          {status === 'analyzing' && (
            <div className="mt-8 mb-12">
              <ProgressTimeline
                steps={["Domain Analysis", "AI Processing", "Insights Generation"]}
                currentStep={1}
                estimated="2-3 minutes"
                progress={metrics?.progress || 75}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {content.primaryCTA && (
              <CTAButton
                size="lg"
                variant="primary"
                onClick={content.primaryCTA.action}
                disabled={content.primaryCTA.disabled}
                className="w-full sm:w-auto"
              >
                {status === 'analyzing' && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {content.primaryCTA.label}
              </CTAButton>
            )}
            
            {content.secondaryCTA && (
              <CTAButton
                size="lg"
                variant="secondary"
                onClick={content.secondaryCTA.action}
                disabled={content.secondaryCTA.disabled}
                className="w-full sm:w-auto"
              >
                {content.secondaryCTA.label}
              </CTAButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatusHero;