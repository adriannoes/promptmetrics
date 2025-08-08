
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send } from 'lucide-react';
import SectionHeader from './SectionHeader';
import DecorativeBlobs from './DecorativeBlobs';
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
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 relative overflow-hidden"
      aria-labelledby="form-title"
      role="region"
    >
      <DecorativeBlobs
        blobs={[
          { className: 'absolute top-10 sm:top-20 left-4 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/15 sm:bg-blue-200/20 rounded-full blur-2xl sm:blur-3xl' },
          { className: 'absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-200/15 sm:bg-indigo-200/20 rounded-full blur-2xl sm:blur-3xl' },
        ]}
      />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-12 md:mb-16">
          <SectionHeader
            icon={Send}
            tag={t('form.badge')}
            title={t('form.title')}
            subtitle={t('form.subtitle')}
            align="center"
            tagClasses="bg-white/70 backdrop-blur-lg border border-white/50 text-blue-800"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-white/40 animate-fade-in" style={{ animationDelay: '200ms' }}>
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
