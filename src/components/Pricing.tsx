
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
    <section id="pricing" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 text-green-800 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Planos e Preços
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-slate-600 font-light">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl group ${
              plan.popular 
                ? 'border-blue-200 shadow-lg shadow-blue-500/10 scale-105' 
                : 'border-slate-200 shadow-sm hover:border-slate-300'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4" />
                    Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-3">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-slate-600 ml-2 font-medium">{plan.period}</span>}
                </div>
                <p className="text-slate-600 font-light">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 group-hover:scale-[1.02] ${
                plan.popular 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200'
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
