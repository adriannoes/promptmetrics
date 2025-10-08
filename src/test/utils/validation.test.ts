import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validateBrazilianPhone, 
  formatBrazilianPhone, 
  validateName 
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateBrazilianPhone', () => {
    it('should validate correct Brazilian phone numbers', () => {
      expect(validateBrazilianPhone('(11) 99999-9999')).toBe(true);
      expect(validateBrazilianPhone('11999999999')).toBe(true);
      expect(validateBrazilianPhone('(11) 9999-9999')).toBe(true);
      expect(validateBrazilianPhone('1199999999')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validateBrazilianPhone('123')).toBe(false);
      expect(validateBrazilianPhone('123456789012')).toBe(false);
      expect(validateBrazilianPhone('')).toBe(false);
    });
  });

  describe('formatBrazilianPhone', () => {
    it('should format 10-digit numbers correctly', () => {
      expect(formatBrazilianPhone('1199999999')).toBe('(11) 9999-9999');
    });

    it('should format 11-digit numbers correctly', () => {
      expect(formatBrazilianPhone('11999999999')).toBe('(11) 99999-9999');
    });
  });

  describe('validateName', () => {
    it('should validate names with at least 2 characters', () => {
      expect(validateName('João')).toBe(true);
      expect(validateName('Maria Silva')).toBe(true);
      expect(validateName('A')).toBe(false);
      expect(validateName('')).toBe(false);
    });
  });
});
