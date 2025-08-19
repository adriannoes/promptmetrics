import React from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { CTAButton } from './ui/cta-button';
import { DecorativeBlobs } from './DecorativeBlobs';
import { Alert, AlertDescription } from './ui/alert';

export interface ErrorStateProps {
  title?: string;
  message: string;
  error?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onReport?: () => void;
  retryLabel?: string;
  homeLabel?: string;
  reportLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  onGoHome,
  onReport,
  retryLabel = 'Try Again',
  homeLabel = 'Go Home',
  reportLabel = 'Report Issue',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative Background */}
      <DecorativeBlobs blobs={[
        {
          className: 'absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-red-400/10 to-orange-600/10 rounded-full blur-2xl',
          ariaHidden: true
        },
        {
          className: 'absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-yellow-600/10 rounded-full blur-xl',
          ariaHidden: true
        }
      ]} />

      <Card className="relative backdrop-blur-xl bg-white/60 border-white/60 shadow-xl max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-full blur-xl opacity-60" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-100/80 to-orange-100/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-200/60">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
              <p className="text-lg text-slate-600">{message}</p>
            </div>

            {/* Error Details */}
            {error && (
              <Alert className="text-left bg-red-50/60 border-red-200/60">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Error Details:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {onRetry && (
                <CTAButton
                  size="lg"
                  variant="primary"
                  onClick={onRetry}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {retryLabel}
                </CTAButton>
              )}
              
              {onGoHome && (
                <CTAButton
                  size="lg"
                  variant="secondary"
                  onClick={onGoHome}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  {homeLabel}
                </CTAButton>
              )}
              
              {onReport && (
                <CTAButton
                  size="lg"
                  variant="secondary"
                  onClick={onReport}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {reportLabel}
                </CTAButton>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;