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

  if (missing.length > 0 && import.meta.env.PROD) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return requiredVars;
};

// Configuração do ambiente
export const env: EnvironmentConfig = (() => {
  const vars = validateEnvironment();
  
  // Em produção, falhar se as variáveis não estiverem configuradas
  if (import.meta.env.PROD && (!vars.VITE_SUPABASE_URL || !vars.VITE_SUPABASE_ANON_KEY)) {
    throw new Error(
      'Missing required environment variables for production. ' +
      'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  
  // Em desenvolvimento, permitir valores padrão apenas se não estiverem configurados
  // Mas não hardcodar credenciais reais
  const url = vars.VITE_SUPABASE_URL;
  const anonKey = vars.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    throw new Error(
      'Missing required Supabase configuration. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
  
  return {
    supabase: {
      url,
      anonKey,
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
