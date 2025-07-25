import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
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

      console.log('=== SUBMITTING DIRECTLY TO PIPEFY WEBHOOK ===');
      console.log('Submitting sanitized data:', sanitizedData);

      // Direct submission to Pipefy webhook
      const pipefyWebhookUrl = 'https://ipaas.pipefy.com/api/v1/webhooks/1NlP7fuovl3qx5FSJsBBI/sync';
      
      const response = await fetch(pipefyWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData)
      });

      console.log('=== PIPEFY WEBHOOK RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('=== PIPEFY WEBHOOK ERROR ===');
        console.error('Error status:', response.status);
        console.error('Error text:', errorText);
        throw new Error(`Failed to submit to Pipefy: ${response.status} - ${errorText}`);
      }

      // Pipefy webhook might return different response formats
      let result;
      try {
        result = await response.json();
        console.log('=== PIPEFY SUCCESS RESPONSE ===');
        console.log('Response data:', result);
      } catch (parseError) {
        // Some webhooks return plain text or empty response on success
        console.log('=== PIPEFY SUCCESS (No JSON) ===');
        console.log('Response was successful but not JSON');
      }

      console.log('=== FORM SUBMITTED SUCCESSFULLY TO PIPEFY ===');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
      announceToScreenReader('Form submitted successfully! Welcome to the waitlist.');
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