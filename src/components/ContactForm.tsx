
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send } from 'lucide-react';
import SuccessMessage from './SuccessMessage';
import { ContactFormFields } from './forms/ContactFormFields';
import { useContactForm } from '../hooks/useContactForm';

const ContactForm = () => {
  const { t } = useLanguage();
  const {
    formData,
    isSubmitting,
    submitted,
    errors,
    submitError,
    handleChange,
    handlePhoneChange,
    handleSubmit
  } = useContactForm();

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
          <ContactFormFields
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onInputChange={handleChange}
            onPhoneChange={handlePhoneChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
