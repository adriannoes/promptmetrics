

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Zap, Settings } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface OrganizationDashboardProps {
  organization: Organization;
}

const OrganizationDashboard = ({ organization }: OrganizationDashboardProps) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Dashboard Card */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-white/60 backdrop-blur-sm border-white/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                Dashboard Overview
              </CardTitle>
              <CardDescription>
                Your organization's performance at a glance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-slate-500">
                  We're preparing detailed analytics and insights for your organization
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">Team Management</p>
                  <p className="text-xs text-slate-500">Manage team members</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">Run Evaluation</p>
                  <p className="text-xs text-slate-500">Start new benchmark</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">Settings</p>
                  <p className="text-xs text-slate-500">Configure organization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Organization Info</h3>
              <div className="space-y-2 text-sm">
                <p className="text-blue-700">
                  <span className="font-medium">Name:</span> {organization.name}
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Slug:</span> {organization.slug}
                </p>
                {organization.website_url && (
                  <p className="text-blue-700">
                    <span className="font-medium">Website:</span>{' '}
                    <a 
                      href={organization.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-800"
                    >
                      Visit site
                    </a>
                  </p>
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
