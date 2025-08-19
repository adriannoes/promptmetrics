import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface SkeletonCardProps {
  variant?: 'default' | 'metric' | 'chart' | 'list';
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  variant = 'default', 
  className = '' 
}) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'metric':
        return (
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
          </CardContent>
        );
      
      case 'chart':
        return (
          <>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </>
        );
      
      case 'list':
        return (
          <>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </>
        );
      
      default:
        return (
          <>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </>
        );
    }
  };

  return (
    <Card className={`backdrop-blur-lg bg-white/60 border-white/60 shadow-xl animate-pulse ${className}`}>
      {getSkeletonContent()}
    </Card>
  );
};

export default SkeletonCard;