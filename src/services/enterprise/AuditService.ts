import { Result, Repository, DomainEvent, EventBus } from '@/types/enterprise';
import { AuditLog } from '@/types/auth';

/**
 * Enterprise Audit Service using Repository and Event patterns
 */
export class AuditService {
  constructor(
    private auditRepository: Repository<AuditLog>,
    private eventBus: EventBus
  ) {}

  /**
   * Log user action with enterprise patterns
   */
  async logAction(params: {
    userId: string;
    action: string;
    resource: string;
    metadata?: Record<string, unknown>;
  }): Promise<Result<void>> {
    try {
      const auditLog: Omit<AuditLog, 'id'> = {
        user_id: params.userId,
        action: params.action,
        table_name: params.resource,
        record_id: null,
        old_values: null,
        new_values: params.metadata || null,
        ip_address: null,
        user_agent: null,
        created_at: new Date().toISOString(),
      };

      const result = await this.auditRepository.create(auditLog);
      
      if (!result.success) {
        return result;
      }

      // Publish domain event
      await this.eventBus.publish({
        type: 'AuditLogCreated',
        payload: { auditLog: result.data },
        timestamp: new Date(),
        aggregateId: result.data.id,
      });

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }): Promise<Result<AuditLog[]>> {
    try {
      // In a real implementation, this would use the repository with filters
      const result = await this.auditRepository.findAll();
      
      if (!result.success) {
        return result;
      }

      let logs = result.data;

      // Apply filters
      if (filters.userId) {
        logs = logs.filter(log => log.user_id === filters.userId);
      }

      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }

      // Apply pagination
      if (filters.limit) {
        const offset = filters.offset || 0;
        logs = logs.slice(offset, offset + filters.limit);
      }

      return { success: true, data: logs };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }
}

/**
 * Audit Event Handlers
 */
export class AuditEventHandler {
  constructor(private auditService: AuditService) {}

  async handleUserLogin(event: DomainEvent): Promise<void> {
    if (event.type === 'UserLogin') {
      await this.auditService.logAction({
        userId: event.aggregateId,
        action: 'user_login_success',
        resource: 'auth',
        metadata: { timestamp: event.timestamp },
      });
    }
  }

  async handleUserLogout(event: DomainEvent): Promise<void> {
    if (event.type === 'UserLogout') {
      await this.auditService.logAction({
        userId: event.aggregateId,
        action: 'user_logout',
        resource: 'auth',
        metadata: { timestamp: event.timestamp },
      });
    }
  }
}
