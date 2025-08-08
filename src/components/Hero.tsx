
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { AuroraBackground } from './ui/aurora-background';
import { CTAButton } from './ui/cta-button';

const Hero = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuroraBackground className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 min-h-[85vh] sm:min-h-[90vh]">
      {/* Optimized background decoration with reduced complexity for mobile */}
      <div className="absolute inset-0 bg-grid-slate-100/40 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" aria-hidden="true"></div>
      <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400/15 sm:bg-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" aria-hidden="true"></div>
      <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-indigo-400/15 sm:bg-indigo-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-purple-300/8 sm:bg-purple-300/10 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex items-center justify-center min-h-[75vh] sm:min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="max-w-5xl mx-auto pm-reduce-motion"
        >
          {/* Enhanced badge with better mobile contrast */}
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-white/90 backdrop-blur-xl border border-white/60 rounded-full text-xs sm:text-sm font-medium text-slate-700 mb-6 sm:mb-8 md:mb-12 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" aria-hidden="true" />
            <span>{t('hero.badge')}</span>
          </div>
          
          {/* Optimized typography hierarchy for mobile */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-slate-900 mb-6 sm:mb-8 md:mb-12 leading-[1.1] sm:leading-[0.95] md:leading-[0.85] tracking-tight">
            <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          
          {/* Improved subtitle readability on mobile */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-600 mb-8 sm:mb-12 md:mb-16 leading-relaxed max-w-4xl mx-auto font-light px-2 sm:px-0">
            {t('hero.subtitle')}
          </p>
          
          {/* Enhanced CTA with better mobile touch targets */}
          <CTAButton 
            onClick={scrollToForm} 
            size="md"
            className="w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
            aria-label={`${t('hero.cta')} - Navigate to contact form`}
          >
            {t('hero.cta')}
          </CTAButton>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default Hero;
