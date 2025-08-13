import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';
import { useLanguage } from '../contexts/LanguageContext';

const Privacy: React.FC = () => {
  const { language } = useLanguage();
  const isPT = language === 'pt-BR';
  const title = isPT ? 'Política de Privacidade' : 'Privacy Policy';
  const subtitle = isPT
    ? 'Resumo de como cuidamos dos seus dados na PromptMetrics'
    : 'Summary of how we handle your data at PromptMetrics';
  const paragraphs = isPT
    ? [
        'Coletamos apenas as informações necessárias para executar as análises de prompts e melhorar a experiência do produto.',
        'Você pode solicitar a remoção de dados e optar por anonimização sempre que desejar.',
        'Utilizamos HTTPS/TLS em todas as comunicações e aplicamos controles de acesso por função.',
      ]
    : [
        'We collect only the information necessary to perform prompt analyses and improve the product experience.',
        'You can request data removal and opt for anonymization at any time.',
        'We use HTTPS/TLS for all communications and enforce role-based access controls.',
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

export default Privacy;


