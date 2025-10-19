
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, userRole, loading } = useAuth();


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
    return <Navigate to="/login" replace />;
  }

  // If we have a user but no profile yet, show loading with timeout
  if (!profile) {
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

  if (requiredRole && userRole?.role !== requiredRole) {
    // Admin can access client routes, but client cannot access admin routes
    if (requiredRole === 'client' && userRole?.role === 'admin') {
      // Allow admin to access client routes
    } else if (requiredRole === 'admin' && userRole?.role === 'client') {
      return <Navigate to="/test" replace />;
    } else {
      // Redirect to appropriate dashboard based on user's role
      if (userRole?.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/test" replace />;
      }
    }
  }
  return <>{children}</>;
};

export default ProtectedRoute;
