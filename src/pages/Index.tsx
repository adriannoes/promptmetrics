
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { 
  SkipNav, 
  Header, 
  Hero, 
  Problem, 
  Transformation, 
  Pricing, 
  FAQ, 
  ContactForm, 
  Footer 
} from '@/components';
import AccessibilityPanel from '@/components/AccessibilityPanel';

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
