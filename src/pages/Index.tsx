
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Hero from '../components/Hero';
const Problem = React.lazy(() => import('../components/Problem'));
const Transformation = React.lazy(() => import('../components/Transformation'));
const Pricing = React.lazy(() => import('../components/Pricing'));
const FAQ = React.lazy(() => import('../components/FAQ'));
const ContactForm = React.lazy(() => import('../components/ContactForm'));
import Footer from '../components/ui/footer-section';
import AccessibilityPanel from '../components/AccessibilityPanel';

const Index = () => {
  
  
  return (
    <div className="min-h-screen bg-white">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main">
        <Hero />
        <React.Suspense fallback={<div className="px-4 py-8 text-slate-600">Carregando…</div>}>
          <section id="features"><Problem /></section>
          <section id="integration"><Transformation /></section>
          <section id="pricing"><Pricing /></section>
          <section id="testimonials"><FAQ /></section>
          <ContactForm />
        </React.Suspense>
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

export default Index;
