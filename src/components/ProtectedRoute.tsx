
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // Log detalhado do estado
  console.log('🔒 ProtectedRoute - Estado completo:', { 
    user: user ? {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    } : null,
    profile: profile ? {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name
    } : null,
    loading,
    requiredRole,
    timestamp: new Date().toISOString()
  });

  // Debug component removed - state is properly logged to console

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If we have a user but no profile yet, show loading with timeout
  if (!profile) {
    console.log('User found but no profile, showing loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
          <p className="text-slate-500 text-sm mt-2">If this takes too long, please refresh the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole && profile.role !== requiredRole) {
    console.log('Role mismatch, checking access permissions');
    
    // Admin can access client routes, but client cannot access admin routes
    if (requiredRole === 'client' && profile.role === 'admin') {
      console.log('Admin accessing client route - access granted');
      // Allow admin to access client routes
    } else if (requiredRole === 'admin' && profile.role === 'client') {
      console.log('Client trying to access admin route - redirecting to appropriate dashboard');
      return <Navigate to="/test" replace />;
    } else {
      console.log('Role mismatch, redirecting based on user role');
      // Redirect to appropriate dashboard based on user's role
      if (profile.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/test" replace />;
      }
    }
  }

  console.log('Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;
