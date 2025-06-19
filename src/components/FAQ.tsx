
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
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/80 text-purple-800 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Perguntas Frequentes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t('faq.title')}
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-200/60 hover:shadow-sm transition-all duration-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-100/50 transition-colors group"
              >
                <span className="font-semibold text-slate-900 text-lg leading-relaxed pr-4">{item.question}</span>
                <div className="flex-shrink-0">
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-8 pb-6 border-t border-slate-200/60 bg-white/50">
                  <div className="pt-4">
                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
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
