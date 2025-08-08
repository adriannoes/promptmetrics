
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
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

const Index = () => {
  
  
  return (
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
  );
};

export default Index;
