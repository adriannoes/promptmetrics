

import { AlertCircle } from 'lucide-react';

interface FormErrorMessageProps {
  error?: string;
  className?: string;
}

export function FormErrorMessage({ error, className = '' }: FormErrorMessageProps) {
  if (!error) return null;

  return (
    <div 
      className={`flex items-center gap-2 text-red-600 text-sm mt-2 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}
