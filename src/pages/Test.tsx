

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, Settings, User } from 'lucide-react';

const Test = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-white/60 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to PromptMetrics</h1>
          <p className="text-slate-600">Your organization page is being set up</p>
        </div>

        {profile && (
          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Name:</span>
                <span className="font-medium">{profile.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Email:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Role:</span>
                <span className="font-medium capitalize">{profile.role}</span>
              </div>
              {profile.organization_id && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Organization ID:</span>
                  <span className="font-medium font-mono text-xs">{profile.organization_id}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-slate-600">
            This is a temporary page while your organization-specific dashboard is being configured.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
