import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface AuditEvent {
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  metadata?: any;
}

class AuditService {
  private isProduction = import.meta.env.PROD;

  /**
   * Registra um evento de auditoria
   */
  async logEvent(event: AuditEvent): Promise<void> {
    try {
      // Em desenvolvimento, log também no console
      if (!this.isProduction) {
        logger.info(`AUDIT: ${event.action}`, {
          table: event.table_name,
          recordId: event.record_id,
          metadata: event.metadata
        });
      }

      // Chama a função do banco de dados
      const { error } = await supabase.rpc('log_audit_event', {
        p_action: event.action,
        p_table_name: event.table_name,
        p_record_id: event.record_id,
        p_old_values: event.old_values,
        p_new_values: event.new_values
      });

      if (error) {
        logger.error('Failed to log audit event', error);
        // Não lança erro para não quebrar o fluxo principal
      }
    } catch (error) {
      logger.error('Audit service error', error);
      // Não lança erro para não quebrar o fluxo principal
    }
  }

  /**
   * Registra login de usuário
   */
  async logLogin(email: string, success: boolean, method: 'password' | 'google' | 'demo' = 'password'): Promise<void> {
    await this.logEvent({
      action: success ? 'user_login_success' : 'user_login_failed',
      metadata: {
        email: this.sanitizeEmail(email),
        method,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra logout de usuário
   */
  async logLogout(email?: string): Promise<void> {
    await this.logEvent({
      action: 'user_logout',
      metadata: {
        email: email ? this.sanitizeEmail(email) : null,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra cadastro de usuário
   */
  async logSignup(email: string, success: boolean, method: 'email' | 'google' = 'email'): Promise<void> {
    await this.logEvent({
      action: success ? 'user_signup_success' : 'user_signup_failed',
      metadata: {
        email: this.sanitizeEmail(email),
        method,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra promoção de usuário
   */
  async logUserPromotion(adminEmail: string, targetUserEmail: string, newRole: string, oldRole: string): Promise<void> {
    await this.logEvent({
      action: 'user_role_changed',
      table_name: 'profiles',
      metadata: {
        admin_email: this.sanitizeEmail(adminEmail),
        target_email: this.sanitizeEmail(targetUserEmail),
        old_role: oldRole,
        new_role: newRole,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra criação de convite
   */
  async logInviteCreated(adminEmail: string, inviteCode: string): Promise<void> {
    await this.logEvent({
      action: 'invite_code_created',
      table_name: 'invitation_codes',
      metadata: {
        admin_email: this.sanitizeEmail(adminEmail),
        invite_code: inviteCode.substring(0, 8) + '***', // Máscara parcial
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra uso de convite
   */
  async logInviteUsed(inviteCode: string, userEmail: string): Promise<void> {
    await this.logEvent({
      action: 'invite_code_used',
      table_name: 'invitation_codes',
      metadata: {
        invite_code: inviteCode.substring(0, 8) + '***',
        user_email: this.sanitizeEmail(userEmail),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra análise de domínio
   */
  async logDomainAnalysis(domain: string, userEmail: string, success: boolean): Promise<void> {
    await this.logEvent({
      action: success ? 'domain_analysis_success' : 'domain_analysis_failed',
      table_name: 'analysis_results',
      metadata: {
        domain: this.sanitizeDomain(domain),
        user_email: this.sanitizeEmail(userEmail),
        success,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra acesso à página admin
   */
  async logAdminAccess(email: string): Promise<void> {
    await this.logEvent({
      action: 'admin_panel_accessed',
      metadata: {
        admin_email: this.sanitizeEmail(email),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra tentativa de acesso não autorizado
   */
  async logUnauthorizedAccess(email: string, resource: string): Promise<void> {
    await this.logEvent({
      action: 'unauthorized_access_attempt',
      metadata: {
        user_email: this.sanitizeEmail(email),
        resource,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Registra mudança de senha
   */
  async logPasswordChange(email: string, success: boolean): Promise<void> {
    await this.logEvent({
      action: success ? 'password_change_success' : 'password_change_failed',
      metadata: {
        user_email: this.sanitizeEmail(email),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Sanitiza email para auditoria (mostra apenas primeiros 3 caracteres)
   */
  private sanitizeEmail(email: string): string {
    if (!email || !email.includes('@')) return 'invalid-email';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return `${localPart}***@${domain}`;
    return `${localPart.substring(0, 3)}***@${domain}`;
  }

  /**
   * Sanitiza domínio para auditoria
   */
  private sanitizeDomain(domain: string): string {
    if (!domain) return 'unknown-domain';
    // Remove protocolo se existir
    const cleanDomain = domain.replace(/^https?:\/\//, '');
    // Mantém apenas o domínio principal
    const parts = cleanDomain.split('.');
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[parts.length - 1]}`;
    }
    return cleanDomain;
  }
}

// Exportar instância singleton
export const auditService = new AuditService();

