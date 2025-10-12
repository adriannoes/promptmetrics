import { useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  entries: PerformanceEntry[];
}

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  TBT?: number; // Total Blocking Time
}

export const usePerformanceMonitoring = () => {
  const reportWebVitals = useCallback((metric: WebVitalsMetric) => {
    // Log metrics in development
    if (import.meta.env.DEV) {
      logger.info('Web Vitals', {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
      });
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      try {
        // Send to analytics/monitoring service
        // This would be replaced with actual monitoring service
        logger.info('Performance Metric sent', { metric: metric.name, value: metric.value });
      } catch (error) {
        logger.error('Failed to send performance metric', error);
      }
    }
  }, []);

  const measurePerformance = useCallback(() => {
    const metrics: PerformanceMetrics = {};

    // Measure Core Web Vitals
    if ('web-vitals' in window) {
      // Dynamic import for better bundle splitting
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(reportWebVitals);
        getFID(reportWebVitals);
        getFCP(reportWebVitals);
        getLCP(reportWebVitals);
        getTTFB(reportWebVitals);
      }).catch((error) => {
        logger.error('Failed to load web-vitals', error);
      });
    }

    // Measure additional performance metrics
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        metrics.TTFB = navigation.responseStart - navigation.requestStart;
      }

      // Calculate TBT (Total Blocking Time)
      const longTasks = performance.getEntriesByType('longtask');
      metrics.TBT = longTasks.reduce((total, task) => {
        return total + (task.duration - 50); // Tasks over 50ms are blocking
      }, 0);
    }

    // Log custom metrics
    logger.info('Custom Performance Metrics', metrics);

    return metrics;
  }, [reportWebVitals]);

  const trackInteraction = useCallback((action: string, metadata?: Record<string, unknown>) => {
    const timestamp = performance.now();

    logger.info('User Interaction', {
      action,
      timestamp,
      metadata,
      url: window.location.href,
    });
  }, []);

  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    logger.error('Application Error', error, {
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    // Measure performance on mount
    measurePerformance();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logger.info('Page Hidden', { timestamp: new Date().toISOString() });
      } else {
        logger.info('Page Visible', { timestamp: new Date().toISOString() });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      trackError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        reason: event.reason,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [measurePerformance, trackError]);

  return {
    measurePerformance,
    trackInteraction,
    trackError,
  };
};
