
import React from 'react';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Transformation from '../components/Transformation';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import Footer from '../components/ui/footer-section';
import AccessibilityPanel from '../components/AccessibilityPanel';

const Index = () => {
  
  
  return (
    <div className="min-h-screen bg-white">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main">
        <Hero />
        <section id="features"><Problem /></section>
        <section id="integration"><Transformation /></section>
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
