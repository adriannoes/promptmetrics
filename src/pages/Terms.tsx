import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Terms of Services" subtitle="Conteúdo em breve" align="center" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;


