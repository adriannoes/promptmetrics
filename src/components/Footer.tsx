
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import nvidiaInceptionBadge from '../assets/nvidia-inception-badge.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Brand and Legal */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Brand Identity */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">PromptMetrics</span>
            </div>
            
            {/* Copyright */}
            <p className="text-slate-400 mb-4">
              {t('footer.copyright')}
            </p>
            
            {/* Legal Navigation */}
            <nav className="mb-4" aria-label="Legal links">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
                  type="button"
                >
                  {t('footer.terms')}
                </button>
                <button 
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
                  type="button"
                >
                  {t('footer.privacy')}
                </button>
                <Link 
                  to="/changelog"
                  className="text-slate-400 hover:text-white transition-colors font-medium"
                >
                  {t('footer.changelog')}
                </Link>
              </div>
            </nav>
            
            {/* Contact Email */}
            <a 
              href="mailto:info@promptmetrics.io"
              className="text-slate-400 hover:text-white transition-colors font-medium"
            >
              {t('footer.contact')}
            </a>
          </div>

          {/* Right Column - NVIDIA Partnership */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
            <div className="flex flex-col items-center lg:items-end gap-4">
              <p className="text-sm text-slate-400 font-medium">
                {t('footer.proudMemberOf')}
              </p>
              <img 
                src={nvidiaInceptionBadge} 
                alt="NVIDIA Inception Program"
                className="max-w-[160px] h-auto hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => window.open('https://www.nvidia.com/en-us/startups/', '_blank')}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
