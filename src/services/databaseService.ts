/**
 * Centralized service for database operations
 * Provides consistent error handling and timeout management
 */

import { supabase } from '@/integrations/supabase/client';
import { TIMEOUTS, withTimeout } from '@/config/timeouts';
import { handleError, ERROR_CODES, ErrorContext } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import type { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/supabase-js';

export interface DatabaseQueryOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface DatabaseResponse<T = any> {
  data: T | null;
  error: Error | null;
}

/**
 * Executes a database query with proper error handling and timeout
 */
const executeQuery = async <T = any>(
  queryPromise: Promise<{ data: T | null; error: any }>,
  context: ErrorContext,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T>> => {
  const { timeout = TIMEOUTS.DATABASE_QUERY, retries = 0, retryDelay = 1000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        logger.db(`Retrying database query (attempt ${attempt + 1}/${retries + 1})`, {
          operation: context.operation,
        });
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }

      // Apply timeout to the query
      const result = await withTimeout(
        queryPromise,
        timeout,
        `Database query timed out after ${timeout}ms`
      );

      // Check for Supabase errors
      if (result.error) {
        const error = handleError(result.error, {
          ...context,
          context: {
            ...context.context,
            attempt: attempt + 1,
            supabaseErrorCode: result.error.code,
          },
        });

        // Don't retry on certain error codes
        const nonRetryableCodes = ['PGRST116', '23505', '23503'];
        if (nonRetryableCodes.includes(result.error.code)) {
          logger.db(`Non-retryable error: ${result.error.code}`, {
            operation: context.operation,
          });
          return {
            data: null,
            error,
          };
        }

        lastError = error;
        continue; // Retry
      }

      logger.db(`Database query successful`, {
        operation: context.operation,
        hasData: !!result.data,
      });

      return {
        data: result.data,
        error: null,
      };
    } catch (error) {
      const appError = handleError(error, {
        ...context,
        context: {
          ...context.context,
          attempt: attempt + 1,
        },
      });

      // Check if it's a timeout error - don't retry these
      if (appError.code === ERROR_CODES.TIMEOUT_ERROR) {
        logger.error(`Database query timeout`, {
          operation: context.operation,
          timeout,
        });
        return {
          data: null,
          error: appError,
        };
      }

      lastError = appError;
      continue; // Retry
    }
  }

  // All retries exhausted
  logger.error(`Database query failed after ${retries + 1} attempts`, {
    operation: context.operation,
    error: lastError?.message,
  });

  return {
    data: null,
    error: lastError || new Error('Database query failed'),
  };
};

/**
 * Generic database query executor
 */
export const queryDatabase = async <T = any>(
  table: string,
  queryBuilder: (builder: PostgrestQueryBuilder<any, any>) => PostgrestFilterBuilder<any, any, any>,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T[]>> => {
  const context: ErrorContext = {
    operation: `database:query:${table}`,
    context: { table },
  };

  try {
    const query = queryBuilder(supabase.from(table));
    const queryPromise = query as Promise<{ data: T[] | null; error: any }>;
    
    return executeQuery<T[]>(queryPromise, context, options);
  } catch (error) {
    const appError = handleError(error, context);
    return {
      data: null,
      error: appError,
    };
  }
};

/**
 * Fetch a single record by ID
 */
export const fetchById = async <T = any>(
  table: string,
  id: string,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T>> => {
  const context: ErrorContext = {
    operation: `database:fetchById:${table}`,
    context: { table, id },
  };

  try {
    const queryPromise = supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .maybeSingle() as Promise<{ data: T | null; error: any }>;

    return executeQuery<T>(queryPromise, context, options);
  } catch (error) {
    const appError = handleError(error, context);
    return {
      data: null,
      error: appError,
    };
  }
};

/**
 * Fetch records with filters
 */
export const fetchWithFilters = async <T = any>(
  table: string,
  filters: Record<string, any>,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T[]>> => {
  const context: ErrorContext = {
    operation: `database:fetchWithFilters:${table}`,
    context: { table, filters },
  };

  try {
    let query = supabase.from(table).select('*');

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const queryPromise = query as Promise<{ data: T[] | null; error: any }>;
    return executeQuery<T[]>(queryPromise, context, options);
  } catch (error) {
    const appError = handleError(error, context);
    return {
      data: null,
      error: appError,
    };
  }
};

/**
 * Insert a record
 */
export const insertRecord = async <T = any>(
  table: string,
  data: Partial<T>,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T>> => {
  const context: ErrorContext = {
    operation: `database:insert:${table}`,
    context: { table },
  };

  try {
    const queryPromise = supabase
      .from(table)
      .insert(data)
      .select()
      .single() as Promise<{ data: T | null; error: any }>;

    return executeQuery<T>(queryPromise, context, options);
  } catch (error) {
    const appError = handleError(error, context);
    return {
      data: null,
      error: appError,
    };
  }
};

/**
 * Update a record by ID
 */
export const updateRecord = async <T = any>(
  table: string,
  id: string,
  data: Partial<T>,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T>> => {
  const context: ErrorContext = {
    operation: `database:update:${table}`,
    context: { table, id },
  };

  try {
    const queryPromise = supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single() as Promise<{ data: T | null; error: any }>;

    return executeQuery<T>(queryPromise, context, options);
  } catch (error) {
    const appError = handleError(error, context);
    return {
      data: null,
      error: appError,
    };
  }
};

/**
 * Delete a record by ID
 */
export const deleteRecord = async <T = any>(
  table: string,
  id: string,
  options: DatabaseQueryOptions = {}
): Promise<DatabaseResponse<T>> => {
  const context: ErrorContext = {
    operation: `database:delete:${table}`,
    context: { table, id },
  };

  try {
    const queryPromise = supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single() as Promise<{ data: T | null; error: any }>;

    return executeQuery<T>(queryPromise, context, options);
  } catch (error) {
    const appError = handleError(error, context);
    return {
      data: null,
      error: appError,
    };
  }
};
