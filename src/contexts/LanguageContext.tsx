
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt-BR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'en': {
    // Header
    'pricing': 'Pricing',
    'faq': 'FAQ',
    'login': 'Login',
    
    // Hero
    'hero.badge': '🚀 Revolutionize your LLM evaluations',
    'hero.title': 'Evaluate LLMs with Precision and Scale',
    'hero.subtitle': 'Complete platform to compare, rank, and optimize language models with advanced metrics and actionable insights.',
    'hero.cta': 'Join Waitlist',
    
    // Problem
    'problem.title': 'The Challenge You Face',
    'problem.subtitle': 'Evaluating language models is complex, time-consuming, and often inaccurate without the right tools.',
    'problem.point1.title': 'Manual and Subjective Evaluation',
    'problem.point1.desc': 'Comparing models manually takes hours and is prone to human bias, resulting in inconsistent decisions.',
    'problem.point2.title': 'Rising Testing Costs',
    'problem.point2.desc': 'Testing multiple models without a clear strategy wastes resources and increases operational costs.',
    'problem.point3.title': 'Lack of Standardized Metrics',
    'problem.point3.desc': 'Without consistent benchmarks, it\'s impossible to make informed decisions about which model to use.',
    
    // Transformation
    'transformation.title': 'The Transformation We Offer',
    'transformation.subtitle': 'Automate, standardize, and accelerate your LLM evaluations with our intelligent platform.',
    'transformation.feature1.title': 'Automated Benchmarks',
    'transformation.feature1.desc': 'Run standardized tests on multiple models simultaneously with precise and comparable metrics.',
    'transformation.feature2.title': 'Cost-Benefit Analysis',
    'transformation.feature2.desc': 'Compare performance vs. cost to make smart decisions about which model to use in each case.',
    'transformation.feature3.title': 'Actionable Insights',
    'transformation.feature3.desc': 'Detailed reports with specific recommendations to optimize your LLM strategy.',
    
    // Pricing
    'pricing.title': 'Plans Tailored to Your Needs',
    'pricing.subtitle': 'Choose the ideal plan to start optimizing your language models today.',
    'pricing.choose': 'Choose Plan',
    'pricing.contact': 'Contact Sales',
    
    'pricing.trial.title': 'Trial',
    'pricing.trial.price': '5.99',
    'pricing.trial.period': 'for 3 months',
    'pricing.trial.desc': 'Perfect for testing',
    'pricing.trial.feature1': 'Up to 50 evaluations',
    'pricing.trial.feature2': '3 comparison models',
    'pricing.trial.feature3': 'Basic metrics',
    'pricing.trial.feature4': 'Email support',
    
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '29',
    'pricing.pro.yearlyPrice': '190',
    'pricing.pro.period': 'month',
    'pricing.pro.desc': 'For growing teams',
    'pricing.pro.feature1': 'Unlimited evaluations',
    'pricing.pro.feature2': 'All available models',
    'pricing.pro.feature3': 'Advanced + custom metrics',
    'pricing.pro.feature4': 'Full API',
    'pricing.pro.feature5': 'Priority support',
    
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.yearlyPrice': 'Custom',
    'pricing.enterprise.desc': 'For large organizations',
    'pricing.enterprise.feature1': 'Enterprise volume',
    'pricing.enterprise.feature2': 'Private models',
    'pricing.enterprise.feature3': 'Guaranteed SLA',
    'pricing.enterprise.feature4': 'Dedicated support',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How does automated evaluation work?',
    'faq.a1': 'Our platform runs standardized tests on multiple models simultaneously, collecting performance, latency, cost, and response quality metrics to generate objective comparisons.',
    'faq.q2': 'Which LLM models are supported?',
    'faq.a2': 'We support all major models like GPT-4, Claude, Gemini, Llama, and many others. We also offer integration with custom models for Enterprise customers.',
    'faq.q3': 'Is the data sent secure?',
    'faq.a3': 'Yes, we use end-to-end encryption and follow strict security standards. Your data is never permanently stored or used to train other models.',
    'faq.q4': 'Can I cancel anytime?',
    'faq.a4': 'Absolutely. All plans can be canceled at any time without additional fees. You keep access to exported data.'
  },
  'pt-BR': {
    // Header
    'pricing': 'Preços',
    'faq': 'FAQ',
    'login': 'Entrar',
    
    // Hero
    'hero.badge': '🚀 Revolucione suas avaliações de LLM',
    'hero.title': 'Avalie LLMs com Precisão e Escala',
    'hero.subtitle': 'Plataforma completa para comparar, ranquear e otimizar modelos de linguagem com métricas avançadas e insights acionáveis.',
    'hero.cta': 'Entre na Lista de Espera',
    
    // Problem
    'problem.title': 'O Desafio que Você Enfrenta',
    'problem.subtitle': 'Avaliar modelos de linguagem é complexo, demorado e frequentemente impreciso sem as ferramentas certas.',
    'problem.point1.title': 'Avaliação Manual e Subjetiva',
    'problem.point1.desc': 'Comparar modelos manualmente leva horas e é propenso a viés humano, resultando em decisões inconsistentes.',
    'problem.point2.title': 'Custos Crescentes de Teste',
    'problem.point2.desc': 'Testar múltiplos modelos sem uma estratégia clara desperdiça recursos e aumenta custos operacionais.',
    'problem.point3.title': 'Falta de Métricas Padronizadas',
    'problem.point3.desc': 'Sem benchmarks consistentes, é impossível tomar decisões fundamentadas sobre qual modelo usar.',
    
    // Transformation
    'transformation.title': 'A Transformação que Oferecemos',
    'transformation.subtitle': 'Automatize, padronize e acelere suas avaliações de LLM com nossa plataforma inteligente.',
    'transformation.feature1.title': 'Benchmarks Automatizados',
    'transformation.feature1.desc': 'Execute testes padronizados em múltiplos modelos simultaneamente com métricas precisas e comparáveis.',
    'transformation.feature2.title': 'Análise de Custo-Benefício',
    'transformation.feature2.desc': 'Compare performance vs. custo para tomar decisões inteligentes sobre qual modelo usar em cada caso.',
    'transformation.feature3.title': 'Insights Acionáveis',
    'transformation.feature3.desc': 'Relatórios detalhados com recomendações específicas para otimizar sua estratégia de LLM.',
    
    // Pricing
    'pricing.title': 'Planos Sob Medida para Sua Necessidade',
    'pricing.subtitle': 'Escolha o plano ideal para começar a otimizar seus modelos de linguagem hoje.',
    'pricing.choose': 'Escolher Plano',
    'pricing.contact': 'Falar com Vendas',
    
    'pricing.trial.title': 'Trial',
    'pricing.trial.price': '5.99',
    'pricing.trial.period': 'por 3 meses',
    'pricing.trial.desc': 'Perfeito para testar',
    'pricing.trial.feature1': 'Até 50 avaliações',
    'pricing.trial.feature2': '3 modelos de comparação',
    'pricing.trial.feature3': 'Métricas básicas',
    'pricing.trial.feature4': 'Suporte por email',
    
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '29',
    'pricing.pro.yearlyPrice': '190',
    'pricing.pro.period': 'mês',
    'pricing.pro.desc': 'Para equipes em crescimento',
    'pricing.pro.feature1': 'Avaliações ilimitadas',
    'pricing.pro.feature2': 'Todos os modelos disponíveis',
    'pricing.pro.feature3': 'Métricas avançadas + custom',
    'pricing.pro.feature4': 'API completa',
    'pricing.pro.feature5': 'Suporte prioritário',
    
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': 'Customizado',
    'pricing.enterprise.yearlyPrice': 'Customizado',
    'pricing.enterprise.desc': 'Para grandes organizações',
    'pricing.enterprise.feature1': 'Volume enterprise',
    'pricing.enterprise.feature2': 'Modelos privados',
    'pricing.enterprise.feature3': 'SLA garantido',
    'pricing.enterprise.feature4': 'Suporte dedicado',
    
    // FAQ
    'faq.title': 'Perguntas Frequentes',
    'faq.q1': 'Como funciona a avaliação automatizada?',
    'faq.a1': 'Nossa plataforma executa testes padronizados em múltiplos modelos simultaneamente, coletando métricas de performance, latência, custo e qualidade de resposta para gerar comparações objetivas.',
    'faq.q2': 'Quais modelos de LLM são suportados?',
    'faq.a2': 'Suportamos todos os principais modelos como GPT-4, Claude, Gemini, Llama, e muitos outros. Também oferecemos integração com modelos customizados para clientes Enterprise.',
    'faq.q3': 'Os dados enviados são seguros?',
    'faq.a3': 'Sim, utilizamos criptografia end-to-end e seguimos rigorosos padrões de segurança. Seus dados nunca são armazenados permanentemente ou usados para treinar outros modelos.',
    'faq.q4': 'Posso cancelar a qualquer momento?',
    'faq.a4': 'Absolutamente. Todos os planos podem ser cancelados a qualquer momento sem taxas adicionais. Você mantém acesso aos dados exportados.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  
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
