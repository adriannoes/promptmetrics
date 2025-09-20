/**
 * Rate Limiter para logs de autenticação
 * Previne spam de logs em caso de ataques ou erros repetitivos
 */

interface RateLimitEntry {
  count: number;
  lastReset: number;
  blocked: boolean;
}

class AuthLogRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts = 10; // Máximo de tentativas por janela
  private readonly windowMs = 60000; // Janela de 1 minuto
  private readonly blockDurationMs = 300000; // Bloqueio por 5 minutos

  private getKey(identifier: string): string {
    return `auth_log_${identifier}`;
  }

  private isWindowExpired(entry: RateLimitEntry): boolean {
    return Date.now() - entry.lastReset > this.windowMs;
  }

  private isBlockExpired(entry: RateLimitEntry): boolean {
    return Date.now() - entry.lastReset > this.blockDurationMs;
  }

  canLog(identifier: string): boolean {
    const key = this.getKey(identifier);
    const now = Date.now();
    
    let entry = this.limits.get(key);
    
    if (!entry) {
      entry = {
        count: 0,
        lastReset: now,
        blocked: false
      };
      this.limits.set(key, entry);
    }

    // Reset se a janela expirou
    if (this.isWindowExpired(entry)) {
      entry.count = 0;
      entry.lastReset = now;
      entry.blocked = false;
    }

    // Verificar se está bloqueado
    if (entry.blocked) {
      if (this.isBlockExpired(entry)) {
        // Desbloquear após o tempo de bloqueio
        entry.blocked = false;
        entry.count = 0;
        entry.lastReset = now;
      } else {
        return false; // Ainda bloqueado
      }
    }

    // Incrementar contador
    entry.count++;

    // Bloquear se excedeu o limite
    if (entry.count > this.maxAttempts) {
      entry.blocked = true;
      entry.lastReset = now;
      return false;
    }

    return true;
  }

  getStatus(identifier: string): { canLog: boolean; remainingAttempts: number; blocked: boolean } {
    const key = this.getKey(identifier);
    const entry = this.limits.get(key);
    
    if (!entry) {
      return { canLog: true, remainingAttempts: this.maxAttempts, blocked: false };
    }

    const canLog = this.canLog(identifier);
    const remainingAttempts = Math.max(0, this.maxAttempts - entry.count);
    
    return {
      canLog,
      remainingAttempts,
      blocked: entry.blocked
    };
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    this.limits.delete(key);
  }

  // Limpeza periódica de entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now - entry.lastReset > this.blockDurationMs * 2) {
        this.limits.delete(key);
      }
    }
  }
}

// Instância singleton
export const authLogRateLimiter = new AuthLogRateLimiter();

// Limpeza automática a cada 10 minutos
setInterval(() => {
  authLogRateLimiter.cleanup();
}, 10 * 60 * 1000);
