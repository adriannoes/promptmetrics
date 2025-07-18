
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import OrganizationHome from "./pages/OrganizationHome";
import Admin from "./pages/Admin";
import Test from "./pages/Test";
import Demo from "./pages/Demo";
import DomainSetup from "./pages/DomainSetup";
import Changelog from "./pages/Changelog";
import Analysis from "./pages/Analysis";
import MyRank from "./pages/MyRank";
import NotFound from "./pages/NotFound";
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { toast } from './components/ui/use-toast';
import DemoAirbnb from './pages/demo-airbnb';

function SessionDevWarning() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
      user && !loading
    ) {
      toast({
        title: 'Sessão ativa',
        description: 'Você está autenticado automaticamente porque a sessão persiste no navegador. Clique em "Sign out" para sair.',
        variant: 'default',
        duration: 8000
      });
    }
  }, [user, loading]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
            <SessionDevWarning />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/demo-airbnb" element={<DemoAirbnb />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/my-rank" element={<MyRank />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route 
              path="/domain-setup" 
              element={
                <ProtectedRoute requiredRole="client">
                  <DomainSetup />
                </ProtectedRoute>
              } 
            />
            <Route path="/test" element={<Test />} />
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
        </BrowserRouter>
      </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
