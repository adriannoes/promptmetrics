import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Send, User, Mail } from 'lucide-react';
import PhoneInput from './PhoneInput';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import SuccessMessage from './SuccessMessage';
import DOMPurify from 'dompurify';

const ContactForm = () => {
  const { t } = useLanguage();
  const { announceToScreenReader } = useAccessibility();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitError, setSubmitError] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Enhanced email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  // Sanitize input to prevent injection attacks
  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const validatePhoneNumber = (phoneValue: string): boolean => {
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

  const validateField = (name: string, value: string) => {
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
    
    setErrors(newErrors);
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
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });
    
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
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

      const response = await fetch('https://ipaas.pipefy.com/api/v1/webhooks/4sNQtjopIlKuRKpqg4elS/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '' });
        announceToScreenReader('Form submitted successfully! Welcome to the waitlist.');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(t('form.error.submit'));
      announceToScreenReader('Form submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    validateField(name, trimmedValue);
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
    validateField('phone', trimmedValue);
  };

  if (submitted) {
    return (
      <SuccessMessage 
        title={t('form.success.title')}
        subtitle={t('form.success.subtitle')}
      />
    );
  }

  return (
    <section 
      id="form" 
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 relative overflow-hidden"
      aria-labelledby="form-title"
      role="region"
    >
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/60 backdrop-blur-lg border border-white/50 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg">
            <Send className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            {t('form.badge')}
          </div>
          <h2 id="form-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 tracking-tight leading-tight">
            {t('form.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-light leading-relaxed">
            {t('form.subtitle')}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/40 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" noValidate>
            {submitError && (
              <div 
                className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl text-sm shadow-lg"
                role="alert"
                aria-live="polite"
              >
                {submitError}
              </div>
            )}
            
            <FormField
              id="name"
              name="name"
              type="text"
              placeholder={t('form.name.placeholder')}
              value={formData.name}
              onChange={handleChange}
              required
              error={errors.name}
              icon={User}
            />

            <FormField
              id="email"
              name="email"
              type="email"
              placeholder={t('form.email.placeholder')}
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
              icon={Mail}
            />

            <div>
              <label htmlFor="phone" className="sr-only">
                {t('form.phone.placeholder')}
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder={t('form.phone.placeholder')}
                required
              />
            </div>

            <SubmitButton
              isSubmitting={isSubmitting}
              hasErrors={Object.keys(errors).length > 0}
              submitText={t('form.button')}
              submittingText={t('form.submitting')}
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
