import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SmartRedirectProps {
  children: React.ReactNode;
}

export const SmartRedirect: React.FC<SmartRedirectProps> = ({ children }) => {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while loading
    if (loading || !profile) return;

    console.log('SmartRedirect: Checking user status...', {
      currentPath: location.pathname,
      role: profile.role,
      hasOrganization: !!profile.organization_id,
      hasWebsiteUrl: !!profile.organizations?.website_url
    });

    // Admins have access to all pages
    if (profile.role === 'admin') {
      console.log('SmartRedirect: Admin user - allowing access to all pages');
      return;
    }

    // For non-admin users, check if they have a domain set up
    const hasDomain = profile.organization_id && profile.organizations?.website_url;
    const hasOrganization = !!profile.organization_id;
    const setupInProgress = (() => {
      try { return localStorage.getItem('domainSetupInProgress') === 'true'; } catch { return false; }
    })();
    const lastSavedDomain = (() => {
      try { return localStorage.getItem('lastSavedDomain'); } catch { return null; }
    })();
    const lastSavedWebsiteUrl = (() => {
      try { return localStorage.getItem('lastSavedWebsiteUrl'); } catch { return null; }
    })();
    const currentPath = location.pathname;

    // Allow access to certain pages regardless of domain status
    const allowedPaths = ['/organization-setup', '/domain-setup', '/login', '/signup', '/', '/demo', '/analysis'];
    const isAllowed = allowedPaths.some((p) => currentPath === p || currentPath.startsWith(p + '/'));
    if (isAllowed) {
      // Se estamos na domain-setup e há setup em progresso, force ir para /home
      if (currentPath === '/domain-setup' && setupInProgress) {
        console.log('SmartRedirect: Forcing redirect to /home during domain setup');
        navigate('/home', { replace: true });
        return;
      }
      // Sempre permitir permanência nas rotas permitidas
      return;
    }

    // For protected pages, check domain status
    if (!hasOrganization) {
      console.log('SmartRedirect: User has no organization, redirecting to organization-setup');
      navigate('/organization-setup', { replace: true });
    } else if (!hasDomain) {
      // Allow staying on /home if a domain setup is in progress to avoid ping-pong
      if (currentPath === '/home' && (setupInProgress || lastSavedDomain || lastSavedWebsiteUrl)) {
        console.log('SmartRedirect: Domain setup in progress, staying on /home');
        return;
      }
      console.log('SmartRedirect: User has no domain, redirecting to domain-setup');
      navigate('/domain-setup', { replace: true });
    } else {
      // User has domain, ensure they land on /home for most routes
      if (currentPath !== '/' && currentPath !== '/home') {
        console.log('SmartRedirect: User has domain, redirecting to home');
        navigate('/home', { replace: true });
      }
    }
  }, [profile, loading, location.pathname, navigate]);

  // Show loading while determining redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}; 