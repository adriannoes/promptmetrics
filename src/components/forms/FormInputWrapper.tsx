
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { FormErrorMessage } from './FormErrorMessage';

interface FormInputWrapperProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
  className?: string;
}

export function FormInputWrapper({ 
  children, 
  label, 
  error, 
  icon: Icon, 
  required = false,
  className = ''
}: FormInputWrapperProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {Icon && <Icon className="w-4 h-4 inline mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      <FormErrorMessage error={error} />
    </div>
  );
}
