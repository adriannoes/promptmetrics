import { useMemo } from 'react';
import { validatePasswordStrength, getStrengthColor, getStrengthTextColor } from '@/utils/passwordStrength';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator = ({ password, className = '' }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => validatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase letters', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'At least one number', met: /\d/.test(password) },
    { label: 'At least one special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength bars */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              index < strength.score ? getStrengthColor(strength.score) : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength text */}
      <p className={`text-sm font-medium ${getStrengthTextColor(strength.score)}`}>
        {strength.feedback}
      </p>

      {/* Requirements checklist */}
      {strength.score < 3 && (
        <ul className="space-y-1.5">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              {req.met ? (
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className={req.met ? 'text-gray-700' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
