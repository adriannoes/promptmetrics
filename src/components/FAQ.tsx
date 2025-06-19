
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
    <section id="faq" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 sm:mb-20 md:mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 text-purple-800 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            Perguntas Frequentes
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 tracking-tight leading-tight">
            {t('faq.title')}
          </h2>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-8 text-left flex justify-between items-center hover:bg-white/50 transition-all duration-200 group min-h-[60px]"
              >
                <span className="font-semibold text-slate-900 text-base sm:text-lg md:text-xl leading-relaxed pr-4 sm:pr-6">{item.question}</span>
                <div className="flex-shrink-0">
                  <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-8 border-t border-white/50 bg-white/30 backdrop-blur-sm">
                  <div className="pt-4 sm:pt-6 animate-fade-in">
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg">{item.answer}</p>
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
