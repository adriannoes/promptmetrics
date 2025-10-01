
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Transformation from '../components/Transformation';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import AccessibilityPanel from '../components/AccessibilityPanel';
import { getPostLoginRedirect } from '@/services/redirectService';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  // Component rendering - no logging needed

  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Redirect logged-in users to their appropriate dashboard
  useEffect(() => {
    const handleLoggedInUserRedirect = async () => {
      if (loading) return; // Still loading, don't redirect yet

      if (user && profile) {
        // User is logged in, redirecting...

        try {
          const { path } = await getPostLoginRedirect(profile);
          // Redirecting to appropriate dashboard
          navigate(path, { replace: true });
        } catch (error) {
          console.error('Error during redirect:', error);
          // Fallback to /test if redirect fails
          navigate('/test', { replace: true });
        }
      } else if (user && !profile) {
        // User logged in but no profile found
        // Don't redirect, let them see the page so they can create profile if needed
      } else {
        // User not logged in, showing landing page
      }
    };

    handleLoggedInUserRedirect();
  }, [user, profile, loading, navigate]);





  
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-white">
        <SkipNav />
        <Header />
        <main id="main-content" tabIndex={-1} role="main">
          <Hero />
          <Problem />
          <Transformation />
          <Pricing />
          <FAQ />
          <ContactForm />
        </main>
        <Footer />
        <AccessibilityPanel />
      </div>
    </AccessibilityProvider>
  );
};

export default Index;
