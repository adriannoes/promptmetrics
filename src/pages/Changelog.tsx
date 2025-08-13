import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';
// Vite raw import para renderizar markdown como texto
import changelogRaw from '../../docs/CHANGELOG.md?raw';
import { useLanguage } from '../contexts/LanguageContext';

const Changelog: React.FC = () => {
  const { language } = useLanguage();
  const isPT = language === 'pt-BR';
  const title = isPT ? 'Changelog' : 'Changelog';
  const subtitle = isPT
    ? 'Histórico de mudanças da PromptMetrics'
    : 'Track all updates and improvements to PromptMetrics';
  return (
    <div className="min-h-screen bg-white">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title={title} subtitle={subtitle} align="center" />
          <article className="prose prose-slate max-w-none mt-8 whitespace-pre-wrap">
            {changelogRaw}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;


