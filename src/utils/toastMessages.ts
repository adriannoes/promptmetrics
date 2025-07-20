import { toast } from 'sonner';

type Language = 'en' | 'pt-br';

const messages = {
  auth: {
    loginSuccess: {
      'en': 'Signed in successfully!',
      'pt-br': 'Login realizado com sucesso!'
    },
    loginError: {
      'en': 'Failed to sign in. Please try again.',
      'pt-br': 'Erro ao fazer login. Tente novamente.'
    },
    logoutSuccess: {
      'en': 'Signed out successfully!',
      'pt-br': 'Logout realizado com sucesso!'
    },
    logoutError: {
      'en': 'Failed to sign out. Please try again.',
      'pt-br': 'Erro ao sair. Tente novamente.'
    },
    signupSuccess: {
      'en': 'Account created successfully! Please check your email to confirm your account.',
      'pt-br': 'Conta criada com sucesso! Verifique seu email para confirmar sua conta.'
    },
    demoWelcome: {
      'en': 'Welcome to the demo!',
      'pt-br': 'Bem-vindo à demonstração!'
    },
    googleSigninError: {
      'en': 'Failed to sign in with Google. Please try again.',
      'pt-br': 'Erro ao entrar com Google. Tente novamente.'
    }
  },
  analysis: {
    newAnalysisRequested: {
      'en': 'New analysis requested! Results will appear in a few minutes.',
      'pt-br': 'Nova análise solicitada! Os resultados aparecerão em alguns minutos.'
    },
    analysisError: {
      'en': 'Failed to request new analysis. Please try again.',
      'pt-br': 'Erro ao solicitar nova análise. Tente novamente.'
    }
  }
};

export const authToast = {
  loginSuccess: (language: Language = 'en') => {
    toast.success(messages.auth.loginSuccess[language]);
  },
  
  loginError: (language: Language = 'en', customMessage?: string) => {
    toast.error(customMessage || messages.auth.loginError[language]);
  },
  
  logoutSuccess: (language: Language = 'en') => {
    toast.success(messages.auth.logoutSuccess[language]);
  },
  
  logoutError: (language: Language = 'en') => {
    toast.error(messages.auth.logoutError[language]);
  },
  
  signupSuccess: (language: Language = 'en') => {
    toast.success(messages.auth.signupSuccess[language]);
  },
  
  demoWelcome: (language: Language = 'en') => {
    toast.success(messages.auth.demoWelcome[language]);
  },
  
  googleSigninError: (language: Language = 'en') => {
    toast.error(messages.auth.googleSigninError[language]);
  }
};

export const analysisToast = {
  newAnalysisRequested: (language: Language = 'en') => {
    toast.success(messages.analysis.newAnalysisRequested[language]);
  },
  
  analysisError: (language: Language = 'en') => {
    toast.error(messages.analysis.analysisError[language]);
  }
};

// Helper to get current language from localStorage or default to 'en'
export const getCurrentLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const savedLanguage = localStorage.getItem('language');
  return (savedLanguage === 'pt-br') ? 'pt-br' : 'en';
}; 