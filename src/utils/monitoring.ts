/**
 * Sistema de monitoramento de logs para produção
 * Coleta métricas e envia para serviços de monitoramento
 */

interface LogMetrics {
  timestamp: number;
  level: string;
  message: string;
  context?: string;
  userId?: string;
  sessionId?: string;
  errorCode?: string;
  duration?: number;
}

interface PerformanceMetrics {
  timestamp: number;
  operation: string;
  duration: number;
  success: boolean;
  errorMessage?: string;
}

class LogMonitor {
  private metrics: LogMetrics[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000; // Limite de métricas em memória
  private readonly flushInterval = 30000; // Flush a cada 30 segundos

  constructor() {
    // Flush periódico das métricas
    setInterval(() => {
      this.flushMetrics();
    }, this.flushInterval);
  }

  // Registrar métrica de log
  logMetric(level: string, message: string, context?: string, additionalData?: any) {
    const metric: LogMetrics = {
      timestamp: Date.now(),
      level,
      message,
      context,
      ...additionalData
    };

    this.metrics.push(metric);

    // Manter apenas as últimas métricas
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Em produção, enviar métricas críticas imediatamente
    if (level === 'error' && import.meta.env.PROD) {
      this.sendCriticalMetric(metric);
    }
  }

  // Registrar métrica de performance
  performanceMetric(operation: string, duration: number, success: boolean, errorMessage?: string) {
    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      operation,
      duration,
      success,
      errorMessage
    };

    this.performanceMetrics.push(metric);

    // Manter apenas as últimas métricas
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }
  }

  // Enviar métrica crítica imediatamente
  private async sendCriticalMetric(metric: LogMetrics) {
    try {
      // Em produção, enviar para serviço de monitoramento
      if (import.meta.env.PROD) {
        // Aqui você pode integrar com serviços como:
        // - Sentry
        // - LogRocket
        // - DataDog
        // - New Relic
        
        // Exemplo de integração com Sentry (descomente se usar)
        // Sentry.captureException(new Error(metric.message), {
        //   tags: {
        //     level: metric.level,
        //     context: metric.context
        //   },
        //   extra: metric
        // });

        console.error('CRITICAL METRIC:', metric);
      }
    } catch (error) {
      console.error('Failed to send critical metric:', error);
    }
  }

  // Flush das métricas
  private async flushMetrics() {
    if (this.metrics.length === 0 && this.performanceMetrics.length === 0) {
      return;
    }

    try {
      // Em produção, enviar métricas para serviço de monitoramento
      if (import.meta.env.PROD) {
        const payload = {
          logs: this.metrics,
          performance: this.performanceMetrics,
          timestamp: Date.now(),
          environment: 'production'
        };

        // Aqui você pode enviar para seu serviço de monitoramento
        // await fetch('/api/metrics', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });

        console.log('Metrics flushed:', {
          logCount: this.metrics.length,
          performanceCount: this.performanceMetrics.length
        });
      }

      // Limpar métricas após flush
      this.metrics = [];
      this.performanceMetrics = [];
    } catch (error) {
      console.error('Failed to flush metrics:', error);
    }
  }

  // Obter estatísticas
  getStats() {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);

    const recentLogs = this.metrics.filter(m => m.timestamp > lastHour);
    const recentPerformance = this.performanceMetrics.filter(m => m.timestamp > lastHour);

    const errorCount = recentLogs.filter(m => m.level === 'error').length;
    const warningCount = recentLogs.filter(m => m.level === 'warn').length;
    const avgPerformance = recentPerformance.length > 0 
      ? recentPerformance.reduce((sum, m) => sum + m.duration, 0) / recentPerformance.length 
      : 0;

    return {
      totalLogs: recentLogs.length,
      errorCount,
      warningCount,
      avgPerformance,
      totalPerformanceMetrics: recentPerformance.length
    };
  }
}

// Instância singleton
export const logMonitor = new LogMonitor();

// Função para medir performance
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = Date.now();
  let success = true;
  let errorMessage: string | undefined;

  try {
    const result = await fn();
    return result;
  } catch (error) {
    success = false;
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  } finally {
    const duration = Date.now() - start;
    logMonitor.performanceMetric(operation, duration, success, errorMessage);
  }
};

// Função para medir performance síncrona
export const measurePerformanceSync = <T>(
  operation: string,
  fn: () => T
): T => {
  const start = Date.now();
  let success = true;
  let errorMessage: string | undefined;

  try {
    const result = fn();
    return result;
  } catch (error) {
    success = false;
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  } finally {
    const duration = Date.now() - start;
    logMonitor.performanceMetric(operation, duration, success, errorMessage);
  }
};
