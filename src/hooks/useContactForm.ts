
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { supabase } from '../integrations/supabase/client';
import { validateField, sanitizeInput, ValidationError } from '../utils/ContactFormValidator';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export const useContactForm = () => {
  const { t } = useLanguage();
  const { announceToScreenReader } = useAccessibility();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const [submitError, setSubmitError] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const validateSingleField = (name: string, value: string) => {
    const newErrors = validateField(name, value, errors, t);
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limit input length
    const maxLengths = { name: 100, email: 254, phone: 50 };
    const maxLength = maxLengths[name as keyof typeof maxLengths];
    const trimmedValue = value.slice(0, maxLength);
    
    setFormData(prev => ({
      ...prev,
      [name]: trimmedValue
    }));
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
    
    // Validate field on change
    validateSingleField(name, trimmedValue);
  };

  const handlePhoneChange = (value: string) => {
    const trimmedValue = value.slice(0, 50); // Limit phone input length
    
    setFormData(prev => ({
      ...prev,
      phone: trimmedValue
    }));
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
    
    // Validate phone field on change
    validateSingleField('phone', trimmedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Rate limiting - prevent rapid submissions
    const now = Date.now();
    if (now - lastSubmitTime < 5000) { // 5 second cooldown
      setSubmitError('Please wait before submitting again');
      return;
    }
    
    // Validate all fields
    let newErrors: ValidationError = {};
    Object.keys(formData).forEach(key => {
      newErrors = validateField(key, formData[key as keyof typeof formData], newErrors, t);
    });
    setErrors(newErrors);
    
    // Check if there are any validation errors
    if (Object.keys(newErrors).length > 0) {
      announceToScreenReader('Please fix the form errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    setLastSubmitTime(now);
    announceToScreenReader('Submitting form...');

    try {
      // Sanitize all form data before submission
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone)
      };

      const { data, error } = await supabase.functions.invoke('submit-waitlist', {
        body: sanitizedData
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
      announceToScreenReader('Form submitted successfully! Welcome to the waitlist.');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // Handle different types of errors
      let errorMessage = t('form.error.submit');
      
      if (error?.message && typeof error.message === 'string') {
        if (error.message.includes('Waitlist service temporarily unavailable')) {
          errorMessage = 'Waitlist service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
      
      setSubmitError(errorMessage);
      announceToScreenReader('Form submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    submitted,
    errors,
    submitError,
    handleChange,
    handlePhoneChange,
    handleSubmit
  };
};
