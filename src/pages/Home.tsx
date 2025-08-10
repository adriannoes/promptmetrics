
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
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <OrganizationHeader organization={organization} />

      {/* CTA de status sempre visível */}
      <div className="container mx-auto px-4 mt-4 mb-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="analysis-cta"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${isReady ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-600 cursor-not-allowed'}`}
            disabled={!isReady || !normalizedDomain}
            aria-disabled={!isReady}
            aria-busy={!isReady}
            onClick={() => {
              if (normalizedDomain) {
                navigate(`/analysis?domain=${normalizedDomain}`);
              }
            }}
          >
            {!isReady ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing analysis…</span>
              </>
            ) : (
              <>
                <span>View my analysis</span>
              </>
            )}
          </button>
          {!isReady && (
            <span role="status" aria-live="polite" className="text-sm text-slate-600">
              Your first analysis will be ready in a few minutes
            </span>
          )}
        </div>
      </div>

      {showAnalysisProgress ? (
        <div
          className="container mx-auto px-4 py-8"
          data-testid="analysis-progress"
          role="status"
          aria-live="polite"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('home.analysisInProgress.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-600">{t('home.analysisInProgress.body1')}</p>
                <p className="text-sm text-gray-500">{t('home.analysisInProgress.body2')}</p>
              </div>

              <div className="space-y-3">
                <Progress value={75} className="h-2" />
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{t('home.analysisInProgress.processing')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">{t('home.analysisInProgress.seoTitle')}</p>
                  <p className="text-xs text-blue-700">{t('home.analysisInProgress.seoDesc')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-indigo-50">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-900">{t('home.analysisInProgress.performanceTitle')}</p>
                  <p className="text-xs text-indigo-700">{t('home.analysisInProgress.performanceDesc')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">{t('home.analysisInProgress.competitorsTitle')}</p>
                  <p className="text-xs text-purple-700">{t('home.analysisInProgress.competitorsDesc')}</p>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500">{t('home.analysisInProgress.refreshHint')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <OrganizationDashboard organization={organization} />
      )}
    </div>
  );
};

export default Home;
