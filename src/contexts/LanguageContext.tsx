import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt-BR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.main': 'Main navigation',
    'nav.open': 'Open navigation menu',
    'nav.close': 'Close navigation menu',
    'nav.language': 'Language',
    'nav.signOut': 'Sign out',
    
    // Accessibility
    'accessibility.skipToContent': 'Skip to main content',
    'accessibility.openSettings': 'Open accessibility settings',
    'accessibility.close': 'Close',
    'accessibility.settings': 'Accessibility Settings',
    'accessibility.highContrast': 'High Contrast',
    'accessibility.highContrastDesc': 'Increase color contrast for better visibility',
    'accessibility.reducedMotion': 'Reduce Motion',
    'accessibility.reducedMotionDesc': 'Minimize animations and transitions',
    'accessibility.fontSize': 'Text Size',
    'accessibility.fontSize.normal': 'Normal',
    'accessibility.fontSize.large': 'Large',
    'accessibility.fontSize.extra-large': 'Extra Large',
    
    // Problem section
    'problem.title': 'Current Market Challenges',
    'problem.subtitle': 'Understanding the challenges brands face in the AI-driven landscape',
    'problem.point1.title': 'Lack of AI Brand Visibility',
    'problem.point1.desc': 'Most companies have no idea how AI systems like ChatGPT, Gemini, and Perplexity describe their brand when users ask about their industry.',
    'problem.point2.title': 'Missed Revenue Opportunities',
    'problem.point2.desc': 'Without understanding your AI presence, you might be losing potential customers who rely on AI for purchasing decisions and recommendations.',
    'problem.point3.title': 'Competitive Disadvantage',
    'problem.point3.desc': 'While you remain unaware, your competitors may already be optimizing their AI presence and gaining market advantage.',
    
    // Transformation section
    'transformation.title': 'Transform Your AI Brand Presence',
    'transformation.subtitle': 'Discover how leading companies are leveraging AI insights to dominate their markets',
    'transformation.feature1.title': 'AI Brand Analysis',
    'transformation.feature1.desc': 'Get comprehensive reports on how major AI systems perceive and describe your brand, products, and services.',
    'transformation.feature2.title': 'Competitive Intelligence',
    'transformation.feature2.desc': 'Understand how your competitors are positioned in AI responses and identify opportunities to gain advantage.',
    'transformation.feature3.title': 'Strategic Insights',
    'transformation.feature3.desc': 'Receive actionable recommendations to improve your AI visibility and influence AI-driven customer decisions.',
    
    // Existing translations
    'hero.badge': '🚀 Discover how AI sees your brand',
    'hero.title': 'How does AI describe your company?',
    'hero.subtitle': 'Find out how LLMs like ChatGPT, Gemini, and Perplexity describe your company.',
    'hero.cta': 'Get Your AI Brand Report',
    'pricing': 'Pricing',
    'faq': 'FAQ',
    'login': 'Login',
    'form.badge': '📧 Join the waitlist',
    'form.title': 'Be the first to know',
    'form.subtitle': 'Get early access and exclusive insights about your brand in AI.',
    'form.name.placeholder': 'Your full name',
    'form.email.placeholder': 'your@email.com',
    'form.phone.placeholder': 'Your phone number',
    'form.button': 'Join Waitlist',
    'form.submitting': 'Submitting...',
    'form.success.title': 'Welcome to the waitlist!',
    'form.success.subtitle': 'We\'ll notify you as soon as PromptMetrics is available.',
    'form.error.name.required': 'Name is required',
    'form.error.name.min': 'Name must be at least 2 characters',
    'form.error.email.required': 'Email is required',
    'form.error.email.invalid': 'Please enter a valid email address',
    'form.error.phone.required': 'Phone number is required',
    'form.error.phone.invalid': 'Please enter a valid phone number',
    'form.error.submit': 'Something went wrong. Please try again.',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': '© 2024 PromptMetrics. All rights reserved.',
  },
  'pt-BR': {
    // Navigation
    'nav.main': 'Navegação principal',
    'nav.open': 'Abrir menu de navegação',
    'nav.close': 'Fechar menu de navegação',
    'nav.language': 'Idioma',
    'nav.signOut': 'Sair',
    
    // Accessibility
    'accessibility.skipToContent': 'Pular para o conteúdo principal',
    'accessibility.openSettings': 'Abrir configurações de acessibilidade',
    'accessibility.close': 'Fechar',
    'accessibility.settings': 'Configurações de Acessibilidade',
    'accessibility.highContrast': 'Alto Contraste',
    'accessibility.highContrastDesc': 'Aumentar contraste das cores para melhor visibilidade',
    'accessibility.reducedMotion': 'Reduzir Movimento',
    'accessibility.reducedMotionDesc': 'Minimizar animações e transições',
    'accessibility.fontSize': 'Tamanho do Texto',
    'accessibility.fontSize.normal': 'Normal',
    'accessibility.fontSize.large': 'Grande',
    'accessibility.fontSize.extra-large': 'Extra Grande',
    
    // Problem section
    'problem.title': 'Desafios Atuais do Mercado',
    'problem.subtitle': 'Compreendendo os desafios que as marcas enfrentam no cenário impulsionado pela IA',
    'problem.point1.title': 'Falta de Visibilidade da Marca na IA',
    'problem.point1.desc': 'A maioria das empresas não tem ideia de como sistemas de IA como ChatGPT, Gemini e Perplexity descrevem sua marca quando usuários perguntam sobre seu setor.',
    'problem.point2.title': 'Oportunidades de Receita Perdidas',
    'problem.point2.desc': 'Sem entender sua presença na IA, você pode estar perdendo clientes potenciais que dependem da IA para decisões de compra e recomendações.',
    'problem.point3.title': 'Desvantagem Competitiva',
    'problem.point3.desc': 'Enquanto você permanece alheio, seus concorrentes podem já estar otimizando sua presença na IA e ganhando vantagem no mercado.',
    
    // Transformation section
    'transformation.title': 'Transforme sua Presença na IA',
    'transformation.subtitle': 'Descubra como empresas líderes estão aproveitando insights de IA para dominar seus mercados',
    'transformation.feature1.title': 'Análise da Marca na IA',
    'transformation.feature1.desc': 'Obtenha relatórios abrangentes sobre como os principais sistemas de IA percebem e descrevem sua marca, produtos e serviços.',
    'transformation.feature2.title': 'Inteligência Competitiva',
    'transformation.feature2.desc': 'Entenda como seus concorrentes estão posicionados nas respostas da IA e identifique oportunidades para ganhar vantagem.',
    'transformation.feature3.title': 'Insights Estratégicos',
    'transformation.feature3.desc': 'Receba recomendações acionáveis para melhorar sua visibilidade na IA e influenciar decisões de clientes impulsionadas pela IA.',
    
    // Existing translations
    'hero.badge': '🚀 Descubra como a IA vê sua marca',
    'hero.title': 'Como a IA descreve sua empresa?',
    'hero.subtitle': 'Saiba como LLMs como ChatGPT, Gemini e Perplexity descrevem sua empresa.',
    'hero.cta': 'Obter Relatório da Marca na IA',
    'pricing': 'Preços',
    'faq': 'Perguntas Frequentes',
    'login': 'Entrar',
    'form.badge': '📧 Entre na lista de espera',
    'form.title': 'Seja o primeiro a saber',
    'form.subtitle': 'Tenha acesso antecipado e insights exclusivos sobre sua marca na IA.',
    'form.name.placeholder': 'Seu nome completo',
    'form.email.placeholder': 'seu@email.com',
    'form.phone.placeholder': 'Seu número de telefone',
    'form.button': 'Entrar na Lista',
    'form.submitting': 'Enviando...',
    'form.success.title': 'Bem-vindo à lista de espera!',
    'form.success.subtitle': 'Notificaremos você assim que o PromptMetrics estiver disponível.',
    'form.error.name.required': 'Nome é obrigatório',
    'form.error.name.min': 'Nome deve ter pelo menos 2 caracteres',
    'form.error.email.required': 'Email é obrigatório',
    'form.error.email.invalid': 'Por favor, insira um endereço de email válido',
    'form.error.phone.required': 'Número de telefone é obrigatório',
    'form.error.phone.invalid': 'Por favor, insira um número de telefone válido',
    'form.error.submit': 'Algo deu errado. Tente novamente.',
    'footer.terms': 'Termos de Serviço',
    'footer.privacy': 'Política de Privacidade',
    'footer.copyright': '© 2024 PromptMetrics. Todos os direitos reservados.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt-BR')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
