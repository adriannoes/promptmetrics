/**
 * Configuração de ambiente para produção
 * SEM fallbacks hardcoded - falha se variáveis não estiverem definidas
 */

interface ProductionEnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
  logLevel: 'warn' | 'error';
}

// Validação rigorosa para produção
const validateProductionEnvironment = () => {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `CRITICAL: Missing required environment variables for production: ${missing.join(', ')}\n` +
      'Production deployment cannot proceed without these variables.\n' +
      'Please check your deployment configuration and ensure all required variables are set.'
    );
  }

  // Validação adicional das URLs
  if (!requiredVars.VITE_SUPABASE_URL.startsWith('https://')) {
    throw new Error('VITE_SUPABASE_URL must be a valid HTTPS URL');
  }

  if (!requiredVars.VITE_SUPABASE_ANON_KEY.startsWith('eyJ')) {
    throw new Error('VITE_SUPABASE_ANON_KEY must be a valid JWT token');
  }

  return requiredVars;
};

// Configuração de produção (sem fallbacks)
export const prodEnv: ProductionEnvironmentConfig = (() => {
  const vars = validateProductionEnvironment();
  
  return {
    supabase: {
      url: vars.VITE_SUPABASE_URL,
      anonKey: vars.VITE_SUPABASE_ANON_KEY,
    },
    isDevelopment: false,
    isProduction: true,
    logLevel: 'warn',
  };
})();

// Exportar configurações específicas
export const { supabase, isDevelopment, isProduction, logLevel } = prodEnv;
