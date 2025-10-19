/**
 * Utilitário de logging seguro para produção
 * Remove logs sensíveis em ambiente de produção
 */

import { authLogRateLimiter } from '@/utils/rateLimiter';
import { logMonitor } from '@/utils/monitoring';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class SecureLogger {
  private isProduction = import.meta.env.PROD;
  private isDevelopment = import.meta.env.DEV;

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Se for produção, remover dados sensíveis
    if (this.isProduction) {
      if (typeof data === 'object') {
        const sanitized = { ...data };
        
        // Campos sensíveis que devem ser removidos
        const sensitiveFields = [
          'email', 'password', 'token', 'access_token', 'refresh_token',
          'user_id', 'id', 'session', 'user', 'profile', 'metadata',
          'user_metadata', 'app_metadata', 'api_key', 'secret'
        ];
        
        sensitiveFields.forEach(field => {
          if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
          }
        });
        
        return sanitized;
      }
      
      // Se for string e contiver dados sensíveis, redactar
      if (typeof data === 'string') {
        if (data.includes('@') || data.includes('token') || data.includes('key')) {
          return '[REDACTED]';
        }
      }
    }
    
    return data;
  }

  private log(level: LogLevel, message: string, data?: any, sensitive = false) {
    // Em produção, não logar dados sensíveis
    if (this.isProduction && sensitive) {
      return;
    }

    const sanitizedData = this.sanitizeData(data);
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    // Registrar métrica de monitoramento
    logMonitor.logMetric(level, message, 'logger', {
      hasData: !!data,
      sensitive,
      timestamp: Date.now()
    });

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(prefix, message, sanitizedData);
        }
        break;
      case 'info':
        console.info(prefix, message, sanitizedData);
        break;
      case 'warn':
        break;
      case 'error':
        console.error(prefix, message, sanitizedData);
        break;
    }
  }

  debug(message: string, data?: any, sensitive = false) {
    this.log('debug', message, data, sensitive);
  }

  info(message: string, data?: any, sensitive = false) {
    this.log('info', message, data, sensitive);
  }

  warn(message: string, data?: any, sensitive = false) {
    this.log('warn', message, data, sensitive);
  }

  error(message: string, data?: any, sensitive = false) {
    this.log('error', message, data, sensitive);
  }

  // Métodos específicos para diferentes contextos
  auth(message: string, data?: any) {
    // Em desenvolvimento, não aplicar rate limiting para facilitar debug
    if (this.isDevelopment) {
      this.log('info', `🔐 AUTH: ${message}`, data, false); // Não marcar como sensível em dev
      return;
    }
    
    // Aplicar rate limiting para logs de autenticação apenas em produção
    const identifier = 'auth_logs';
    if (!authLogRateLimiter.canLog(identifier)) {
      return; // Não logar se excedeu o rate limit
    }
    
    this.log('info', `🔐 AUTH: ${message}`, data, true); // Marcar como sensível
  }

  api(message: string, data?: any) {
    this.log('info', `🌐 API: ${message}`, data);
  }

  db(message: string, data?: any) {
    this.log('debug', `🗄️ DB: ${message}`, data);
  }

  security(message: string, data?: any) {
    this.log('warn', `🛡️ SECURITY: ${message}`, data, true); // Marcar como sensível
  }
}

// Exportar instância singleton
export const logger = new SecureLogger();

// Exportar também como default para compatibilidade
export default logger;
