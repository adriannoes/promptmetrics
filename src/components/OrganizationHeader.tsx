
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authToast, getCurrentLanguage } from '@/utils/toastMessages';

interface OrganizationHeaderProps {
  organization: {
    name: string;
    slug: string;
    logo_url?: string;
  };
}

const OrganizationHeader = ({ organization }: OrganizationHeaderProps) => {
  const { profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    console.log('Organization header: Starting sign out process');
    setSigningOut(true);
    const currentLanguage = getCurrentLanguage();
    
    try {
      const success = await signOut();
      console.log('Organization header: Sign out result:', success);
      
      if (success.success) {
        authToast.logoutSuccess(currentLanguage);
        // Force navigation to home after successful logout
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        authToast.logoutError(currentLanguage);
      }
    } catch (error) {
      console.error('Organization header: Sign out error:', error);
      setSigningOut(false);
      authToast.logoutError(currentLanguage);
    }
  };

  // Feedback visual pós-signout
  React.useEffect(() => {
    const onSignoutComplete = (e: any) => {
      console.log('Organization header: Received signout-complete event', e.detail);
      setSigningOut(false);
      
      if (e.detail?.success) {
        authToast.logoutSuccess(getCurrentLanguage());
        // Force navigation to home after successful logout
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        authToast.logoutError(getCurrentLanguage());
      }
    };
    
    window.addEventListener('signout-complete', onSignoutComplete);
    return () => window.removeEventListener('signout-complete', onSignoutComplete);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {organization.logo_url ? (
              <img 
                src={organization.logo_url} 
                alt={`${organization.name} logo`}
                className="w-8 h-8 rounded-lg object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-sm">
                  {organization.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                {organization.name}
              </span>
              {/* organization.website_url && (
                <a 
                  href={organization.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Visit website
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) */}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              Welcome, {profile?.full_name}
            </span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={signingOut}
              aria-busy={signingOut}
              aria-label="Sign out"
            >
              {signingOut ? (
                <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizationHeader;
