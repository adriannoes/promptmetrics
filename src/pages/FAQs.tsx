import React from 'react';
import Header from '../components/Header';
import SkipNav from '../components/SkipNav';
import { SectionHeader } from '../components/SectionHeader';
import Footer from '../components/ui/footer-section';
import { useLanguage } from '../contexts/LanguageContext';

const FAQs: React.FC = () => {
  const { language } = useLanguage();
  const isPT = language === 'pt-BR';

  const title = isPT ? 'Perguntas Frequentes' : 'Frequently Asked Questions';
  const subtitle = isPT
    ? 'Perguntas frequentes sobre a PromptMetrics'
    : 'Common questions about PromptMetrics';

  const faqs = isPT
    ? [
        {
          q: 'O que é a PromptMetrics?',
          a: 'A PromptMetrics é uma plataforma que analisa e compara prompts para identificar oportunidades de melhoria, padronizar boas práticas e acelerar o aprendizado de times.',
        },
        {
          q: 'Preciso de integração com minha stack?',
          a: 'Não. Você pode começar colando seus prompts e resultados diretamente. Integrações com ferramentas como Supabase e n8n são opcionais.',
        },
        {
          q: 'Como a plataforma mede a qualidade dos prompts?',
          a: 'Utilizamos métricas proprietárias e heurísticas de clareza, consistência e desempenho, além de comparativos entre versões de prompts.',
        },
        {
          q: 'Meus dados ficam seguros?',
          a: 'Sim. Armazenamos apenas o necessário para executar as análises e oferecemos controles para anonimização. Veja a nossa Política de Privacidade.',
        },
      ]
    : [
        {
          q: 'What is PromptMetrics?',
          a: 'PromptMetrics is a platform that analyzes and compares prompts to identify improvement opportunities, standardize best practices, and accelerate team learning.',
        },
        {
          q: 'Do I need integrations with my stack?',
          a: 'No. You can start by pasting your prompts and results directly. Integrations with tools like Supabase and n8n are optional.',
        },
        {
          q: 'How do you measure prompt quality?',
          a: 'We use proprietary metrics and heuristics for clarity, consistency, and performance, along with comparisons across prompt versions.',
        },
        {
          q: 'Is my data secure?',
          a: 'Yes. We store only what is necessary to run analyses and offer anonymization controls. See our Privacy Policy.',
        },
      ];
  return (
    <div className="min-h-screen bg-white">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title={title} subtitle={subtitle} align="center" />
          <div className="mx-auto mt-8 max-w-3xl space-y-6 text-slate-700">
            {faqs.map(item => (
              <div key={item.q}>
                <h2 className="text-lg font-semibold text-slate-900">{item.q}</h2>
                <p className="mt-2">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;


