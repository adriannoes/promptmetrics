
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  id: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  icon: LucideIcon;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon: Icon,
  className = ""
}) => {
  return (
    <div className="relative group">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" aria-hidden="true" />
      </div>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 transition-all duration-300 hover:bg-white/70 focus:bg-white/80 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] ${
          error ? 'border-red-300 bg-red-50/50' : 'border-slate-200/60'
        } ${className}`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600 animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export { FormField };
