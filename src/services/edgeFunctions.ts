/**
 * Centralized service for Supabase Edge Functions
 * Provides consistent error handling and timeout management
 */

import { supabase } from '@/integrations/supabase/client';
import { TIMEOUTS, withTimeout } from '@/config/timeouts';
import { handleError, ERROR_CODES, ErrorContext } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

export interface EdgeFunctionOptions {
  body?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface EdgeFunctionResponse<T = any> {
  data: T | null;
  error: Error | null;
}

/**
 * Invokes a Supabase Edge Function with proper error handling and timeout
 */
export const invokeEdgeFunction = async <T = any>(
  functionName: string,
  options: EdgeFunctionOptions = {}
): Promise<EdgeFunctionResponse<T>> => {
  const { body, headers, timeout = TIMEOUTS.EDGE_FUNCTION_DEFAULT } = options;
  
  const context: ErrorContext = {
    operation: `edge_function:${functionName}`,
    context: {
      functionName,
      hasBody: !!body,
    },
  };

  try {
    logger.api(`Invoking edge function: ${functionName}`, {
      hasBody: !!body,
      timeout,
    });

    // Create the invocation promise
    const invocationPromise = supabase.functions.invoke(functionName, {
      body,
      headers,
    });

    // Apply timeout
    const result = await withTimeout(
      invocationPromise,
      timeout,
      `Edge function ${functionName} timed out after ${timeout}ms`
    );

    // Check for Supabase function errors
    if (result.error) {
      const error = handleError(result.error, context);
      logger.error(`Edge function error: ${functionName}`, {
        error: result.error,
        code: error.code,
      });
      
      return {
        data: null,
        error,
      };
    }

    logger.api(`Edge function completed: ${functionName}`, {
      hasData: !!result.data,
    });

    return {
      data: result.data as T,
      error: null,
    };
  } catch (error) {
    const appError = handleError(error, context);
    
    // Check if it's a timeout error
    if (appError.code === ERROR_CODES.TIMEOUT_ERROR) {
      logger.error(`Edge function timeout: ${functionName}`, {
        timeout,
        error: appError.message,
      });
    } else {
      logger.error(`Edge function invocation failed: ${functionName}`, {
        error: appError.message,
        code: appError.code,
      });
    }

    return {
      data: null,
      error: appError,
    };
  }
};

/**
 * Invokes an analysis edge function with extended timeout
 */
export const invokeAnalysisFunction = async <T = any>(
  functionName: string,
  options: Omit<EdgeFunctionOptions, 'timeout'> = {}
): Promise<EdgeFunctionResponse<T>> => {
  return invokeEdgeFunction<T>(functionName, {
    ...options,
    timeout: TIMEOUTS.EDGE_FUNCTION_ANALYSIS,
  });
};

/**
 * Invokes a RankLLM edge function with extended timeout
 */
export const invokeRankLLMFunction = async <T = any>(
  functionName: string,
  options: Omit<EdgeFunctionOptions, 'timeout'> = {}
): Promise<EdgeFunctionResponse<T>> => {
  return invokeEdgeFunction<T>(functionName, {
    ...options,
    timeout: TIMEOUTS.EDGE_FUNCTION_RANKLLM,
  });
};

/**
 * Common edge function names
 */
export const EDGE_FUNCTIONS = {
  TRIGGER_ANALYSIS: 'trigger-analysis',
  GET_ANALYSIS_DATA: 'get-analysis-data',
  TRIGGER_RANKLLM_ANALYSIS: 'trigger-rankllm-analysis',
  GET_RANKLLM_DATA: 'get-rankllm-data',
  SUBMIT_WAITLIST: 'submit-waitlist',
} as const;
