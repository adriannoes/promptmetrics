
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { DecorativeBlobs } from './DecorativeBlobs';
import { Card, CardContent } from './ui/card';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background */}
      <DecorativeBlobs blobs={[
        {
          className: 'absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse',
          ariaHidden: true
        },
        {
          className: 'absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse',
          ariaHidden: true
        }
      ]} />

      <div className="relative">
        <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-2xl p-8 text-center max-w-md">
          <CardContent className="space-y-6">
            {/* Animated loader with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="relative w-16 h-16 text-blue-600 animate-spin mx-auto" />
            </div>

            {/* Loading text with sparkles */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                <h3 className="text-xl font-semibold text-slate-800">Loading...</h3>
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              </div>
              <p className="text-slate-600">Preparing your experience</p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingSpinner;
