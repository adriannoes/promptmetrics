interface ErrorReport {
  domain?: string;
  error_type: string;
  error_message: string;
  error_stack?: string;
  user_agent: string;
  timestamp: string;
  page_url: string;
  additional_info?: Record<string, any>;
}

const PIPEFY_WEBHOOK_URL = 'https://ipaas.pipefy.com/api/v1/webhooks/M9MMr5ClE4WJorSyUgaBD/sync';

export class ErrorReportingService {
  private static async reportError(errorData: ErrorReport): Promise<boolean> {
    try {
      console.log('📢 Reporting error to Pipefy:', errorData);
      
      const response = await fetch(PIPEFY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Error Report - ${errorData.error_type}`,
          description: errorData.error_message,
          fields: {
            domain: errorData.domain || 'N/A',
            error_type: errorData.error_type,
            error_message: errorData.error_message,
            error_stack: errorData.error_stack || 'N/A',
            user_agent: errorData.user_agent,
            timestamp: errorData.timestamp,
            page_url: errorData.page_url,
            additional_info: JSON.stringify(errorData.additional_info || {})
          }
        })
      });

      if (!response.ok) {
        console.error('❌ Failed to report error to Pipefy:', response.status, response.statusText);
        return false;
      }

      console.log('✅ Error reported successfully to Pipefy');
      return true;
    } catch (error) {
      console.error('💥 Error reporting to Pipefy:', error);
      return false;
    }
  }

  static async reportAnalysisError(domain: string, error: Error | string, additionalInfo?: Record<string, any>): Promise<boolean> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    return this.reportError({
      domain,
      error_type: 'Analysis Error',
      error_message: errorMessage,
      error_stack: errorStack,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      additional_info: additionalInfo
    });
  }

  static async reportLoadingError(domain: string, error: Error | string, additionalInfo?: Record<string, any>): Promise<boolean> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    return this.reportError({
      domain,
      error_type: 'Loading Error',
      error_message: errorMessage,
      error_stack: errorStack,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      additional_info: additionalInfo
    });
  }

  static async reportGenericError(error: Error | string, additionalInfo?: Record<string, any>): Promise<boolean> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    return this.reportError({
      error_type: 'Generic Error',
      error_message: errorMessage,
      error_stack: errorStack,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      additional_info: additionalInfo
    });
  }
} 