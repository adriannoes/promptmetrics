/**
 * Configuração de ambiente centralizada
 * Garante que todas as variáveis necessárias estejam disponíveis
 */

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Validação de variáveis de ambiente obrigatórias
const validateEnvironment = () => {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.';
    
    if (import.meta.env.PROD) {
      throw new Error(errorMessage);
    } else {
      console.error(errorMessage);
      // In development, we still throw to prevent silent failures
      throw new Error(errorMessage);
    }
  }

  return requiredVars;
};

// Configuração do ambiente
export const env: EnvironmentConfig = (() => {
  const vars = validateEnvironment();
  
  // Validate that we have the required values (no fallbacks for security)
  if (!vars.VITE_SUPABASE_URL || !vars.VITE_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase configuration is required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
    );
  }
  
  return {
    supabase: {
      url: vars.VITE_SUPABASE_URL,
      anonKey: vars.VITE_SUPABASE_ANON_KEY,
    },
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    logLevel: import.meta.env.PROD ? 'warn' : 'debug',
  };
})();

// Exportar configurações específicas
export const { supabase, isDevelopment, isProduction, logLevel } = env;

// Função para verificar se estamos em ambiente de produção
export const isProductionEnvironment = () => isProduction;

// Função para verificar se estamos em ambiente de desenvolvimento
export const isDevelopmentEnvironment = () => isDevelopment;
