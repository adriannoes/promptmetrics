
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.starter.title'),
      price: t('pricing.starter.price'),
      period: '',
      description: t('pricing.starter.desc'),
      features: [
        t('pricing.starter.feature1'),
        t('pricing.starter.feature2'),
        t('pricing.starter.feature3'),
        t('pricing.starter.feature4'),
      ],
      cta: t('pricing.choose'),
      popular: false,
    },
    {
      name: t('pricing.pro.title'),
      price: t('pricing.pro.price'),
      period: t('pricing.pro.period'),
      description: t('pricing.pro.desc'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
        t('pricing.pro.feature5'),
      ],
      cta: t('pricing.choose'),
      popular: true,
    },
    {
      name: t('pricing.enterprise.title'),
      price: t('pricing.enterprise.price'),
      period: '',
      description: t('pricing.enterprise.desc'),
      features: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
        t('pricing.enterprise.feature4'),
      ],
      cta: t('pricing.contact'),
      popular: false,
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-gradient-to-br from-slate-50/50 to-blue-50/30 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-lg border border-white/50 text-green-800 rounded-full text-sm font-medium mb-8 shadow-lg">
            <Star className="w-4 h-4" />
            Planos e Preços
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-slate-600 font-light leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 border transition-all duration-500 hover:shadow-2xl group animate-fade-in ${
                plan.popular 
                  ? 'border-blue-200/60 shadow-2xl shadow-blue-500/10 scale-105' 
                  : 'border-white/50 shadow-xl hover:border-slate-200/60 hover:shadow-slate-300/20'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl backdrop-blur-sm">
                    <Star className="w-4 h-4" />
                    Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-6xl font-bold text-slate-900 tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-slate-600 ml-2 font-medium text-lg">{plan.period}</span>}
                </div>
                <p className="text-slate-600 font-light text-lg">{plan.description}</p>
              </div>
              
              <ul className="space-y-5 mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-5 px-6 rounded-2xl font-semibold transition-all duration-300 group-hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                plan.popular 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 hover:shadow-blue-500/30'
                  : 'bg-white/80 backdrop-blur-sm text-slate-900 hover:bg-white border border-slate-200/60 hover:border-slate-300'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
