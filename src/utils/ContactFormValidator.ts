
import DOMPurify from 'dompurify';

export interface ValidationError {
  [key: string]: string;
}

// Enhanced email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Sanitize input to prevent injection attacks
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export const validatePhoneNumber = (phoneValue: string): boolean => {
  if (!phoneValue.trim()) return false;
  
  // Much more relaxed validation - just check for basic phone format
  const cleanPhone = phoneValue.replace(/[^\d+\-\s()]/g, '');
  
  // Must have at least 8 digits and no more than 20 characters total
  const digitCount = cleanPhone.replace(/\D/g, '').length;
  return digitCount >= 8 && digitCount <= 15 && cleanPhone.length <= 20;
};

export const validateField = (name: string, value: string, errors: ValidationError, t: (key: string) => string): ValidationError => {
  const newErrors = { ...errors };
  
  switch (name) {
    case 'name': {
      const sanitizedName = sanitizeInput(value);
      if (!sanitizedName) {
        newErrors.name = t('form.error.name.required');
      } else if (sanitizedName.length < 2) {
        newErrors.name = t('form.error.name.min');
      } else if (sanitizedName.length > 100) {
        newErrors.name = 'Name must be less than 100 characters';
      } else {
        delete newErrors.name;
      }
      break;
    }
    case 'email': {
      const sanitizedEmail = sanitizeInput(value);
      if (!sanitizedEmail) {
        newErrors.email = t('form.error.email.required');
      } else if (!isValidEmail(sanitizedEmail)) {
        newErrors.email = t('form.error.email.invalid');
      } else {
        delete newErrors.email;
      }
      break;
    }
    case 'phone': {
      if (!value.trim()) {
        newErrors.phone = t('form.error.phone.required');
      } else if (!validatePhoneNumber(value)) {
        newErrors.phone = t('form.error.phone.invalid');
      } else {
        delete newErrors.phone;
      }
      break;
    }
  }
  
  return newErrors;
};
