
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
    <section id="faq" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 text-purple-800 rounded-full text-sm font-medium mb-8 shadow-lg">
            <HelpCircle className="w-4 h-4" />
            Perguntas Frequentes
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
            {t('faq.title')}
          </h2>
        </div>
        
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-10 py-8 text-left flex justify-between items-center hover:bg-white/50 transition-all duration-200 group"
              >
                <span className="font-semibold text-slate-900 text-xl leading-relaxed pr-6">{item.question}</span>
                <div className="flex-shrink-0">
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-10 pb-8 border-t border-white/50 bg-white/30 backdrop-blur-sm">
                  <div className="pt-6 animate-fade-in">
                    <p className="text-slate-600 leading-relaxed text-lg">{item.answer}</p>
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
