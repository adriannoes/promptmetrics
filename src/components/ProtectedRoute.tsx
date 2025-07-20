
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SmartRedirect } from './SmartRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking access...', {
    path: location.pathname,
    hasUser: !!user,
    hasProfile: !!profile,
    role: profile?.role,
    requireAdmin,
    loading
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && profile?.role !== 'admin') {
    console.log('ProtectedRoute: Admin required but user is not admin');
    return <Navigate to="/unauthorized" replace />;
  }

  // Use SmartRedirect for intelligent routing based on user status
  return (
    <SmartRedirect>
      {children}
    </SmartRedirect>
  );
};
