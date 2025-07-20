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
    const currentPath = location.pathname;

    // Allow access to certain pages regardless of domain status
    const allowedPaths = ['/domain-setup', '/login', '/signup', '/', '/demo'];
    if (allowedPaths.includes(currentPath)) {
      // If user has domain and is on domain-setup, redirect to their analysis
      if (hasDomain && currentPath === '/domain-setup') {
        console.log('SmartRedirect: User has domain, redirecting from domain-setup to my-rank');
        navigate('/my-rank', { replace: true });
      }
      return;
    }

    // For protected pages, check domain status
    if (!hasDomain) {
      console.log('SmartRedirect: User has no domain, redirecting to domain-setup');
      navigate('/domain-setup', { replace: true });
    } else {
      // User has domain, redirect to their analysis page for most routes
      const personalRoutes = ['/my-rank'];
      if (!personalRoutes.includes(currentPath) && currentPath !== '/') {
        console.log('SmartRedirect: User has domain, redirecting to my-rank');
        navigate('/my-rank', { replace: true });
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