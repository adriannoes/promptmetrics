import { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Import all components with named exports
import { CompetitorAnalysisTab } from './demo/CompetitorAnalysisTab';
import { DashboardTab } from './demo/DashboardTab';
import { PromptAnalysisTab } from './demo/PromptAnalysisTab';
import { StrategicInsightsTab } from './demo/StrategicInsightsTab';
import { PromptCustomizeDialog } from './demo/PromptCustomizeDialog';
import { SentimentAnalysis } from './demo/SentimentAnalysis';
import { PromptFlashCards } from './demo/PromptFlashCards';
import { PromptTable } from './demo/PromptTable';

// Live components
import { LiveCompetitorAnalysisTab } from './live/LiveCompetitorAnalysisTab';
import { LiveDashboardTab } from './live/LiveDashboardTab';
import { LivePromptAnalysisTab } from './live/LivePromptAnalysisTab';
import { LiveStrategicInsightsTab } from './live/LiveStrategicInsightsTab';

// MyRank components
import { MyRankDashboardTab } from './myrank/MyRankDashboardTab';
import { MyRankPromptAnalysisTab } from './myrank/MyRankPromptAnalysisTab';
import { MyRankCompetitorAnalysisTab } from './myrank/MyRankCompetitorAnalysisTab';
import { MyRankStrategicInsightsTab } from './myrank/MyRankStrategicInsightsTab';

// Admin components - these have default exports
import AdminUserManagement from './AdminUserManagement';
import AdminInvitationCodes from './AdminInvitationCodes';
import SecurityAuditLogs from './SecurityAuditLogs';

// Loading component
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
