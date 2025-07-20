import React, { createContext, useContext, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

type Language = 'en' | 'pt-BR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tHTML: (key: string) => { __html: string };
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

    // Hero section
    'hero.badge': '🚀 Boost your brand\'s performance on AI chats',
    'hero.title': 'What is AI saying about your company?',
    'hero.subtitle': 'Consumers are asking LLMs like ChatGPT, Gemini, and Perplexity about your brand and products. Is your company ready?',
    'hero.cta': 'Get Your AI Brand Report',
    
    // Problem section
    'tags.currentChallenges': 'The market has already changed',
    'problem.title': 'Ranking on search engines is no longer enough',
    'problem.subtitle': 'Millions of customers are already asking AI for help before deciding a purchase.',
    'problem.point1.title': 'Lack of AI Brand Visibility',
    'problem.point1.desc': 'Most companies have no idea how AI systems like ChatGPT, Gemini, and Perplexity describe their brand when users ask about their industry.',
    'problem.point2.title': 'Missed Revenue Opportunities',
    'problem.point2.desc': 'Without understanding your AI presence, you might be losing potential customers who rely on AI for purchasing decisions and recommendations.',
    'problem.point3.title': 'Competitive Disadvantage',
    'problem.point3.desc': 'While you remain unaware, your competitors may already be optimizing their AI presence and gaining market advantage.',
    
    // Transformation section
    'tags.transformation': 'Transformation',
    'transformation.title': 'A satisfied customer brings another.<br />A well-trained AI brings <em>much more</em>.',
    'transformation.subtitle': 'Discover how leading companies are influencing ChatGPT, Gemini, Perplexity, and other GenAIs to bring in more customers and increase revenue.',
    'transformation.feature1.title': 'AI Brand Analysis',
    'transformation.feature1.desc': 'Get comprehensive reports on how major AI systems perceive and describe your brand, products, and services.',
    'transformation.feature2.title': 'Competitive Intelligence',
    'transformation.feature2.desc': 'Understand how your competitors are positioned in AI responses and identify opportunities to gain advantage.',
    'transformation.feature3.title': 'Strategic Insights',
    'transformation.feature3.desc': 'Receive actionable recommendations to improve your AI visibility and influence AI-driven customer decisions.',
    
    // Pricing section
    'tags.pricingPlans': 'Pricing & Plans',
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.subtitle': 'Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.',
    'pricing.monthly': 'Monthly',
    'pricing.annual': 'Annual',
    'pricing.save': 'Save 45%',
    'pricing.trial.title': 'Free Trial',
    'pricing.trial.price': '0',
    'pricing.trial.period': 'Next 3 months',
    'pricing.trial.desc': 'Perfect for getting started',
    'pricing.trial.feature1': 'Basic AI brand analysis',
    'pricing.trial.feature2': 'Monthly reports',
    'pricing.trial.feature3': 'Email support',
    'pricing.trial.feature4': '3 competitor comparisons',
    'pricing.pro.title': 'Professional',
    'pricing.pro.price': '99',
    'pricing.pro.yearlyPrice': '89',
    'pricing.pro.period': 'month',
    'pricing.pro.desc': 'For growing businesses',
    'pricing.pro.feature1': 'Advanced AI brand analysis',
    'pricing.pro.feature2': 'Weekly reports',
    'pricing.pro.feature3': 'Priority support',
    'pricing.pro.feature4': 'Unlimited competitor tracking',
    'pricing.pro.feature5': 'Strategic recommendations',
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.yearlyPrice': 'Custom',
    'pricing.enterprise.desc': 'For large organizations',
    'pricing.enterprise.feature1': 'Custom AI analysis',
    'pricing.enterprise.feature2': 'Daily insights',
    'pricing.enterprise.feature3': 'Dedicated account manager',
    'pricing.enterprise.feature4': 'White-label reports',
    'pricing.choose': 'Get Started',
    'pricing.contact': 'Contact Sales',
    
    // FAQ section
    'tags.faq': 'Frequently Asked Questions',
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How does AI brand analysis work?',
    'faq.a1': 'We query major AI systems like ChatGPT, Gemini, and Perplexity with industry-specific questions to understand how they describe your brand, products, and services.',
    'faq.q2': 'How often do you update the reports?',
    'faq.a2': 'Report frequency depends on your plan. Free trial includes monthly reports, Professional includes weekly reports, and Enterprise includes daily insights.',
    'faq.q3': 'Can I track my competitors?',
    'faq.a3': 'Yes! Our platform allows you to monitor how AI systems describe your competitors, helping you identify opportunities and stay ahead of the market.',
    'faq.q4': 'Is my data secure?',
    'faq.a4': 'Absolutely. We use enterprise-grade security measures and never share your data with third parties. All analysis is conducted securely and confidentially.',
    
    // Existing translations
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
    'footer.changelog': 'Changelog',
    'footer.copyright': '© 2024 PromptMetrics. All rights reserved.',
    
    // Changelog page
    'changelog.title': 'Changelog & Release Notes',
    'changelog.subtitle': 'Track all updates and improvements to PromptMetrics',
    'changelog.empty': 'No updates yet. Changes will appear here as they are made.',
    'changelog.latest': 'Latest',
    
    // Changelog versions
    'changelog.v1.4.0.title': 'Changelog & Transparency',
    'changelog.v1.4.0.changes': '• Added comprehensive changelog page with version history|• Implemented footer navigation with changelog link|• Enhanced responsive design for changelog display|• Improved footer layout with better mobile responsiveness',
    'changelog.v1.3.0.title': 'Domain Management',
    'changelog.v1.3.0.changes': '• Implemented first-time user domain setup flow|• Added domain validation with real-time feedback|• Created beautiful domain setup page with animations|• Enhanced user onboarding experience|• Added redirect logic based on domain configuration status',
    'changelog.v1.2.0.title': 'Interactive Demo',
    'changelog.v1.2.0.changes': '• Built comprehensive demo page with AI analysis tabs|• Added prompt analysis, competitor analysis, and strategic insights|• Implemented interactive data tables and charts|• Created sentiment analysis visualization|• Added prompt customization and flash cards features',
    'changelog.v1.1.0.title': 'Authentication & Admin',
    'changelog.v1.1.0.changes': '• Implemented complete authentication system with Supabase|• Added role-based access control (admin, client)|• Created admin dashboard with user management|• Built invitation code system for user registration|• Added security audit logs and login attempt tracking|• Implemented organization management system',
    'changelog.v1.0.0.title': 'Platform Launch',
    'changelog.v1.0.0.changes': '• Launched PromptMetrics platform with landing page|• Implemented bilingual support (English & Portuguese)|• Created responsive design with accessibility features|• Built pricing, FAQ, and contact form sections|• Added waitlist functionality with form validation|• Established design system with Tailwind CSS',
    
    // MyRank page
    'myrank.title': 'My AI Ranking',
    'myrank.subtitle': 'To see your ranking, you need to first analyze a domain.',
    'myrank.domainPlaceholder': 'Enter your domain (e.g., pipefy.com)',
    'myrank.analysisPageLink': 'Or go to the analysis page to get started.',
    'myrank.analyzing': 'Analyzing',
    'myrank.domain': 'Domain',
    'myrank.updateData': 'Update Data',
    'myrank.changeDomain': 'Change Domain',
    'myrank.error': 'Error',
    'myrank.loadingAnalysis': 'Loading analysis...',
    'myrank.noAnalysisFound': 'No analysis found for domain "{domain}".',
    'myrank.createNewAnalysis': 'Click here to create a new analysis.',
    'myrank.promptNewDomain': 'Enter the new domain:',
    
    // MyRank tabs
    'myrank.tabs.dashboard': 'Dashboard',
    'myrank.tabs.promptAnalysis': 'Prompt Analysis',
    'myrank.tabs.competitorAnalysis': 'Competitive Analysis',
    'myrank.tabs.strategicInsights': 'Strategic Insights',
    
    // Test page
    'test.title': 'Simplified Debug',
    'test.subtitle': 'Basic connectivity test with Supabase.',
    'test.debugTests': 'Debug Tests',
    'test.testConnectivity': 'Test Connectivity',
    'test.simulateHook': 'Simulate useAnalysisData',
    'test.clear': 'Clear',
    'test.dataFound': 'Data Found',
    'test.domain': 'Domain',
    'test.status': 'Status',
    'test.score': 'Score',
    'test.updated': 'Updated',
    'test.debugLogs': 'Debug Logs',
    'test.clickToStart': 'Click a button to start the test.',
    
    // MyRank Dashboard components
    'dashboard.currentAnalysis': 'Current Analysis',
    'dashboard.overallScore': 'Overall Score',
    'dashboard.status': 'Status',
    'dashboard.analysisComplete': 'Analysis Complete',
    'dashboard.processing': 'Processing...',
    'dashboard.analysisError': 'Analysis Error',
    'dashboard.avgRankingOverTime': 'Average Ranking Over Time',
    'dashboard.shareOfFirstPlace': 'Share of #1 Rank',
    'dashboard.sentimentTrends': 'Sentiment Trends (6 Months)',
    'dashboard.overallSentimentScore': 'Overall Sentiment Score',
    'dashboard.yourBrand': 'Your Brand',
    'dashboard.others': 'Others',
    'dashboard.analysisData': 'Analysis Data',
    'dashboard.analysisSummary': 'Analysis Summary',
    'dashboard.recommendations': 'Recommendations:',
    
    // Prompt Analysis
    'promptAnalysis.totalMentions': 'Total Mentions',
    'promptAnalysis.positiveMentions': 'Positive Mentions',
    'promptAnalysis.neutralMentions': 'Neutral Mentions',
    'promptAnalysis.negativeMentions': 'Negative Mentions',
    'promptAnalysis.sentimentByAI': 'Sentiment by AI',
    'promptAnalysis.sentiment': 'Sentiment',
    'promptAnalysis.rankingByPromptCategory': 'Ranking by Prompt Category',
    
    // Competitor Analysis
    'competitorAnalysis.title': 'Competitive Analysis',
    'competitorAnalysis.analyzing': 'Analyzing',
    'competitorAnalysis.strategicPriorities': 'Strategic Priorities',
    'competitorAnalysis.basedOnCurrentAnalysis': 'Based on current analysis of your brand.',
    'competitorAnalysis.participation': 'participation',
    'competitorAnalysis.marketShare': 'Market Share',
    'competitorAnalysis.strengthsTitle': 'Strengths',
    'competitorAnalysis.improvementAreasTitle': 'Areas for Improvement',
    'competitorAnalysis.marketTrends': 'Market Trends (6 Months)',
    'competitorAnalysis.opportunities': 'Opportunities',
    'competitorAnalysis.impact': 'Impact',
    'competitorAnalysis.effort': 'Effort',
    'competitorAnalysis.high': 'High',
    'competitorAnalysis.medium': 'Medium',
    'competitorAnalysis.low': 'Low',
    
    // Strategic Insights
    'strategicInsights.title': 'Strategic Insights',
    'strategicInsights.analysisFor': 'Strategic analysis for',
    'strategicInsights.keyInsights': 'Key Insights',
    'strategicInsights.recommendations': 'Recommendations',
    'strategicInsights.actionItems': 'Immediate Actions',
    'strategicInsights.growthOpportunities': 'Growth Opportunities',
    'strategicInsights.competitiveThreats': 'Competitive Threats',
    'strategicInsights.strategicSummary': 'Strategic Summary',
    'strategicInsights.analysisScore': 'With an overall score of {score}/100 in AI systems.',
    'strategicInsights.insightsIdentified': 'Insights Identified',
    'strategicInsights.recommendationsCount': 'Recommendations',
    'strategicInsights.immediateActions': 'Immediate Actions',
    
    // Analysis Page
    'analysis.title': 'Domain Analysis',
    'analysis.subtitle': 'Analyze how your brand appears in AI systems like ChatGPT, Gemini and Perplexity',
    'analysis.completeAnalysis.title': 'Complete Analysis',
    'analysis.completeAnalysis.desc': 'Detailed analysis of how your brand is perceived by different AI systems',
    'analysis.strategicInsights.title': 'Strategic Insights',
    'analysis.strategicInsights.desc': 'Practical recommendations to improve your presence in AI systems',
    'analysis.multiplePlatforms.title': 'Multiple Platforms',
    'analysis.multiplePlatforms.desc': 'Cross-platform analysis including ChatGPT, Gemini, Perplexity and others',
    'analysis.newAnalysis.title': 'New Analysis',
    'analysis.newAnalysis.desc': 'Enter the domain you want to analyze',
    'analysis.analysisInProgress.title': 'Analysis in progress',
    'analysis.analysisInProgress.desc': 'Analyzing {domain}... This may take a few minutes.',
    'analysis.howItWorks.title': 'How does it work?',
    'analysis.step1.title': 'Enter your domain',
    'analysis.step1.desc': 'Enter your website domain (e.g. lovable.dev)',
    'analysis.step2.title': 'AI Processing',
    'analysis.step2.desc': 'Our system queries multiple AIs about your brand',
    'analysis.step3.title': 'Complete report',
    'analysis.step3.desc': 'Receive detailed insights and recommendations',
    'analysis.analysisHistory.title': 'Analysis History',
    'analysis.analysisHistory.desc': 'Results from completed analyses',
    'analysis.viewRanking': 'View My Ranking',
    'analysis.analysisInProgressMessage': 'Analysis in progress... You can already view your ranking page.',
    'analysis.checkResults': 'Check Results',
    
    // Domain Analysis Input
    'domainInput.placeholder': 'Enter domain to analyze (e.g., lovable.dev)',
    'domainInput.analyzing': 'Analyzing...',
    'domainInput.analyze': 'Analyze',
    'domainInput.startSuccess': 'Analysis started! Results will appear shortly.',
    'domainInput.startError': 'Failed to start analysis',
    'domainInput.domainSubmitted': 'Domain submitted for analysis',
    
    // Analysis Results
    'analysisResults.title': 'Analysis Results',
    'analysisResults.noResults': 'No results found',
    'analysisResults.noResultsDesc': 'No analyses have been performed yet. Make your first analysis!',
    'analysisResults.noResultsForDomain': 'No analysis was found for domain "{domain}".',
    'analysisResults.resultsCount': '{count} result(s)',
    'analysisResults.analyzedOn': 'Analyzed on',
    'analysisResults.updatedOn': 'Updated on',
    'analysisResults.summary': 'Summary:',
    'analysisResults.score': 'Score:',
    'analysisResults.recommendations': 'Recommendations:',
    'analysisResults.moreRecommendations': '+{count} more recommendations',
    'analysisResults.viewFullData': 'View complete data',
    'analysisResults.dataNotAvailable': 'Analysis data not available',
    'analysisResults.loadError': 'Failed to load analysis results',
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
    
    // Hero section
    'hero.badge': '🚀 Melhore o Desempenho da sua marca nas conversas com IA',
    'hero.title': 'O que a IA está falando sobre sua empresa?',
    'hero.subtitle': 'Consumidores estão buscando ajuda de LLMs como ChatGPT, Gemini e Perplexity na hora de pesquisar e comprar. Sua marca está preparada?',
    'hero.cta': 'Obter Relatório da Marca na IA',

    // Problem section
    'tags.currentChallenges': 'O Mercado já mudou',
    'problem.title': 'Posicionar sua marca nos resultados de busca não é mais suficiente',
    'problem.subtitle': 'Cada vez mais pessoas estão buscando ajuda de Inteligência Artificial antes de comprar.',
    'problem.point1.title': 'Falta de Visibilidade da Marca na IA',
    'problem.point1.desc': 'A maioria das empresas não tem ideia de como sistemas de IA como ChatGPT, Gemini e Perplexity descrevem sua marca quando usuários perguntam sobre seu setor.',
    'problem.point2.title': 'Oportunidades de Receita Perdidas',
    'problem.point2.desc': 'Sem entender sua presença na IA, você pode estar perdendo clientes potenciais que dependem da IA para decisões de compra e recomendações.',
    'problem.point3.title': 'Desvantagem Competitiva',
    'problem.point3.desc': 'Enquanto você ignora o problema, seus concorrentes podem já estar otimizando sua presença na IA e ganhando vantagem no mercado.',
    
    // Transformation section
    'tags.transformation': 'Transformação',
    'transformation.title': 'Um cliente satisfeito traz outro.<br />Uma IA bem treinada traz <em>muitos</em>.',
    'transformation.subtitle': 'Descubra como empresas líderes estão influenciando ChatGPT, Gemini, Perplexity e outras ferramentas de IA a trazer clientes e aumentar receita.',
    'transformation.feature1.title': 'Análise da Marca na IA',
    'transformation.feature1.desc': 'Obtenha relatórios abrangentes sobre como os principais sistemas de IA percebem e descrevem sua marca, produtos e serviços.',
    'transformation.feature2.title': 'Inteligência Competitiva',
    'transformation.feature2.desc': 'Entenda como seus concorrentes estão posicionados nas respostas da IA e identifique oportunidades para ganhar vantagem.',
    'transformation.feature3.title': 'Insights Estratégicos',
    'transformation.feature3.desc': 'Receba recomendações acionáveis para melhorar sua visibilidade na IA e influenciar decisões de clientes impulsionadas pela IA.',
    
    // Pricing section
    'tags.pricingPlans': 'Planos e Preços',
    'pricing.title': 'Preços Simples e Transparentes',
    'pricing.subtitle': 'Escolha o plano que funciona para você\nTodos os planos incluem acesso à nossa plataforma, ferramentas de geração de leads e suporte dedicado.',
    'pricing.monthly': 'Mensal',
    'pricing.annual': 'Anual',
    'pricing.save': 'Economize 45%',
    'pricing.trial.title': 'Teste Gratuito',
    'pricing.trial.price': '0',
    'pricing.trial.period': 'Próximos 3 meses',
    'pricing.trial.desc': 'Perfeito para começar',
    'pricing.trial.feature1': 'Análise básica da marca na IA',
    'pricing.trial.feature2': 'Relatórios mensais',
    'pricing.trial.feature3': 'Suporte por email',
    'pricing.trial.feature4': '3 comparações com concorrentes',
    'pricing.pro.title': 'Profissional',
    'pricing.pro.price': '99',
    'pricing.pro.yearlyPrice': '89',
    'pricing.pro.period': 'mês',
    'pricing.pro.desc': 'Para empresas em crescimento',
    'pricing.pro.feature1': 'Análise avançada da marca na IA',
    'pricing.pro.feature2': 'Relatórios semanais',
    'pricing.pro.feature3': 'Suporte prioritário',
    'pricing.pro.feature4': 'Rastreamento ilimitado de concorrentes',
    'pricing.pro.feature5': 'Recomendações estratégicas',
    'pricing.enterprise.title': 'Empresarial',
    'pricing.enterprise.price': 'Consulte',
    'pricing.enterprise.yearlyPrice': 'Consulte',
    'pricing.enterprise.desc': 'Para grandes organizações',
    'pricing.enterprise.feature1': 'Análise personalizada de IA',
    'pricing.enterprise.feature2': 'Insights diários',
    'pricing.enterprise.feature3': 'Gerente de conta dedicado',
    'pricing.enterprise.feature4': 'Relatórios com marca própria',
    'pricing.choose': 'Começar',
    'pricing.contact': 'Falar com Vendas',
    
    // FAQ section
    'tags.faq': 'Perguntas Frequentes',
    'faq.title': 'Perguntas Frequentes',
    'faq.q1': 'Como funciona a análise da marca na IA?',
    'faq.a1': 'Consultamos os principais sistemas de IA como ChatGPT, Gemini e Perplexity com perguntas específicas do setor para entender como eles descrevem sua marca, produtos e serviços.',
    'faq.q2': 'Com que frequência vocês atualizam os relatórios?',
    'faq.a2': 'A frequência dos relatórios depende do seu plano. O teste gratuito inclui relatórios mensais, o Profissional inclui relatórios semanais, e o Empresarial inclui insights diários.',
    'faq.q3': 'Posso acompanhar meus concorrentes?',
    'faq.a3': 'Sim! Nossa plataforma permite monitorar como os sistemas de IA descrevem seus concorrentes, ajudando você a identificar oportunidades e ficar à frente do mercado.',
    'faq.q4': 'Meus dados estão seguros?',
    'faq.a4': 'Absolutamente. Usamos medidas de segurança de nível empresarial e nunca compartilhamos seus dados com terceiros. Toda análise é conduzida de forma segura e confidencial.',
    
    // Existing translations
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
    'footer.changelog': 'Changelog',
    'footer.copyright': '© 2024 PromptMetrics. Todos os direitos reservados.',
    
    // Changelog page
    'changelog.title': 'Changelog & Notas de Versão',
    'changelog.subtitle': 'Acompanhe todas as atualizações e melhorias do PromptMetrics',
    'changelog.empty': 'Nenhuma atualização ainda. As mudanças aparecerão aqui conforme são feitas.',
    'changelog.latest': 'Mais Recente',
    
    // Changelog versions
    'changelog.v1.4.0.title': 'Changelog & Transparência',
    'changelog.v1.4.0.changes': '• Adicionada página abrangente de changelog com histórico de versões|• Implementada navegação no footer com link para changelog|• Melhorado design responsivo para exibição do changelog|• Aprimorado layout do footer com melhor responsividade móvel',
    'changelog.v1.3.0.title': 'Gerenciamento de Domínio',
    'changelog.v1.3.0.changes': '• Implementado fluxo de configuração de domínio para novos usuários|• Adicionada validação de domínio com feedback em tempo real|• Criada página de configuração de domínio com animações|• Melhorada experiência de onboarding do usuário|• Adicionada lógica de redirecionamento baseada no status de configuração do domínio',
    'changelog.v1.2.0.title': 'Demo Interativo',
    'changelog.v1.2.0.changes': '• Construída página de demo abrangente com abas de análise de IA|• Adicionadas análises de prompt, análise de concorrentes e insights estratégicos|• Implementadas tabelas e gráficos interativos de dados|• Criada visualização de análise de sentimento|• Adicionados recursos de personalização de prompt e flash cards',
    'changelog.v1.1.0.title': 'Autenticação & Admin',
    'changelog.v1.1.0.changes': '• Implementado sistema completo de autenticação com Supabase|• Adicionado controle de acesso baseado em funções (admin, cliente)|• Criado painel administrativo com gerenciamento de usuários|• Construído sistema de códigos de convite para registro de usuários|• Adicionados logs de auditoria de segurança e rastreamento de tentativas de login|• Implementado sistema de gerenciamento de organizações',
    'changelog.v1.0.0.title': 'Lançamento da Plataforma',
    'changelog.v1.0.0.changes': '• Lançada plataforma PromptMetrics com página inicial|• Implementado suporte bilíngue (inglês e português)|• Criado design responsivo com recursos de acessibilidade|• Construídas seções de preços, FAQ e formulário de contato|• Adicionada funcionalidade de lista de espera com validação de formulário|• Estabelecido sistema de design com Tailwind CSS',
    
    // MyRank page
    'myrank.title': 'Meu Ranking IA',
    'myrank.subtitle': 'Para ver seu ranking, você precisa primeiro analisar um domínio.',
    'myrank.domainPlaceholder': 'Digite seu domínio (ex: pipefy.com)',
    'myrank.analysisPageLink': 'Ou acesse a página de análise para começar.',
    'myrank.analyzing': 'Analisando',
    'myrank.domain': 'Domínio',
    'myrank.updateData': 'Atualizar Dados',
    'myrank.changeDomain': 'Trocar Domínio',
    'myrank.error': 'Erro',
    'myrank.loadingAnalysis': 'Carregando análise...',
    'myrank.noAnalysisFound': 'Nenhuma análise encontrada para o domínio "{domain}".',
    'myrank.createNewAnalysis': 'Clique aqui para criar uma nova análise.',
    'myrank.promptNewDomain': 'Digite o novo domínio:',
    
    // MyRank tabs
    'myrank.tabs.dashboard': 'Dashboard',
    'myrank.tabs.promptAnalysis': 'Análise de Prompts',
    'myrank.tabs.competitorAnalysis': 'Análise Competitiva',
    'myrank.tabs.strategicInsights': 'Insights Estratégicos',
    
    // Test page
    'test.title': 'Debug Simplificado',
    'test.subtitle': 'Teste de conectividade básica com o Supabase.',
    'test.debugTests': 'Testes de Debug',
    'test.testConnectivity': 'Testar Conectividade',
    'test.simulateHook': 'Simular useAnalysisData',
    'test.clear': 'Limpar',
    'test.dataFound': 'Dados Encontrados',
    'test.domain': 'Domínio',
    'test.status': 'Status',
    'test.score': 'Score',
    'test.updated': 'Atualizado',
    'test.debugLogs': 'Logs de Debug',
    'test.clickToStart': 'Clique em um botão para iniciar o teste.',
    
    // MyRank Dashboard components
    'dashboard.currentAnalysis': 'Análise Atual',
    'dashboard.overallScore': 'Pontuação Geral',
    'dashboard.status': 'Status',
    'dashboard.analysisComplete': 'Análise Completa',
    'dashboard.processing': 'Processando...',
    'dashboard.analysisError': 'Erro na Análise',
    'dashboard.avgRankingOverTime': 'Ranking Médio ao Longo do Tempo',
    'dashboard.shareOfFirstPlace': 'Participação no 1º Lugar',
    'dashboard.sentimentTrends': 'Tendências de Sentimento (6 Meses)',
    'dashboard.overallSentimentScore': 'Pontuação Geral de Sentimento',
    'dashboard.yourBrand': 'Sua Marca',
    'dashboard.others': 'Outros',
    'dashboard.analysisData': 'Dados da Análise',
    'dashboard.analysisSummary': 'Resumo da Análise',
    'dashboard.recommendations': 'Recomendações:',
    
    // Prompt Analysis
    'promptAnalysis.totalMentions': 'Total de Menções',
    'promptAnalysis.positiveMentions': 'Menções Positivas',
    'promptAnalysis.neutralMentions': 'Menções Neutras',
    'promptAnalysis.negativeMentions': 'Menções Negativas',
    'promptAnalysis.sentimentByAI': 'Sentimento por IA',
    'promptAnalysis.sentiment': 'Sentimento',
    'promptAnalysis.rankingByPromptCategory': 'Ranking por Categoria de Prompt',
    
    // Competitor Analysis
    'competitorAnalysis.title': 'Análise Competitiva',
    'competitorAnalysis.analyzing': 'Analisando',
    'competitorAnalysis.strategicPriorities': 'Prioridades Estratégicas',
    'competitorAnalysis.basedOnCurrentAnalysis': 'Baseado na análise atual da sua marca.',
    'competitorAnalysis.participation': 'participação',
    'competitorAnalysis.marketShare': 'Participação de Mercado',
    'competitorAnalysis.strengthsTitle': 'Pontos Fortes',
    'competitorAnalysis.improvementAreasTitle': 'Pontos de Melhoria',
    'competitorAnalysis.marketTrends': 'Tendências de Mercado (6 Meses)',
    'competitorAnalysis.opportunities': 'Oportunidades',
    'competitorAnalysis.impact': 'Impacto',
    'competitorAnalysis.effort': 'Esforço',
    'competitorAnalysis.high': 'Alto',
    'competitorAnalysis.medium': 'Médio',
    'competitorAnalysis.low': 'Baixo',
    
    // Strategic Insights
    'strategicInsights.title': 'Insights Estratégicos',
    'strategicInsights.analysisFor': 'Análise estratégica para',
    'strategicInsights.keyInsights': 'Insights Principais',
    'strategicInsights.recommendations': 'Recomendações',
    'strategicInsights.actionItems': 'Ações Imediatas',
    'strategicInsights.growthOpportunities': 'Oportunidades de Crescimento',
    'strategicInsights.competitiveThreats': 'Ameaças Competitivas',
    'strategicInsights.strategicSummary': 'Resumo Estratégico',
    'strategicInsights.analysisScore': 'Com uma pontuação geral de {score}/100 nos sistemas de IA.',
    'strategicInsights.insightsIdentified': 'Insights Identificados',
    'strategicInsights.recommendationsCount': 'Recomendações',
    'strategicInsights.immediateActions': 'Ações Imediatas',
    
    // Analysis Page
    'analysis.title': 'Análise de Domínio',
    'analysis.subtitle': 'Analise como sua marca aparece em sistemas de IA como ChatGPT, Gemini e Perplexity',
    'analysis.completeAnalysis.title': 'Análise Completa',
    'analysis.completeAnalysis.desc': 'Análise detalhada de como sua marca é percebida por diferentes sistemas de IA',
    'analysis.strategicInsights.title': 'Insights Estratégicos',
    'analysis.strategicInsights.desc': 'Recomendações práticas para melhorar sua presença em sistemas de IA',
    'analysis.multiplePlatforms.title': 'Múltiplas Plataformas',
    'analysis.multiplePlatforms.desc': 'Análise cross-platform incluindo ChatGPT, Gemini, Perplexity e outros',
    'analysis.newAnalysis.title': 'Nova Análise',
    'analysis.newAnalysis.desc': 'Digite o domínio que deseja analisar',
    'analysis.analysisInProgress.title': 'Análise em andamento',
    'analysis.analysisInProgress.desc': 'Analisando {domain}... Isso pode levar alguns minutos.',
    'analysis.howItWorks.title': 'Como funciona?',
    'analysis.step1.title': 'Digite seu domínio',
    'analysis.step1.desc': 'Digite o domínio do seu site (ex: lovable.dev)',
    'analysis.step2.title': 'Processamento IA',
    'analysis.step2.desc': 'Nosso sistema consulta múltiplas IAs sobre sua marca',
    'analysis.step3.title': 'Relatório completo',
    'analysis.step3.desc': 'Receba insights e recomendações detalhadas',
    'analysis.analysisHistory.title': 'Histórico de Análises',
    'analysis.analysisHistory.desc': 'Resultados das análises realizadas',
    'analysis.viewRanking': 'Ver Meu Ranking',
    'analysis.analysisInProgressMessage': 'Análise em andamento... Você já pode visualizar sua página de ranking.',
    'analysis.checkResults': 'Ver Resultados',
    
    // Domain Analysis Input
    'domainInput.placeholder': 'Digite o domínio para analisar (ex: lovable.dev)',
    'domainInput.analyzing': 'Analisando...',
    'domainInput.analyze': 'Analisar',
    'domainInput.startSuccess': 'Análise iniciada! Os resultados aparecerão em breve.',
    'domainInput.startError': 'Falha ao iniciar análise',
    'domainInput.domainSubmitted': 'Domínio enviado para análise',
    
    // Analysis Results
    'analysisResults.title': 'Resultados da Análise',
    'analysisResults.noResults': 'Nenhum resultado encontrado',
    'analysisResults.noResultsDesc': 'Ainda não há análises realizadas. Faça sua primeira análise!',
    'analysisResults.noResultsForDomain': 'Nenhuma análise foi encontrada para o domínio "{domain}".',
    'analysisResults.resultsCount': '{count} resultado(s)',
    'analysisResults.analyzedOn': 'Analisado em',
    'analysisResults.updatedOn': 'Atualizado em',
    'analysisResults.summary': 'Resumo:',
    'analysisResults.score': 'Pontuação:',
    'analysisResults.recommendations': 'Recomendações:',
    'analysisResults.moreRecommendations': '+{count} mais recomendações',
    'analysisResults.viewFullData': 'Ver dados completos',
    'analysisResults.dataNotAvailable': 'Dados de análise não disponíveis',
    'analysisResults.loadError': 'Falha ao carregar resultados da análise',
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
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt-BR')) {
      setLanguage(savedLanguage);
    } else {
      setLanguage('en');
      localStorage.setItem('language', 'en');
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

  const tHTML = (key: string): { __html: string } => {
    const translation = translations[language][key as keyof typeof translations['en']] || key;
    // Sanitize HTML content to prevent XSS attacks
    const sanitizedHTML = DOMPurify.sanitize(translation, {
      ALLOWED_TAGS: ['em', 'strong', 'br', 'span', 'i', 'b'],
      ALLOWED_ATTR: ['class']
    });
    return { __html: sanitizedHTML };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, tHTML }}>
      {children}
    </LanguageContext.Provider>
  );
};
