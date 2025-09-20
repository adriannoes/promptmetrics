
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqItems = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section 
      id="faq" 
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Optimized background decoration */}
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200/15 sm:bg-purple-200/20 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200/15 sm:bg-blue-200/20 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 text-purple-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 md:mb-8 shadow-lg">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>{t('tags.faq')}</span>
          </div>
          <h2 
            id="faq-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight px-2 sm:px-0"
          >
            {t('faq.title')}
          </h2>
        </div>
        
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-8 text-left flex justify-between items-center hover:bg-white/50 transition-all duration-200 group min-h-[56px] sm:min-h-[60px]"
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed pr-3 sm:pr-4 md:pr-6">{item.question}</span>
                <div className="flex-shrink-0">
                  <ChevronDown 
                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`} 
                    aria-hidden="true"
                  />
                </div>
              </button>
              {openItems.includes(index) && (
                <div 
                  className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-10 lg:pb-8 border-t border-white/50 bg-white/30 backdrop-blur-sm"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  id={`faq-answer-${index}`}
                >
                  <div className="pt-3 sm:pt-4 md:pt-6 animate-fade-in">
                    <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
