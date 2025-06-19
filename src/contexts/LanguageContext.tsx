
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt-BR' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  'pt-BR': {
    // Header
    'login': 'Entrar',
    'hero.title': 'Avalie e compare LLMs com precisão científica',
    'hero.subtitle': 'A plataforma definitiva para benchmarking de modelos de linguagem. Compare performance, custos e qualidade em tempo real.',
    'hero.cta': 'Entre na lista de espera',
    'pricing': 'Planos e Preços',
    'faq': 'Perguntas Frequentes',
    
    // Problem Section
    'problem.title': 'O Desafio da Escolha Certa',
    'problem.subtitle': 'Escolher o LLM ideal para seu projeto não deveria ser um jogo de tentativa e erro',
    'problem.point1.title': 'Falta de Transparência',
    'problem.point1.desc': 'Benchmarks públicos não refletem casos de uso reais',
    'problem.point2.title': 'Custos Ocultos',
    'problem.point2.desc': 'Preços por token não mostram o custo real de produção',
    'problem.point3.title': 'Performance Inconsistente',
    'problem.point3.desc': 'Resultados variam drasticamente entre diferentes tarefas',
    
    // Transformation Section
    'transformation.title': 'A Solução que Você Precisa',
    'transformation.subtitle': 'RankMeLLM transforma a avaliação de LLMs em uma ciência exata',
    'transformation.feature1.title': 'Benchmarks Personalizados',
    'transformation.feature1.desc': 'Teste modelos com seus próprios dados e casos de uso',
    'transformation.feature2.title': 'Análise de Custo Real',
    'transformation.feature2.desc': 'Calcule custos totais incluindo latência e re-tentativas',
    'transformation.feature3.title': 'Comparação Lado a Lado',
    'transformation.feature3.desc': 'Visualize performance em dashboards interativos',
    
    // Pricing Section
    'pricing.title': 'Planos e Preços',
    'pricing.subtitle': 'Escolha o plano ideal para suas necessidades',
    'pricing.starter.title': 'Starter',
    'pricing.starter.price': 'Gratuito',
    'pricing.starter.desc': 'Para desenvolvedores e pequenos projetos',
    'pricing.starter.feature1': 'Até 5 modelos comparados',
    'pricing.starter.feature2': '1.000 avaliações por mês',
    'pricing.starter.feature3': 'Benchmarks básicos',
    'pricing.starter.feature4': 'Suporte por email',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': 'R$ 297',
    'pricing.pro.period': '/mês',
    'pricing.pro.desc': 'Para equipes e projetos profissionais',
    'pricing.pro.feature1': 'Modelos ilimitados',
    'pricing.pro.feature2': '50.000 avaliações por mês',
    'pricing.pro.feature3': 'Benchmarks personalizados',
    'pricing.pro.feature4': 'API completa',
    'pricing.pro.feature5': 'Suporte prioritário',
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': 'Personalizado',
    'pricing.enterprise.desc': 'Para grandes organizações',
    'pricing.enterprise.feature1': 'Volume ilimitado',
    'pricing.enterprise.feature2': 'Deploy on-premise',
    'pricing.enterprise.feature3': 'SLA dedicado',
    'pricing.enterprise.feature4': 'Treinamento personalizado',
    'pricing.choose': 'Escolher Plano',
    'pricing.contact': 'Falar com Vendas',
    
    // FAQ Section
    'faq.title': 'Perguntas Frequentes',
    'faq.q1': 'Como funciona a avaliação de modelos?',
    'faq.a1': 'Nossa plataforma executa testes padronizados e personalizados nos modelos selecionados, coletando métricas de performance, latência e custo em tempo real.',
    'faq.q2': 'Posso usar meus próprios dados para teste?',
    'faq.a2': 'Sim! Você pode criar benchmarks personalizados usando seus próprios datasets e casos de uso específicos.',
    'faq.q3': 'Quais modelos são suportados?',
    'faq.a3': 'Suportamos todos os principais LLMs: GPT-4, Claude, Gemini, Llama, e muitos outros. A lista é atualizada constantemente.',
    'faq.q4': 'Como é calculado o custo real?',
    'faq.a4': 'Consideramos não apenas o preço por token, mas também latência, taxa de sucesso, e custos de infraestrutura para fornecer o TCO real.',
    
    // Form Section
    'form.title': 'Entre na Lista de Espera',
    'form.subtitle': 'Seja um dos primeiros a testar a plataforma',
    'form.name': 'Nome completo',
    'form.email': 'Email',
    'form.phone': 'Telefone',
    'form.submit': 'Entrar na Lista',
    'form.success': 'Obrigado! Você foi adicionado à nossa lista de espera.',
    'form.error': 'Erro ao enviar formulário. Tente novamente.',
    
    // Footer
    'footer.terms': 'Termos de Uso',
    'footer.privacy': 'Política de Privacidade',
  },
  'en': {
    // Header
    'login': 'Login',
    'hero.title': 'Evaluate and compare LLMs with scientific precision',
    'hero.subtitle': 'The definitive platform for language model benchmarking. Compare performance, costs, and quality in real-time.',
    'hero.cta': 'Join Waitlist',
    'pricing': 'Pricing',
    'faq': 'FAQ',
    
    // Problem Section
    'problem.title': 'The Challenge of Making the Right Choice',
    'problem.subtitle': 'Choosing the ideal LLM for your project shouldn\'t be a trial and error game',
    'problem.point1.title': 'Lack of Transparency',
    'problem.point1.desc': 'Public benchmarks don\'t reflect real-world use cases',
    'problem.point2.title': 'Hidden Costs',
    'problem.point2.desc': 'Token pricing doesn\'t show the real production cost',
    'problem.point3.title': 'Inconsistent Performance',
    'problem.point3.desc': 'Results vary drastically between different tasks',
    
    // Transformation Section
    'transformation.title': 'The Solution You Need',
    'transformation.subtitle': 'RankMeLLM transforms LLM evaluation into an exact science',
    'transformation.feature1.title': 'Custom Benchmarks',
    'transformation.feature1.desc': 'Test models with your own data and use cases',
    'transformation.feature2.title': 'Real Cost Analysis',
    'transformation.feature2.desc': 'Calculate total costs including latency and retries',
    'transformation.feature3.title': 'Side-by-Side Comparison',
    'transformation.feature3.desc': 'Visualize performance in interactive dashboards',
    
    // Pricing Section
    'pricing.title': 'Pricing Plans',
    'pricing.subtitle': 'Choose the perfect plan for your needs',
    'pricing.starter.title': 'Starter',
    'pricing.starter.price': 'Free',
    'pricing.starter.desc': 'For developers and small projects',
    'pricing.starter.feature1': 'Up to 5 models compared',
    'pricing.starter.feature2': '1,000 evaluations per month',
    'pricing.starter.feature3': 'Basic benchmarks',
    'pricing.starter.feature4': 'Email support',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '$67',
    'pricing.pro.period': '/month',
    'pricing.pro.desc': 'For teams and professional projects',
    'pricing.pro.feature1': 'Unlimited models',
    'pricing.pro.feature2': '50,000 evaluations per month',
    'pricing.pro.feature3': 'Custom benchmarks',
    'pricing.pro.feature4': 'Full API access',
    'pricing.pro.feature5': 'Priority support',
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.desc': 'For large organizations',
    'pricing.enterprise.feature1': 'Unlimited volume',
    'pricing.enterprise.feature2': 'On-premise deployment',
    'pricing.enterprise.feature3': 'Dedicated SLA',
    'pricing.enterprise.feature4': 'Custom training',
    'pricing.choose': 'Choose Plan',
    'pricing.contact': 'Contact Sales',
    
    // FAQ Section
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How does model evaluation work?',
    'faq.a1': 'Our platform runs standardized and custom tests on selected models, collecting performance, latency, and cost metrics in real-time.',
    'faq.q2': 'Can I use my own data for testing?',
    'faq.a2': 'Yes! You can create custom benchmarks using your own datasets and specific use cases.',
    'faq.q3': 'Which models are supported?',
    'faq.a3': 'We support all major LLMs: GPT-4, Claude, Gemini, Llama, and many others. The list is constantly updated.',
    'faq.q4': 'How is the real cost calculated?',
    'faq.a4': 'We consider not just token pricing, but also latency, success rate, and infrastructure costs to provide the real TCO.',
    
    // Form Section
    'form.title': 'Join the Waitlist',
    'form.subtitle': 'Be among the first to test the platform',
    'form.name': 'Full name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.submit': 'Join Waitlist',
    'form.success': 'Thank you! You have been added to our waitlist.',
    'form.error': 'Error submitting form. Please try again.',
    
    // Footer
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
