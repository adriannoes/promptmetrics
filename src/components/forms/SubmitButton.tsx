
import React from 'react';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  hasErrors: boolean;
  submitText: string;
  submittingText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  hasErrors,
  submitText,
  submittingText
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || hasErrors}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-sm border border-blue-500/20 text-sm sm:text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-describedby={isSubmitting ? 'submit-status' : undefined}
    >
      {isSubmitting ? (
        <>
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
          <span id="submit-status">{submittingText}</span>
        </>
      ) : (
        <>
          {submitText}
          <Send className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </>
      )}
    </button>
  );
};

export { SubmitButton };
