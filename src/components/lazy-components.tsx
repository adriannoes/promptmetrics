import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load heavy components for better performance
const CompetitorAnalysisTab = React.lazy(() => import('./demo/CompetitorAnalysisTab'));
const DashboardTab = React.lazy(() => import('./demo/DashboardTab'));
const PromptAnalysisTab = React.lazy(() => import('./demo/PromptAnalysisTab'));
const StrategicInsightsTab = React.lazy(() => import('./demo/StrategicInsightsTab'));
const PromptCustomizeDialog = React.lazy(() => import('./demo/PromptCustomizeDialog'));
const SentimentAnalysis = React.lazy(() => import('./demo/SentimentAnalysis'));
const PromptFlashCards = React.lazy(() => import('./demo/PromptFlashCards'));
const PromptTable = React.lazy(() => import('./demo/PromptTable'));

// Live components
const LiveCompetitorAnalysisTab = React.lazy(() => import('./live/LiveCompetitorAnalysisTab'));
const LiveDashboardTab = React.lazy(() => import('./live/LiveDashboardTab'));
const LivePromptAnalysisTab = React.lazy(() => import('./live/LivePromptAnalysisTab'));
const LiveStrategicInsightsTab = React.lazy(() => import('./live/LiveStrategicInsightsTab'));

// MyRank components
const MyRankDashboardTab = React.lazy(() => import('./myrank/MyRankDashboardTab'));
const MyRankPromptAnalysisTab = React.lazy(() => import('./myrank/MyRankPromptAnalysisTab'));
const MyRankCompetitorAnalysisTab = React.lazy(() => import('./myrank/MyRankCompetitorAnalysisTab'));
const MyRankStrategicInsightsTab = React.lazy(() => import('./myrank/MyRankStrategicInsightsTab'));

// Admin components
const AdminUserManagement = React.lazy(() => import('./AdminUserManagement'));
const AdminInvitationCodes = React.lazy(() => import('./AdminInvitationCodes'));
const SecurityAuditLogs = React.lazy(() => import('./SecurityAuditLogs'));

// Loading component for lazy components
const ComponentLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner />
  </div>
);

// Wrapper components with Suspense
export const LazyCompetitorAnalysisTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <CompetitorAnalysisTab {...props} />
  </Suspense>
);

export const LazyDashboardTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <DashboardTab {...props} />
  </Suspense>
);

export const LazyPromptAnalysisTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <PromptAnalysisTab {...props} />
  </Suspense>
);

export const LazyStrategicInsightsTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <StrategicInsightsTab {...props} />
  </Suspense>
);

export const LazyPromptCustomizeDialog = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <PromptCustomizeDialog {...props} />
  </Suspense>
);

export const LazySentimentAnalysis = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <SentimentAnalysis {...props} />
  </Suspense>
);

export const LazyPromptFlashCards = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <PromptFlashCards {...props} />
  </Suspense>
);

export const LazyPromptTable = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <PromptTable {...props} />
  </Suspense>
);

// Live components
export const LazyLiveCompetitorAnalysisTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LiveCompetitorAnalysisTab {...props} />
  </Suspense>
);

export const LazyLiveDashboardTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LiveDashboardTab {...props} />
  </Suspense>
);

export const LazyLivePromptAnalysisTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LivePromptAnalysisTab {...props} />
  </Suspense>
);

export const LazyLiveStrategicInsightsTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LiveStrategicInsightsTab {...props} />
  </Suspense>
);

// MyRank components
export const LazyMyRankDashboardTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <MyRankDashboardTab {...props} />
  </Suspense>
);

export const LazyMyRankPromptAnalysisTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <MyRankPromptAnalysisTab {...props} />
  </Suspense>
);

export const LazyMyRankCompetitorAnalysisTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <MyRankCompetitorAnalysisTab {...props} />
  </Suspense>
);

export const LazyMyRankStrategicInsightsTab = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <MyRankStrategicInsightsTab {...props} />
  </Suspense>
);

// Admin components
export const LazyAdminUserManagement = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <AdminUserManagement {...props} />
  </Suspense>
);

export const LazyAdminInvitationCodes = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <AdminInvitationCodes {...props} />
  </Suspense>
);

export const LazySecurityAuditLogs = (props: any) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <SecurityAuditLogs {...props} />
  </Suspense>
);

