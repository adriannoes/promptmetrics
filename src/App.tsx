import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
const Index = React.lazy(() => import('./pages/Index'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Analysis = React.lazy(() => import('./pages/Analysis'));
const Demo = React.lazy(() => import('./pages/Demo'));
const DemoPM3 = React.lazy(() => import('./pages/DemoPM3'));
  const Home = React.lazy(() => import('./pages/Home'));
  const AnalysisE2E = React.lazy(() => import('./pages/AnalysisE2E'));
const DomainSetup = React.lazy(() => import('./pages/DomainSetup'));
  const OrganizationSetup = React.lazy(() => import('./pages/OrganizationSetup'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
  const Features = React.lazy(() => import('./pages/Features'));
  const PricingPage = React.lazy(() => import('./pages/Pricing'));
  const Testimonials = React.lazy(() => import('./pages/Testimonials'));
  const Integration = React.lazy(() => import('./pages/Integration'));
  const FAQs = React.lazy(() => import('./pages/FAQs'));
  const About = React.lazy(() => import('./pages/About'));
  const Privacy = React.lazy(() => import('./pages/Privacy'));
  const Terms = React.lazy(() => import('./pages/Terms'));
  const Blog = React.lazy(() => import('./pages/Blog'));
  const Changelog = React.lazy(() => import('./pages/Changelog'));
  const Brand = React.lazy(() => import('./pages/Brand'));
  const Help = React.lazy(() => import('./pages/Help'));
  const BrandingDemo = React.lazy(() => import('./pages/BrandingDemo'));
  const Facebook = React.lazy(() => import('./pages/SocialPlaceholders'));
  const Instagram = React.lazy(() => import('./pages/SocialPlaceholders').then(m => ({default: m.Instagram})));
  const Youtube = React.lazy(() => import('./pages/SocialPlaceholders').then(m => ({default: m.Youtube})));
  const LinkedIn = React.lazy(() => import('./pages/SocialPlaceholders').then(m => ({default: m.LinkedIn})));

function App() {
  // Use a safer approach to create QueryClient to avoid React null issues
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <AccessibilityProvider>
              <QueryClientProvider client={queryClient}>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="p-6 text-slate-600">Carregando…</div>
                    </div>
                  }>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/demo-pm3" element={<DemoPM3 />} />
                  <Route path="/demo-footer" element={<BrandingDemo />} />
                  
                  {/* Footer-linked public pages */}
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/integration" element={<Integration />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/brand" element={<Brand />} />
                  <Route path="/help" element={<Help />} />
                  
                  {/* Social placeholder routes */}
                  <Route path="/facebook" element={<Facebook />} />
                  <Route path="/instagram" element={<Instagram />} />
                  <Route path="/youtube" element={<Youtube />} />
                  <Route path="/linkedin" element={<LinkedIn />} />
                  
                  {/* Protected routes - require authentication */}
                  <Route path="/organization-setup" element={
                    <ProtectedRoute>
                      <OrganizationSetup />
                    </ProtectedRoute>
                  } />
                  <Route path="/analysis" element={
                    <ProtectedRoute>
                      <Analysis />
                    </ProtectedRoute>
                  } />
                  {/* E2E-only route (dev/test) */}
                  {(import.meta.env.DEV || import.meta.env.VITE_E2E_AUTH_BYPASS === 'true') && (
                    <Route path="/analysis-e2e" element={<AnalysisE2E />} />
                  )}
                  
                  
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
              </QueryClientProvider>
              <Toaster />
            </AccessibilityProvider>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
