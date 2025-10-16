
import React from 'react';
import { Send } from 'lucide-react';

interface SuccessMessageProps {
  title: string;
  subtitle: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, subtitle }) => {
  return (
    <section 
      id="form" 
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 relative overflow-hidden"
      aria-labelledby="success-title"
      role="region"
    >
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/20 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-12 sm:p-16 shadow-2xl border border-white/40 animate-scale-in">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl"
            aria-hidden="true"
          >
            <Send className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h2 id="success-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuccessMessage;
