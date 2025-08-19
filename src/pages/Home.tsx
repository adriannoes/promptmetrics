
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import OrganizationHeader from '@/components/OrganizationHeader';
import OrganizationDashboard from '@/components/OrganizationDashboard';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';
import LoadingSpinner from '@/components/LoadingSpinner';
import { StatusHero } from '@/components/StatusHero';
import { DecorativeBlobs } from '@/components/DecorativeBlobs';
import { useRealTimeAnalysis } from '@/hooks/useRealTimeAnalysis';
import { extractDomain } from '@/utils/domain';

const Home = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization-by-id', profile?.organization_id],
    queryFn: async () => {
      // Usa organization_id do perfil ou fallback salvo no localStorage após DomainSetup
      const organizationId = profile?.organization_id || (() => {
        try { return localStorage.getItem('lastOrganizationId') || undefined; } catch { return undefined; }
      })();

      if (!organizationId) {
        throw new Error('Organization id is required');
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (error) throw error;
      return data;
    },
    // Habilita também quando houver fallback
    enabled: Boolean(profile?.organization_id || (() => { try { return !!localStorage.getItem('lastOrganizationId'); } catch { return false; } })()),
  });

  // Realtime analysis results (com fallback localStorage se website_url ainda não reidratou)
  const lastSavedDomain = (() => {
    try { return localStorage.getItem('lastSavedDomain') || undefined; } catch { return undefined; }
  })();
  const lastSavedWebsiteUrl = (() => {
    try { return localStorage.getItem('lastSavedWebsiteUrl') || undefined; } catch { return undefined; }
  })();
  const effectiveWebsiteUrl = organization?.website_url || lastSavedWebsiteUrl;
  const normalizedDomain = effectiveWebsiteUrl ? extractDomain(effectiveWebsiteUrl) : (lastSavedDomain ? extractDomain(lastSavedDomain) : undefined);
  const { data: analysisData } = useRealTimeAnalysis(normalizedDomain);
  const isReady = Boolean(analysisData);

  // Ao montar a Home, limpar a flag de setup em progresso
  React.useEffect(() => {
    try { localStorage.removeItem('domainSetupInProgress'); } catch {}
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !organization) {
    return <UnauthorizedAccess message="Organization not found" />;
  }

  // Check if user belongs to this organization
  // Evita bloquear acesso enquanto o perfil reidrata. Se houver mismatch, confia no fallback carregado
  if (profile?.organization_id && profile.organization_id !== organization.id) {
    return <UnauthorizedAccess message="You don't have access to this organization" />;
  }

  // Show analysis in progress if temos algum domínio conhecido (org ou fallback) e ainda sem dados
  const showAnalysisProgress = Boolean(effectiveWebsiteUrl || lastSavedDomain) && !analysisData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Decorative Background */}
      <DecorativeBlobs blobs={[
        {
          className: 'fixed -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl',
          ariaHidden: true
        },
        {
          className: 'fixed -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl',
          ariaHidden: true
        }
      ]} />

      <div className="relative">
        <OrganizationHeader organization={organization} />

        {/* Status Hero Section */}
        <StatusHero
          domain={normalizedDomain}
          status={showAnalysisProgress ? 'analyzing' : (isReady ? 'ready' : 'empty')}
          metrics={analysisData ? {
            score: 85,
            trend: 12,
            lastUpdate: new Date().toISOString(),
            progress: 75
          } : undefined}
          onViewAnalysis={() => {
            if (normalizedDomain) {
              navigate(`/analysis?domain=${normalizedDomain}`);
            }
          }}
          onNewAnalysis={async () => {
            try {
              if (!normalizedDomain) return;
              await supabase.functions.invoke('trigger-analysis', {
                body: { domain: normalizedDomain },
              });
            } catch (e) {
              // noop: UX mínima, logs já ficam nas functions
            }
          }}
        />

        {/* Organization Dashboard - only show when not in progress */}
        {!showAnalysisProgress && (
          <div className="pb-20">
            <OrganizationDashboard organization={organization} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
