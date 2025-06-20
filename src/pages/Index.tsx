
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Transformation from '../components/Transformation';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import TestComponent from '../components/TestComponent';

const Index = () => {
  console.log('Index component rendering...');
  
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <TestComponent />
        <Header />
        <Hero />
        <Problem />
        <Transformation />
        <Pricing />
        <FAQ />
        <ContactForm />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
