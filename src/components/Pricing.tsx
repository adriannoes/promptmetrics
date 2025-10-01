

import { useLanguage } from '../contexts/LanguageContext';
import { Star } from 'lucide-react';
import { PricingAdvanced } from './ui/pricing-advanced';

const Pricing = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.trial.title'),
      price: t('pricing.trial.price'),
      yearlyPrice: t('pricing.trial.price'),
      period: t('pricing.trial.period'),
      description: t('pricing.trial.desc'),
      features: [
        t('pricing.trial.feature1'),
        t('pricing.trial.feature2'),
        t('pricing.trial.feature3'),
        t('pricing.trial.feature4'),
      ],
      buttonText: t('pricing.choose'),
      href: '#form',
      isPopular: false,
    },
    {
      name: t('pricing.pro.title'),
      price: t('pricing.pro.price'),
      yearlyPrice: t('pricing.pro.yearlyPrice'),
      period: t('pricing.pro.period'),
      description: t('pricing.pro.desc'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
        t('pricing.pro.feature5'),
      ],
      buttonText: t('pricing.choose'),
      href: '#form',
      isPopular: true,
    },
    {
      name: t('pricing.enterprise.title'),
      price: t('pricing.enterprise.price'),
      yearlyPrice: t('pricing.enterprise.yearlyPrice'),
      period: '',
      description: t('pricing.enterprise.desc'),
      features: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
        t('pricing.enterprise.feature4'),
      ],
      buttonText: t('pricing.contact'),
      href: '#form',
      isPopular: false,
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50/50 to-blue-50/30 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/60 backdrop-blur-lg border border-white/50 text-green-800 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 shadow-lg">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            {t('tags.pricingPlans')}
          </div>
        </div>
        
        <PricingAdvanced 
          plans={plans}
          title={t('pricing.title')}
          description={t('pricing.subtitle')}
        />
      </div>
    </section>
  );
};

export default Pricing;
