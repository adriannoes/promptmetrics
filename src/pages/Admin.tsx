
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, LogOut, Users, Settings, BarChart3, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminInvitationCodes from '@/components/AdminInvitationCodes';
import SecurityAuditLogs from '@/components/SecurityAuditLogs';

const Admin = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">PromptMetrics Admin</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Admin: {profile?.full_name}</span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Manage users, monitor system performance, and configure platform settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">User Management</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Manage user accounts, roles, and permissions across the platform.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Analytics</h3>
            </div>
            <p className="text-slate-600 mb-4">
              View platform usage statistics, evaluation metrics, and performance data.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">System Settings</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Configure platform settings, API keys, and system preferences.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-8">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Invitation Codes
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Audit
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <AdminUserManagement />
            </TabsContent>
            
            <TabsContent value="invites" className="mt-6">
              <AdminInvitationCodes />
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <SecurityAuditLogs />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
