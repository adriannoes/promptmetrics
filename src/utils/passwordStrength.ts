export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  feedback: string;
  isValid: boolean;
}

/**
 * Validates password strength and returns detailed feedback
 * Score: 0 (very weak) to 4 (very strong)
 */
export const validatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, feedback: 'Password is required', isValid: false };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check (minimum 8 characters)
  if (password.length < 8) {
    return { 
      score: 0, 
      feedback: 'Password must be at least 8 characters long', 
      isValid: false 
    };
  }
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Complexity checks
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (hasLowerCase && hasUpperCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChars) score++;

  // Generate feedback
  if (!hasLowerCase || !hasUpperCase) {
    feedback.push('Use both uppercase and lowercase letters');
  }
  if (!hasNumbers) {
    feedback.push('Include at least one number');
  }
  if (!hasSpecialChars) {
    feedback.push('Include at least one special character');
  }

  // Common patterns to avoid
  const commonPatterns = [
    /^123/,
    /abc/i,
    /password/i,
    /qwerty/i,
    /admin/i,
    /(\d)\1{2,}/,  // Repeated digits
    /([a-z])\1{2,}/i  // Repeated letters
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (hasCommonPattern) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid common patterns and repeated characters');
  }

  // Determine final feedback message
  let finalFeedback: string;
  if (score === 0) {
    finalFeedback = 'Very weak password';
  } else if (score === 1) {
    finalFeedback = 'Weak password';
  } else if (score === 2) {
    finalFeedback = 'Fair password';
  } else if (score === 3) {
    finalFeedback = 'Strong password';
  } else {
    finalFeedback = 'Very strong password';
  }

  if (feedback.length > 0) {
    finalFeedback += ' - ' + feedback.join(', ');
  }

  // Password is valid if score is at least 2 (fair)
  const isValid = score >= 2;

  return {
    score: score as 0 | 1 | 2 | 3 | 4,
    feedback: finalFeedback,
    isValid
  };
};

/**
 * Returns color class based on password strength score
 */
export const getStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

/**
 * Returns text color class based on password strength score
 */
export const getStrengthTextColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-600';
    case 2:
      return 'text-yellow-600';
    case 3:
      return 'text-blue-600';
    case 4:
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};
