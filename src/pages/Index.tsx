
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

/**
 * Index/Landing Page
 * 
 * This is a PUBLIC page accessible to everyone.
 * It serves as the main landing page with marketing content.
 * 
 * Navigation:
 * - Authenticated users can access this page and navigate via Header
 * - Post-login redirects are handled by usePostLoginRedirect in Login.tsx
 * - Does NOT auto-redirect authenticated users (allows them to view landing page)
 */
const Index = () => {





  
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
