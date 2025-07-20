import React, { createContext, useContext, useState, useCallback } from 'react';

interface LanguageContextProps {
  language: 'en' | 'pt-BR';
  setLanguage: (language: 'en' | 'pt-BR') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const translations = {
  en: {
    // Navigation
    'nav.main': 'Main navigation',
    'nav.home': 'Home',
    'nav.analysis': 'Analysis',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.demo': 'Demo',
    'nav.admin': 'Admin',
    'nav.myRank': 'My Rank',
    'nav.skipToMain': 'Skip to main content',
    'nav.toggleMenu': 'Toggle menu',
    'nav.close': 'Close',

    // Hero Section
    'hero.title': 'Transform Your Website with AI-Powered Analysis',
    'hero.subtitle': 'Get instant insights, competitor analysis, and strategic recommendations to boost your online presence',
    'hero.cta': 'Start Free Analysis',
    'hero.demo': 'View Demo',

    // Problem Section
    'problem.title': 'The Challenge Every Website Owner Faces',
    'problem.subtitle': 'Are you struggling with these common issues?',
    'problem.lowTraffic.title': 'Low Website Traffic',
    'problem.lowTraffic.description': 'Your website isn\'t attracting enough visitors despite your efforts',
    'problem.poorConversion.title': 'Poor Conversion Rates',
    'problem.poorConversion.description': 'Visitors come to your site but don\'t take the desired actions',
    'problem.lackInsights.title': 'Lack of Actionable Insights',
    'problem.lackInsights.description': 'You have data but don\'t know how to turn it into growth strategies',

    // Transformation Section
    'transformation.title': 'Transform Your Website Performance',
    'transformation.subtitle': 'Our AI analyzes your website and provides actionable insights',
    'transformation.analysis.title': 'Deep Website Analysis',
    'transformation.analysis.description': 'AI-powered analysis of your website\'s performance, SEO, and user experience',
    'transformation.insights.title': 'Strategic Insights',
    'transformation.insights.description': 'Get specific recommendations to improve your website\'s performance',
    'transformation.optimization.title': 'Optimization Roadmap',
    'transformation.optimization.description': 'Step-by-step plan to implement improvements and track progress',

    // Analysis Page
    'analysis.title': 'Website Analysis',
    'analysis.subtitle': 'Get comprehensive insights about your website performance',
    'analysis.domainPlaceholder': 'Enter your domain (e.g., example.com)',
    'analysis.analyzeButton': 'Analyze Website',
    'analysis.analyzing': 'Analyzing...',
    'analysis.error': 'Analysis failed. Please try again.',
    'analysis.success': 'Analysis completed successfully!',
    'analysis.noResults': 'No analysis results available.',
    'analysis.viewResults': 'View Results',
    'analysis.newAnalysis': {
      'title': 'Start New Analysis',
      'description': 'Enter a domain to begin comprehensive website analysis',
      'placeholder': 'Enter domain (e.g., example.com)',
      'button': 'Analyze Website'
    },
    'analysis.history': {
      'title': 'Recent Analyses',
      'description': 'View your previous website analyses',
      'empty': 'No previous analyses found',
      'domain': 'Domain',
      'date': 'Date',
      'status': 'Status',
      'actions': 'Actions'
    },

    // MyRank Page
    'myrank.title': 'My Rank Dashboard',
    'myrank.subtitle': 'Comprehensive analysis and insights for your website',
    'myrank.domainPlaceholder': 'Enter your domain (e.g., example.com)',
    'myrank.changeDomain': 'Change Domain',
    'myrank.updateData': 'Update Data',
    'myrank.loadingAnalysis': 'Loading Analysis Data',
    'myrank.tabs': {
      'dashboard': 'Dashboard',
      'promptAnalysis': 'Prompt Analysis',
      'competitorAnalysis': 'Competitor Analysis',
      'strategicInsights': 'Strategic Insights'
    },

    // Demo Page
    'demo.title': 'Live Demo',
    'demo.subtitle': 'Explore our analysis features with sample data',
    'demo.tabs': {
      'dashboard': 'Dashboard',
      'promptAnalysis': 'Prompt Analysis',
      'competitorAnalysis': 'Competitor Analysis',
      'strategicInsights': 'Strategic Insights'
    },

    // Pricing Section
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.subtitle': 'Choose the plan that fits your needs',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.save': 'Save 20%',
    'pricing.free.title': 'Free',
    'pricing.free.price': '$0',
    'pricing.free.period': '/month',
    'pricing.free.description': 'Perfect for getting started',
    'pricing.free.features': [
      'Basic website analysis',
      'Monthly reports',
      'Email support'
    ],
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '$29',
    'pricing.pro.period': '/month',
    'pricing.pro.description': 'For growing businesses',
    'pricing.pro.features': [
      'Advanced analysis',
      'Weekly reports',
      'Competitor tracking',
      'Priority support'
    ],
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': '$99',
    'pricing.enterprise.period': '/month',
    'pricing.enterprise.description': 'For large organizations',
    'pricing.enterprise.features': [
      'Custom analysis',
      'Daily reports',
      'Advanced integrations',
      'Dedicated support'
    ],
    'pricing.cta': 'Get Started',
    'pricing.contact': 'Contact Sales',

    // Contact Form
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions? We\'d love to hear from you',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone (optional)',
    'contact.company': 'Company',
    'contact.message': 'Message',
    'contact.submit': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Failed to send message. Please try again.',

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.contact': 'Contact',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.demo': 'Demo',
    'footer.support': 'Support',
    'footer.help': 'Help Center',
    'footer.docs': 'Documentation',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Try Again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.update': 'Update',
    'common.refresh': 'Refresh',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',

    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember me',
    'auth.loginSuccess': 'Login successful!',
    'auth.signupSuccess': 'Account created successfully!',
    'auth.error': 'Authentication failed',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.emailRequired': 'Email is required',
    'auth.passwordRequired': 'Password is required',

    // Status messages
    'status.success': 'Success',
    'status.error': 'Error',
    'status.warning': 'Warning',
    'status.info': 'Information',
    'status.processing': 'Processing',
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.failed': 'Failed',
  },
  'pt-BR': {
    // Navigation
    'nav.main': 'Navegação principal',
    'nav.home': 'Início',
    'nav.analysis': 'Análise',
    'nav.pricing': 'Preços',
    'nav.contact': 'Contato',
    'nav.login': 'Entrar',
    'nav.signup': 'Cadastrar',
    'nav.demo': 'Demo',
    'nav.admin': 'Admin',
    'nav.myRank': 'Meu Ranking',
    'nav.skipToMain': 'Pular para o conteúdo principal',
    'nav.toggleMenu': 'Alternar menu',
    'nav.close': 'Fechar',

    // Hero Section
    'hero.title': 'Transforme Seu Website com Análise Powered por IA',
    'hero.subtitle': 'Obtenha insights instantâneos, análise de concorrentes e recomendações estratégicas para impulsionar sua presença online',
    'hero.cta': 'Iniciar Análise Gratuita',
    'hero.demo': 'Ver Demo',

    // Problem Section
    'problem.title': 'O Desafio que Todo Proprietário de Website Enfrenta',
    'problem.subtitle': 'Você está lutando com esses problemas comuns?',
    'problem.lowTraffic.title': 'Baixo Tráfego no Website',
    'problem.lowTraffic.description': 'Seu website não está atraindo visitantes suficientes apesar dos seus esforços',
    'problem.poorConversion.title': 'Baixas Taxas de Conversão',
    'problem.poorConversion.description': 'Visitantes chegam ao seu site mas não tomam as ações desejadas',
    'problem.lackInsights.title': 'Falta de Insights Acionáveis',
    'problem.lackInsights.description': 'Você tem dados mas não sabe como transformá-los em estratégias de crescimento',

    // Transformation Section
    'transformation.title': 'Transforme a Performance do Seu Website',
    'transformation.subtitle': 'Nossa IA analisa seu website e fornece insights acionáveis',
    'transformation.analysis.title': 'Análise Profunda do Website',
    'transformation.analysis.description': 'Análise powered por IA da performance, SEO e experiência do usuário do seu website',
    'transformation.insights.title': 'Insights Estratégicos',
    'transformation.insights.description': 'Obtenha recomendações específicas para melhorar a performance do seu website',
    'transformation.optimization.title': 'Roadmap de Otimização',
    'transformation.optimization.description': 'Plano passo a passo para implementar melhorias e acompanhar o progresso',

    // Analysis Page
    'analysis.title': 'Análise de Website',
    'analysis.subtitle': 'Obtenha insights abrangentes sobre a performance do seu website',
    'analysis.domainPlaceholder': 'Digite seu domínio (ex: exemplo.com)',
    'analysis.analyzeButton': 'Analisar Website',
    'analysis.analyzing': 'Analisando...',
    'analysis.error': 'Análise falhou. Tente novamente.',
    'analysis.success': 'Análise concluída com sucesso!',
    'analysis.noResults': 'Nenhum resultado de análise disponível.',
    'analysis.viewResults': 'Ver Resultados',
    'analysis.newAnalysis': {
      'title': 'Iniciar Nova Análise',
      'description': 'Digite um domínio para começar a análise abrangente do website',
      'placeholder': 'Digite o domínio (ex: exemplo.com)',
      'button': 'Analisar Website'
    },
    'analysis.history': {
      'title': 'Análises Recentes',
      'description': 'Veja suas análises anteriores de websites',
      'empty': 'Nenhuma análise anterior encontrada',
      'domain': 'Domínio',
      'date': 'Data',
      'status': 'Status',
      'actions': 'Ações'
    },

    // MyRank Page
    'myrank.title': 'Painel do Meu Ranking',
    'myrank.subtitle': 'Análise abrangente e insights para seu website',
    'myrank.domainPlaceholder': 'Digite seu domínio (ex: exemplo.com)',
    'myrank.changeDomain': 'Alterar Domínio',
    'myrank.updateData': 'Atualizar Dados',
    'myrank.loadingAnalysis': 'Carregando Dados da Análise',
    'myrank.tabs': {
      'dashboard': 'Painel',
      'promptAnalysis': 'Análise de Prompts',
      'competitorAnalysis': 'Análise de Concorrentes',
      'strategicInsights': 'Insights Estratégicos'
    },

    // Demo Page
    'demo.title': 'Demo Ao Vivo',
    'demo.subtitle': 'Explore nossos recursos de análise com dados de exemplo',
    'demo.tabs': {
      'dashboard': 'Painel',
      'promptAnalysis': 'Análise de Prompts',
      'competitorAnalysis': 'Análise de Concorrentes',
      'strategicInsights': 'Insights Estratégicos'
    },

    // Pricing Section
    'pricing.title': 'Preços Simples e Transparentes',
    'pricing.subtitle': 'Escolha o plano que se adapta às suas necessidades',
    'pricing.monthly': 'Mensal',
    'pricing.yearly': 'Anual',
    'pricing.save': 'Economize 20%',
    'pricing.free.title': 'Grátis',
    'pricing.free.price': '$0',
    'pricing.free.period': '/mês',
    'pricing.free.description': 'Perfeito para começar',
    'pricing.free.features': [
      'Análise básica do website',
      'Relatórios mensais',
      'Suporte por email'
    ],
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '$29',
    'pricing.pro.period': '/mês',
    'pricing.pro.description': 'Para empresas em crescimento',
    'pricing.pro.features': [
      'Análise avançada',
      'Relatórios semanais',
      'Rastreamento de concorrentes',
      'Suporte prioritário'
    ],
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': '$99',
    'pricing.enterprise.period': '/mês',
    'pricing.enterprise.description': 'Para grandes organizações',
    'pricing.enterprise.features': [
      'Análise personalizada',
      'Relatórios diários',
      'Integrações avançadas',
      'Suporte dedicado'
    ],
    'pricing.cta': 'Começar',
    'pricing.contact': 'Contatar Vendas',

    // Contact Form
    'contact.title': 'Entre em Contato',
    'contact.subtitle': 'Tem perguntas? Adoraríamos ouvi-las',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.phone': 'Telefone (opcional)',
    'contact.company': 'Empresa',
    'contact.message': 'Mensagem',
    'contact.submit': 'Enviar Mensagem',
    'contact.success': 'Mensagem enviada com sucesso!',
    'contact.error': 'Falha ao enviar mensagem. Tente novamente.',

    // Footer
    'footer.company': 'Empresa',
    'footer.about': 'Sobre Nós',
    'footer.careers': 'Carreiras',
    'footer.contact': 'Contato',
    'footer.product': 'Produto',
    'footer.features': 'Recursos',
    'footer.pricing': 'Preços',
    'footer.demo': 'Demo',
    'footer.support': 'Suporte',
    'footer.help': 'Central de Ajuda',
    'footer.docs': 'Documentação',
    'footer.legal': 'Legal',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.rights': 'Todos os direitos reservados.',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Ocorreu um erro',
    'common.retry': 'Tentar Novamente',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.continue': 'Continuar',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.close': 'Fechar',
    'common.submit': 'Enviar',
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.add': 'Adicionar',
    'common.remove': 'Remover',
    'common.update': 'Atualizar',
    'common.refresh': 'Atualizar',
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.ok': 'OK',

    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.logout': 'Sair',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.forgotPassword': 'Esqueceu a senha?',
    'auth.rememberMe': 'Lembrar de mim',
    'auth.loginSuccess': 'Login realizado com sucesso!',
    'auth.signupSuccess': 'Conta criada com sucesso!',
    'auth.error': 'Falha na autenticação',
    'auth.invalidCredentials': 'Email ou senha inválidos',
    'auth.passwordMismatch': 'As senhas não coincidem',
    'auth.emailRequired': 'Email é obrigatório',
    'auth.passwordRequired': 'Senha é obrigatória',

    // Status messages
    'status.success': 'Sucesso',
    'status.error': 'Erro',
    'status.warning': 'Aviso',
    'status.info': 'Informação',
    'status.processing': 'Processando',
    'status.completed': 'Concluído',
    'status.pending': 'Pendente',
    'status.failed': 'Falhou',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'pt-BR'>('pt-BR');

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
