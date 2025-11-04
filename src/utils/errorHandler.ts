/**
 * Centralized error handling utilities
 * Provides consistent error handling across the application
 */

import { logger } from './logger';

export interface ErrorContext {
  operation?: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Common error codes
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Auth errors
  AUTH_ERROR: 'AUTH_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  QUERY_ERROR: 'QUERY_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  
  // Edge function errors
  EDGE_FUNCTION_ERROR: 'EDGE_FUNCTION_ERROR',
  EDGE_FUNCTION_TIMEOUT: 'EDGE_FUNCTION_TIMEOUT',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

/**
 * Handles errors consistently across the application
 */
export const handleError = (
  error: unknown,
  context?: ErrorContext
): AppError => {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string };
    
    // Map Supabase error codes to our error codes
    if (supabaseError.code === 'PGRST116') {
      return new AppError(
        'Resource not found',
        ERROR_CODES.NOT_FOUND,
        404,
        context
      );
    }
    
    if (supabaseError.code === 'PGRST301' || supabaseError.code === '23505') {
      return new AppError(
        'Duplicate entry',
        ERROR_CODES.VALIDATION_ERROR,
        409,
        context
      );
    }
  }

  // Handle timeout errors
  if (error instanceof Error && error.message.includes('timeout')) {
    return new AppError(
      error.message || 'Operation timed out',
      ERROR_CODES.TIMEOUT_ERROR,
      408,
      context
    );
  }

  // Handle network errors
  if (error instanceof Error && (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch')
  )) {
    return new AppError(
      'Network error occurred',
      ERROR_CODES.NETWORK_ERROR,
      503,
      context
    );
  }

  // Default error handling
  const message = error instanceof Error 
    ? error.message 
    : 'An unknown error occurred';
  
  const appError = new AppError(
    message,
    ERROR_CODES.UNKNOWN_ERROR,
    500,
    {
      ...context,
      timestamp: new Date().toISOString(),
    }
  );

  // Log the error
  logger.error(`Error in ${context?.operation || 'unknown operation'}`, {
    error: appError.message,
    code: appError.code,
    context: appError.context,
  });

  return appError;
};

/**
 * Formats error for user display
 */
export const formatErrorForUser = (error: unknown): string => {
  const appError = handleError(error);
  
  // User-friendly error messages
  const userMessages: Record<string, string> = {
    [ERROR_CODES.NETWORK_ERROR]: 'Unable to connect. Please check your internet connection.',
    [ERROR_CODES.TIMEOUT_ERROR]: 'The operation took too long. Please try again.',
    [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
    [ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
    [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
    [ERROR_CODES.VALIDATION_ERROR]: 'Invalid input. Please check your data and try again.',
    [ERROR_CODES.EDGE_FUNCTION_ERROR]: 'Service temporarily unavailable. Please try again later.',
    [ERROR_CODES.EDGE_FUNCTION_TIMEOUT]: 'The operation is taking longer than expected. Please try again.',
  };

  return userMessages[appError.code] || appError.message || 'An error occurred. Please try again.';
};

/**
 * Checks if an error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  const appError = handleError(error);
  
  const retryableCodes = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.CONNECTION_ERROR,
    ERROR_CODES.EDGE_FUNCTION_TIMEOUT,
  ];

  return retryableCodes.includes(appError.code as any);
};
