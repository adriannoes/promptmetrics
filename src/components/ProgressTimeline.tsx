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
    <Card className={`backdrop-blur-lg bg-white/60 border-white/60 shadow-xl ${className}`}>
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Estimated time: {estimated}</span>
          </div>
          
          <div className="space-y-3">
            <Progress 
              value={progress} 
              className="h-3 bg-blue-100"
            />
            <p className="text-sm text-slate-600">
              {progress}% complete
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div 
                key={step}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: isComplete ? 'rgb(239 246 255 / 0.8)' : 
                                   isCurrent ? 'rgb(219 234 254 / 0.8)' : 
                                   'rgb(248 250 252 / 0.6)'
                }}
              >
                <div className="flex-shrink-0">
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    isComplete ? 'text-green-700' :
                    isCurrent ? 'text-blue-700' :
                    'text-slate-500'
                  }`}>
                    {step}
                  </p>
                  
                  {isCurrent && (
                    <p className="text-sm text-blue-600 mt-1">
                      Processing...
                    </p>
                  )}
                  
                  {isComplete && (
                    <p className="text-sm text-green-600 mt-1">
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