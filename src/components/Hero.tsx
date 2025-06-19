import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { AuroraBackground } from './ui/aurora-background';

const Hero = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuroraBackground className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 pt-16 pb-20 min-h-[85vh]">
      {/* Enhanced background decoration - keeping existing gradients */}
      <div className="absolute inset-0 bg-grid-slate-100/40 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-300/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="max-w-5xl mx-auto"
        >
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/50 rounded-full text-sm font-medium text-slate-700 mb-12 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t('hero.badge')}
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-slate-900 mb-12 leading-[0.85] tracking-tight">
            <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
          
          <button
            onClick={scrollToForm}
            className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 border border-blue-500/20 backdrop-blur-sm"
          >
            {t('hero.cta')}
            <div className="w-2 h-2 bg-white/80 rounded-full group-hover:bg-white group-hover:scale-125 transition-all duration-300"></div>
          </button>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default Hero;
