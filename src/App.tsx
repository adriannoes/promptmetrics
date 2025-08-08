import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Pages
import React from 'react';
const Index = React.lazy(() => import('./pages/Index'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Analysis = React.lazy(() => import('./pages/Analysis'));
const Demo = React.lazy(() => import('./pages/Demo'));
const DemoPM3 = React.lazy(() => import('./pages/DemoPM3'));
const Home = React.lazy(() => import('./pages/Home'));
const DomainSetup = React.lazy(() => import('./pages/DomainSetup'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <React.Suspense fallback={<div className="p-6 text-slate-600">Carregando…</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/demo-pm3" element={<DemoPM3 />} />
                
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
                
                {/* /organization removida (consolidado em /home) */}
                
                <Route path="/domain-setup" element={
                  <ProtectedRoute>
                    <DomainSetup />
                  </ProtectedRoute>
                } />
                
                {/* /my-rank removida (consolidado em /home + /analysis) */}
                
                {/* Admin only routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </React.Suspense>
            </div>
            <Toaster />
          </AccessibilityProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
