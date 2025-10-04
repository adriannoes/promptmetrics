
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<Demo />} />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute requiredRole="client">
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rank"
              element={
                <ProtectedRoute requiredRole="client">
                  <MyRank />
                </ProtectedRoute>
              }
            />
            <Route path="/changelog" element={<Changelog />} />
            <Route
              path="/domain-setup"
              element={
                <ProtectedRoute requiredRole="client">
                  <DomainSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute requiredRole="client">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/:slug"
              element={
                <ProtectedRoute requiredRole="client">
                  <OrganizationHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
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
