import React from 'react';
import { Progress } from './ui/progress';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export interface ProgressTimelineProps {
  steps: string[];
  currentStep: number;
  estimated: string;
  progress?: number;
  className?: string;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  steps,
  currentStep,
  estimated,
  progress = 0,
  className = ''
}) => {
  return (
    <Card className={`backdrop-blur-xl bg-white/70 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 ${className}`}>
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 text-blue-700 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md animate-pulse" />
              <Clock className="relative w-6 h-6" />
            </div>
            <span className="font-semibold text-lg">Estimated time: {estimated}</span>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-4 bg-blue-100/60 backdrop-blur-sm border border-blue-200/40"
              />
              {/* Animated progress glow */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/40 to-indigo-500/40 rounded-full blur-sm transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              {progress}% complete
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div 
                key={step}
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-500 hover:scale-105 backdrop-blur-sm border ${
                  isComplete 
                    ? 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-200/50 shadow-lg' 
                    : isCurrent 
                    ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-blue-200/50 shadow-lg animate-pulse' 
                    : 'bg-gradient-to-r from-slate-50/60 to-gray-50/60 border-slate-200/30'
                }`}
              >
                <div className="flex-shrink-0">
                  {isComplete ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/30 rounded-full blur-md" />
                      <CheckCircle2 className="relative w-7 h-7 text-green-600" />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative w-7 h-7 rounded-full border-3 border-blue-600 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      {/* Rotating ring */}
                      <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Circle className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-semibold text-base ${
                    isComplete ? 'text-green-800' :
                    isCurrent ? 'text-blue-800' :
                    'text-slate-500'
                  }`}>
                    {step}
                  </p>
                  
                  {isCurrent && (
                    <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      Processing...
                    </p>
                  )}
                  
                  {isComplete && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      Complete
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTimeline;