/**
 * Centralized timeout configuration
 * Provides consistent timeout values across the application
 */

export const TIMEOUTS = {
  // Database operations
  DATABASE_QUERY: 10000, // 10 seconds
  DATABASE_CONNECTION: 5000, // 5 seconds
  
  // Edge functions
  EDGE_FUNCTION_DEFAULT: 30000, // 30 seconds
  EDGE_FUNCTION_ANALYSIS: 60000, // 60 seconds for long-running analysis
  EDGE_FUNCTION_RANKLLM: 90000, // 90 seconds for RankLLM operations
  
  // API calls
  API_REQUEST: 15000, // 15 seconds
  API_FETCH: 20000, // 20 seconds
  
  // Auth operations
  AUTH_OPERATION: 10000, // 10 seconds
  PROFILE_FETCH: 5000, // 5 seconds
  
  // Real-time subscriptions
  SUBSCRIPTION_SETUP: 5000, // 5 seconds
  SUBSCRIPTION_TIMEOUT: 30000, // 30 seconds
  
  // General operations
  DEFAULT: 10000, // 10 seconds
  SHORT: 3000, // 3 seconds
  LONG: 60000, // 60 seconds
} as const;

/**
 * Creates a timeout promise that rejects after the specified duration
 */
export const createTimeout = (ms: number, message = 'Operation timed out'): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
};

/**
 * Wraps a promise with a timeout
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  message?: string
): Promise<T> => {
  return Promise.race([
    promise,
    createTimeout(ms, message)
  ]);
};

/**
 * Creates an AbortController with a timeout
 */
export const createTimeoutController = (ms: number): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller;
};
