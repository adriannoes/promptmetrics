import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';
import { useLanguage } from '../contexts/LanguageContext';

const Terms: React.FC = () => {
  const { language } = useLanguage();
  const isPT = language === 'pt-BR';
  const title = isPT ? 'Termos de Serviço' : 'Terms of Service';
  const subtitle = isPT
    ? 'Condições básicas de uso da PromptMetrics'
    : 'Basic conditions for using PromptMetrics';
  const paragraphs = isPT
    ? [
        'Ao utilizar a PromptMetrics, você concorda em fornecer informações verdadeiras e utilizar o produto de forma lícita.',
        'Reservamo-nos o direito de atualizar os termos a qualquer momento. O uso continuado implica concordância com as alterações.',
        'Limitações de responsabilidade e diretrizes de uso aceitável se aplicam.',
      ]
    : [
        'By using PromptMetrics, you agree to provide accurate information and use the product lawfully.',
        'We reserve the right to update these terms at any time. Continued use implies acceptance of changes.',
        'Liability limitations and acceptable use guidelines apply.',
      ];
  return (
    <div className="min-h-screen bg-white">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title={title} subtitle={subtitle} align="center" />
          <div className="mx-auto mt-8 max-w-3xl space-y-6 text-slate-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;


