
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { anonymousSupabase } from '../integrations/supabase/anonymous-client';
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
    
    console.log('Form submission started', { formData });
    
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
    
    console.log('Validation results:', { newErrors, hasErrors: Object.keys(newErrors).length > 0 });
    
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

      console.log('=== STARTING FORM SUBMISSION ===');
      console.log('Submitting sanitized data:', sanitizedData);

      // Direct HTTP call to edge function (avoiding Supabase client issues)
      console.log('=== MAKING DIRECT HTTP CALL ===');
      const directResponse = await fetch('https://racfoelvuhdifnekjsro.supabase.co/functions/v1/submit-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0`,
          'x-my-custom-header': 'rank-me-llm-direct',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2ZvZWx2dWhkaWZuZWtqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTk3NTksImV4cCI6MjA2NjA5NTc1OX0.m1NKUgLKup4mwc7ma5DPX2Rxemskt2_7iXAI1wcwv_0'
        },
        body: JSON.stringify(sanitizedData)
      });

      console.log('=== DIRECT HTTP RESPONSE ===');
      console.log('Response status:', directResponse.status);
      console.log('Response status text:', directResponse.statusText);
      console.log('Response headers:', Object.fromEntries(directResponse.headers.entries()));

      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        console.error('=== HTTP ERROR RESPONSE ===');
        console.error('Error status:', directResponse.status);
        console.error('Error text:', errorText);
        throw new Error(`HTTP error! status: ${directResponse.status} - ${errorText}`);
      }

      const directResult = await directResponse.json();
      console.log('=== SUCCESS RESPONSE ===');
      console.log('Direct HTTP response:', directResult);

      if (directResult.success) {
        console.log('=== FORM SUBMITTED SUCCESSFULLY ===');
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '' });
        announceToScreenReader('Form submitted successfully! Welcome to the waitlist.');
        return;
      }
      
      throw new Error('Form submission failed - no success flag in response');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // More specific error messages based on error type
      let errorMessage = 'Error submitting form. Please try again.';
      
      if (error?.message?.includes('Failed to fetch')) {
        errorMessage = 'Connection error. Please check your internet and try again.';
      } else if (error?.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error?.message?.includes('status')) {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
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
