
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string, options?: DOMPurify.Config): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['em', 'strong', 'br', 'span', 'i', 'b', 'p', 'ul', 'li', 'ol'],
    ALLOWED_ATTR: ['class'],
    ...options
  }) as string;
};

/**
 * Sanitizes plain text input by removing all HTML tags
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as string;
};

/**
 * Validates email format with comprehensive regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Rate limiter for form submissions
 */
export class RateLimiter {
  private static instances: Map<string, number> = new Map();
  
  static canSubmit(key: string, cooldownMs: number = 5000): boolean {
    const now = Date.now();
    const lastSubmit = this.instances.get(key) || 0;
    
    if (now - lastSubmit >= cooldownMs) {
      this.instances.set(key, now);
      return true;
    }
    
    return false;
  }
  
  static getRemainingTime(key: string, cooldownMs: number = 5000): number {
    const now = Date.now();
    const lastSubmit = this.instances.get(key) || 0;
    const remaining = cooldownMs - (now - lastSubmit);
    return Math.max(0, remaining);
  }
}

/**
 * Input length validators
 */
export const InputLimits = {
  NAME: 100,
  EMAIL: 254,
  PHONE: 50,
  MESSAGE: 1000,
  TITLE: 200
} as const;

/**
 * Validates input length
 */
export const validateLength = (input: string, limit: number): boolean => {
  return input.length <= limit;
};

/**
 * Escapes HTML entities for safe display
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
