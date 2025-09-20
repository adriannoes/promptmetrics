
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Mail } from 'lucide-react';
import PhoneInput from '../PhoneInput';
import FormField from '../FormField';
import SubmitButton from '../SubmitButton';
import { FormErrorMessage } from './FormErrorMessage';

interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  errors: { [key: string]: string };
  isSubmitting: boolean;
  submitError: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  errors,
  isSubmitting,
  submitError,
  onInputChange,
  onPhoneChange,
  onSubmit
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8" noValidate>
      <FormErrorMessage 
        error={submitError}
        className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg"
      />
      
      <FormField
        id="name"
        name="name"
        type="text"
        placeholder={t('form.name.placeholder')}
        value={formData.name}
        onChange={onInputChange}
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
        onChange={onInputChange}
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
          onChange={onPhoneChange}
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
  );
};
