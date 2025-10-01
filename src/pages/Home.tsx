
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import {
  Zap,
  LogOut,
  BarChart3,
  TrendingUp,
  Settings,
  PlayCircle,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

const Home = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<any>(null);
  const [currentDomain, setCurrentDomain] = useState<string>('');

  // Get organization's domain and data
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (profile?.organization_id) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: org, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profile.organization_id)
            .single();

          if (org && !error) {
            setOrganization(org);
            if (org.website_url) {
              const domain = org.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '');
              setCurrentDomain(domain);
            }
          }
        } catch (err) {
          console.error('Error fetching organization data:', err);
        }
      }
    };

    fetchOrganizationData();
  }, [profile?.organization_id]);

  // Get recent analysis data
  const { data: analysisData, loading: analysisLoading } = useAnalysisData(currentDomain);

  console.log('🏠 Home component:', {
    hasProfile: !!profile,
    profileEmail: profile?.email,
    profileName: profile?.full_name,
    profileRole: profile?.role,
    organization: organization?.name,
    currentDomain
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const quickActions = [
    {
      title: 'Nova Análise',
      description: 'Iniciar análise completa do seu domínio',
      icon: PlayCircle,
      action: () => navigate('/analysis'),
      variant: 'default' as const,
      disabled: !currentDomain
    },
    {
      title: 'Ver Relatórios',
      description: 'Acessar dashboards e relatórios detalhados',
      icon: BarChart3,
      action: () => navigate('/analysis'),
      variant: 'outline' as const,
      disabled: !analysisData
    },
    {
      title: 'Configurações',
      description: 'Gerenciar domínio e preferências',
      icon: Settings,
      action: () => navigate('/domain-setup'),
      variant: 'outline' as const
    }
  ];

  const stats = [
    {
      label: 'Análises Realizadas',
      value: analysisData ? '1' : '0',
      icon: FileText,
      trend: analysisData ? '+1' : '0'
    },
    {
      label: 'Status Atual',
      value: analysisData?.status === 'completed' ? 'Completa' : 'Pendente',
      icon: analysisData?.status === 'completed' ? CheckCircle : Clock,
      trend: analysisData?.status === 'completed' ? 'Atualizado' : 'Processando'
    },
    {
      label: 'Última Análise',
      value: analysisData?.updated_at
        ? new Date(analysisData.updated_at).toLocaleDateString('pt-BR')
        : 'Nunca',
      icon: Calendar,
      trend: analysisData?.updated_at ? 'Recente' : 'Pendente'
    }
  ];

  // Fallback if profile is not available
  if (!profile) {
    console.log('🏠 Home: No profile available, showing loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">PromptMetrics</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{profile?.full_name}</div>
                <div className="text-xs text-slate-600">{organization?.name || 'Organização'}</div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Olá, {profile?.full_name}! 👋
          </h1>
          <p className="text-slate-600">
            Bem-vindo ao seu dashboard de análise de marca em IA
          </p>
          {currentDomain && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Domínio: {currentDomain}
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    action.disabled ? 'opacity-50' : 'hover:scale-[1.02]'
                  }`}
                  onClick={action.disabled ? undefined : action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        action.variant === 'default'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Next Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-900">Análise Completa</p>
                        <p className="text-sm text-slate-600">
                          {new Date(analysisData.updated_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/analysis')}
                  >
                    Ver Resultados Completos
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 mb-4">Nenhuma análise realizada ainda</p>
                  <Button onClick={() => navigate('/analysis')} className="w-full">
                    Iniciar Primeira Análise
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Informações da Organização
              </CardTitle>
            </CardHeader>
            <CardContent>
              {organization ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Nome</p>
                    <p className="font-semibold text-slate-900">{organization.name}</p>
                  </div>
                  {organization.website_url && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">Website</p>
                      <p className="font-semibold text-slate-900">{organization.website_url}</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate('/domain-setup')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 mb-4">Configuração pendente</p>
                  <Button onClick={() => navigate('/domain-setup')} className="w-full">
                    Configurar Organização
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
