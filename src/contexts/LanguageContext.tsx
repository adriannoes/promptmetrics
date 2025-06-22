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
