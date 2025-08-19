import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>();
  const renderStartRef = useRef<number>();

  useEffect(() => {
    mountTimeRef.current = performance.now();
    
    return () => {
      if (mountTimeRef.current) {
        const unmountTime = performance.now();
        const mountDuration = unmountTime - mountTimeRef.current;
        
        // Only log in development
        if (import.meta.env.DEV) {
          console.log(`[Performance] ${componentName} mount duration:`, mountDuration.toFixed(2), 'ms');
        }
      }
    };
  }, [componentName]);

  const startRender = () => {
    renderStartRef.current = performance.now();
  };

  const endRender = () => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} render time:`, renderTime.toFixed(2), 'ms');
      }
      
      return renderTime;
    }
    return 0;
  };

  return { startRender, endRender };
};

// Hook for measuring async operations
export const useAsyncPerformance = () => {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${operationName} duration:`, (endTime - startTime).toFixed(2), 'ms');
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${operationName} failed after:`, (endTime - startTime).toFixed(2), 'ms');
      }
      
      throw error;
    }
  };

  return { measureAsync };
};