import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';

export const Facebook: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SkipNav />
    <Header />
    <main id="main-content" tabIndex={-1} role="main" className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader title="Facebook" subtitle="Conteúdo em breve" align="center" />
      </div>
    </main>
    <Footer />
  </div>
);

export const Instagram: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SkipNav />
    <Header />
    <main id="main-content" tabIndex={-1} role="main" className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader title="Instagram" subtitle="Conteúdo em breve" align="center" />
      </div>
    </main>
    <Footer />
  </div>
);

export const Youtube: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SkipNav />
    <Header />
    <main id="main-content" tabIndex={-1} role="main" className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader title="Youtube" subtitle="Conteúdo em breve" align="center" />
      </div>
    </main>
    <Footer />
  </div>
);

export const LinkedIn: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SkipNav />
    <Header />
    <main id="main-content" tabIndex={-1} role="main" className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader title="LinkedIn" subtitle="Conteúdo em breve" align="center" />
      </div>
    </main>
    <Footer />
  </div>
);

export default Facebook;


