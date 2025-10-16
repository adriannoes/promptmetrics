import { describe, it, expect } from 'vitest';
import { 
  sanitizeHtml, 
  sanitizeText, 
  isValidEmail, 
  RateLimiter, 
  validateLength 
} from '@/utils/security';

describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    it('should remove dangerous HTML tags', () => {
      const maliciousHtml = '<script>alert("xss")</script><p>Safe content</p>';
      const sanitized = sanitizeHtml(maliciousHtml);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Safe content');
    });

    it('should preserve safe HTML tags', () => {
      const safeHtml = '<p><strong>Bold text</strong> and <em>italic</em></p>';
      const sanitized = sanitizeHtml(safeHtml);
      expect(sanitized).toContain('<strong>');
      expect(sanitized).toContain('<em>');
    });
  });

  describe('sanitizeText', () => {
    it('should remove all HTML tags', () => {
      const htmlText = '<p>Text with <strong>HTML</strong> tags</p>';
      const sanitized = sanitizeText(htmlText);
      expect(sanitized).toBe('Text with HTML tags');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should enforce length limit', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('RateLimiter', () => {
    it('should allow submissions within rate limit', () => {
      const key = 'test-key';
      expect(RateLimiter.canSubmit(key, 1000)).toBe(true);
    });

    it('should block submissions exceeding rate limit', () => {
      const key = 'test-key-2';
      RateLimiter.canSubmit(key, 1000);
      expect(RateLimiter.canSubmit(key, 1000)).toBe(false);
    });

    it('should calculate remaining time correctly', () => {
      const key = 'test-key-3';
      RateLimiter.canSubmit(key, 5000);
      const remaining = RateLimiter.getRemainingTime(key, 5000);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(5000);
    });
  });

  describe('validateLength', () => {
    it('should validate input length', () => {
      expect(validateLength('short', 10)).toBe(true);
      expect(validateLength('very long text', 10)).toBe(false);
    });
  });
});
