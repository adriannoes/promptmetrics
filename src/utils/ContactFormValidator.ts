
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
  
  // Extract country code and number
  const dialCodes = ['+55', '+1', '+44', '+49', '+33'];
  const country = dialCodes.find(code => phoneValue.startsWith(code));
  
  if (!country) return false;
  
  const numberPart = phoneValue.replace(country + ' ', '');
  
  // Basic validation patterns for each country
  const patterns = {
    '+55': /^\d{2}\s\d{5}-\d{4}$/, // Brazil
    '+1': /^\(\d{3}\)\s\d{3}-\d{4}$/, // US/Canada
    '+44': /^\d{2}\s\d{4}\s\d{4}$/, // UK
    '+49': /^\d{2}\s\d{8}$/, // Germany
    '+33': /^\d\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/ // France
  };
  
  const pattern = patterns[country as keyof typeof patterns];
  return pattern ? pattern.test(numberPart) : false;
};

export const validateField = (name: string, value: string, errors: ValidationError, t: (key: string) => string): ValidationError => {
  const newErrors = { ...errors };
  
  switch (name) {
    case 'name':
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
    case 'email':
      const sanitizedEmail = sanitizeInput(value);
      if (!sanitizedEmail) {
        newErrors.email = t('form.error.email.required');
      } else if (!isValidEmail(sanitizedEmail)) {
        newErrors.email = t('form.error.email.invalid');
      } else {
        delete newErrors.email;
      }
      break;
    case 'phone':
      if (!value.trim()) {
        newErrors.phone = t('form.error.phone.required');
      } else if (!validatePhoneNumber(value)) {
        newErrors.phone = t('form.error.phone.invalid');
      } else {
        delete newErrors.phone;
      }
      break;
  }
  
  return newErrors;
};
