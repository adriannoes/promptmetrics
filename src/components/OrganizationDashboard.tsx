
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
}

interface OrganizationDashboardProps {
  organization: Organization;
}

const OrganizationDashboard = ({ organization }: OrganizationDashboardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleMyAnalysis = () => {
    if (!organization.website_url) return;
    const cleanDomain = organization.website_url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
    try {
      localStorage.setItem('userDomain', cleanDomain);
    } catch (e) {
      // ignore storage errors in non-browser contexts
    }
    navigate(`/analysis?domain=${cleanDomain}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome to {organization.name}
        </h1>
        <p className="text-lg text-slate-600">
          Your organization dashboard is ready for action
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Dashboard Card */}
        <div className="lg:col-span-2">
          <Card className="h-full backdrop-blur-xl bg-white/60 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
              <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Dashboard Overview
              </CardTitle>
              <CardDescription>
                Your organization's performance at a glance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="text-center py-16">
                {/* Animated coming soon illustration */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl animate-pulse" />
                  <BarChart3 className="relative w-20 h-20 text-blue-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  Analytics Coming Soon
                </h3>
                <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                  We're preparing detailed analytics and insights for your organization
                </p>
                
                {/* Progress dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/60 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Button
                data-testid="my-analysis-btn"
                aria-label={t('dashboard.cta.myAnalysis')}
                className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                onClick={handleMyAnalysis}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('dashboard.cta.myAnalysis')}
              </Button>

              <div className="group flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/60 transition-all duration-300 cursor-pointer hover:shadow-lg backdrop-blur-sm border border-transparent hover:border-blue-200/60">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 group-hover:text-blue-800 transition-colors">Team Management</p>
                  <p className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors">Manage team members</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-purple-50/60 transition-all duration-300 cursor-pointer hover:shadow-lg backdrop-blur-sm border border-transparent hover:border-indigo-200/60">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 group-hover:text-indigo-800 transition-colors">Run Evaluation</p>
                  <p className="text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">Start new benchmark</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50/60 hover:to-pink-50/60 transition-all duration-300 cursor-pointer hover:shadow-lg backdrop-blur-sm border border-transparent hover:border-purple-200/60">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 group-hover:text-purple-800 transition-colors">Settings</p>
                  <p className="text-sm text-slate-500 group-hover:text-purple-600 transition-colors">Configure organization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50/80 to-indigo-100/80 border-blue-200/60 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <Settings className="w-3 h-3 text-white" />
                </div>
                Organization Info
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-blue-200/40">
                  <p className="text-blue-800">
                    <span className="font-semibold text-blue-900">Name:</span> {organization.name}
                  </p>
                </div>
                <div className="p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-blue-200/40">
                  <p className="text-blue-800">
                    <span className="font-semibold text-blue-900">Slug:</span> {organization.slug}
                  </p>
                </div>
                {organization.website_url && (
                  <div className="p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-blue-200/40">
                    <p className="text-blue-800">
                      <span className="font-semibold text-blue-900">Website:</span>{' '}
                      <a 
                        href={organization.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-900 transition-colors font-medium"
                      >
                        Visit site
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default OrganizationDashboard;
