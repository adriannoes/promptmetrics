import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { language } = useLanguage();
  const isPT = language === 'pt-BR';

  const title = isPT ? 'Sobre a PromptMetrics' : 'About PromptMetrics';
  const subtitle = isPT
    ? 'Nossa missão é elevar a qualidade de prompts e acelerar a entrega de valor'
    : 'Our mission is to raise prompt quality and accelerate value delivery';
  const paragraphs = isPT
    ? [
        'A PromptMetrics nasceu da necessidade de times de produto e dados padronizarem a criação de prompts e entenderem, com clareza, o que funciona no mundo real.',
        'Combinamos análise comparativa, boas práticas e insights acionáveis para reduzir tempo de iteração e aumentar a consistência entre squads.',
        'Nosso compromisso é oferecer uma experiência segura, acessível e orientada a resultados para a sua operação com IA.',
      ]
    : [
        'PromptMetrics was born from the need for product and data teams to standardize prompt creation and clearly understand what works in the real world.',
        'We combine comparative analysis, best practices, and actionable insights to reduce iteration time and increase consistency across squads.',
        'Our commitment is to deliver a secure, accessible, and results-driven experience for your AI operations.',
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

export default About;


