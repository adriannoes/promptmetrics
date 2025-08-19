import { lazy, Suspense, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load heavy components
export const InteractiveDashboard = lazy(() => import('./InteractiveDashboard'));
export const AnalysisDashboard = lazy(() => import('./analysis/AnalysisDashboard'));
export const OrganizationDashboard = lazy(() => import('./OrganizationDashboard'));
export const FloatingActionBar = lazy(() => import('./FloatingActionBar'));

// HOC for lazy loading with error boundary and loading state
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback: React.ReactNode = <LoadingSpinner />
) => {
  return (props: P) => (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Pre-configured lazy components
export const LazyInteractiveDashboard = withLazyLoading(InteractiveDashboard);
export const LazyAnalysisDashboard = withLazyLoading(AnalysisDashboard);
export const LazyOrganizationDashboard = withLazyLoading(OrganizationDashboard);
export const LazyFloatingActionBar = withLazyLoading(FloatingActionBar);