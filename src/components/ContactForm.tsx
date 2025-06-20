
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, User, Mail, Phone } from 'lucide-react';

const ContactForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitError, setSubmitError] = useState('');

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^(\+\d{1,3}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}$/;
        if (!value.trim()) {
          newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = 'Invalid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });
    
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('https://ipaas.pipefy.com/api/v1/webhooks/4sNQtjopIlKuRKpqg4elS/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
    
    // Validate field on change
    validateField(name, value);
  };

  if (submitted) {
    return (
      <section id="form" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-12 sm:p-16 shadow-2xl border border-white/40 animate-scale-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
              <Send className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">Thank you!</h3>
            <p className="text-base sm:text-lg md:text-xl text-slate-600">We'll be in touch soon.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="form" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/60 backdrop-blur-lg border border-white/50 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg">
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            Join the Waitlist
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 tracking-tight leading-tight">
            Get Started Now
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-light leading-relaxed">
            Be one of the first to revolutionize your LLM evaluations
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/40 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {submitError && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl text-sm shadow-lg">
                {submitError}
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 transition-all duration-300 hover:bg-white/70 focus:bg-white/80 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] ${
                  errors.name ? 'border-red-300 bg-red-50/50' : 'border-slate-200/60'
                }`}
              />
              {errors.name && (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600 animate-fade-in">{errors.name}</p>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 transition-all duration-300 hover:bg-white/70 focus:bg-white/80 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] ${
                  errors.email ? 'border-red-300 bg-red-50/50' : 'border-slate-200/60'
                }`}
              />
              {errors.email && (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600 animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 transition-all duration-300 hover:bg-white/70 focus:bg-white/80 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] ${
                  errors.phone ? 'border-red-300 bg-red-50/50' : 'border-slate-200/60'
                }`}
              />
              {errors.phone && (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600 animate-fade-in">{errors.phone}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-sm border border-blue-500/20 text-sm sm:text-base min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Join Waitlist
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
