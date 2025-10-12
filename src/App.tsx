
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ErrorBoundary } from "@/components";
import { LoadingSpinner } from "@/components";

// Lazy load pages for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Home = React.lazy(() => import("./pages/Home"));
const OrganizationHome = React.lazy(() => import("./pages/OrganizationHome"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Test = React.lazy(() => import("./pages/Test"));
const Demo = React.lazy(() => import("./pages/Demo"));
const DomainSetup = React.lazy(() => import("./pages/DomainSetup"));
const Changelog = React.lazy(() => import("./pages/Changelog"));
const Analysis = React.lazy(() => import("./pages/Analysis"));
const MyRank = React.lazy(() => import("./pages/MyRank"));
const DocumentRanking = React.lazy(() => import("./pages/DocumentRanking"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Loading component for Suspense
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true
                }}
              >
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    {/* PUBLIC ROUTES - No authentication required */}
                    <Route path="/" element={<Index />} /> {/* Landing page */}
                    <Route path="/login" element={<Login />} /> {/* Login page with post-login redirect */}
                    <Route path="/signup" element={<Signup />} /> {/* Registration page */}
                    <Route path="/demo" element={<Demo />} /> {/* Public demo with sample data */}
                    <Route path="/changelog" element={<Changelog />} /> {/* Public changelog */}
                    
                    {/* PROTECTED CLIENT ROUTES - Requires authentication + client role */}
            <Route
              path="/analysis"
              element={
                <ProtectedRoute requiredRole="client">
                  <Analysis />
                </ProtectedRoute>
              }
            /> {/* Main analysis dashboard with live data */}
            <Route
              path="/my-rank"
              element={
                <ProtectedRoute requiredRole="client">
                  <MyRank />
                </ProtectedRoute>
              }
            /> {/* Domain ranking analysis */}
            <Route
              path="/domain-setup"
              element={
                <ProtectedRoute requiredRole="client">
                  <DomainSetup />
                </ProtectedRoute>
              }
            /> {/* Domain configuration page */}
            <Route
              path="/document-ranking"
              element={
                <ProtectedRoute requiredRole="client">
                  <DocumentRanking />
                </ProtectedRoute>
              }
            /> {/* Document ranking with RankLLM */}
            <Route
              path="/home"
              element={
                <ProtectedRoute requiredRole="client">
                  <Home />
                </ProtectedRoute>
              }
            /> {/* Client home/dashboard */}
            <Route
              path="/home/:slug"
              element={
                <ProtectedRoute requiredRole="client">
                  <OrganizationHome />
                </ProtectedRoute>
              }
            /> {/* Organization-specific dashboard (multi-org support) */}
            
            {/* PROTECTED ADMIN ROUTES - Requires authentication + admin role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            /> {/* Admin dashboard for user management */}
            
            {/* PROTECTED GENERIC ROUTES - Requires authentication (any role) */}
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            /> {/* Temporary fallback page for authenticated users */}
                    {/* CATCH-ALL ROUTE - Must be last */}
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} /> {/* 404 page for undefined routes */}
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
