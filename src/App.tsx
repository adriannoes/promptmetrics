import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import Analysis from './pages/Analysis';
import Demo from './pages/Demo';
import DemoPM3 from './pages/DemoPM3';

import Home from './pages/Home';
import OrganizationHome from './pages/OrganizationHome';
import DomainSetup from './pages/DomainSetup';
import MyRank from './pages/MyRank';
import Changelog from './pages/Changelog';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/demo-pm3" element={<DemoPM3 />} />
                <Route path="/changelog" element={<Changelog />} />
                
                {/* Protected routes - require authentication */}
                <Route path="/analysis" element={
                  <ProtectedRoute>
                    <Analysis />
                  </ProtectedRoute>
                } />
                
                
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/organization" element={
                  <ProtectedRoute>
                    <OrganizationHome />
                  </ProtectedRoute>
                } />
                
                <Route path="/domain-setup" element={
                  <ProtectedRoute>
                    <DomainSetup />
                  </ProtectedRoute>
                } />
                
                <Route path="/my-rank" element={
                  <ProtectedRoute>
                    <MyRank />
                  </ProtectedRoute>
                } />
                
                {/* Admin only routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </AccessibilityProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
