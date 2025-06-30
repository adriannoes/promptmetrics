
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import MobileNav from './MobileNav';
import { Button } from './ui/button';
import { Zap, LogOut } from 'lucide-react';

const Header = () => {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    console.log('Header: Initiating signOut');
    await signOut();
    // signOut now handles the redirect internally
  };

  // Check if user is logged in (including demo user)
  const isLoggedIn = user || (profile && profile.email === 'demo@example.com');

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">PromptMetrics</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label={t('nav.main')}>
            <button 
              onClick={() => scrollTo('pricing')}
              className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
            >
              {t('pricing')}
            </button>
            <button 
              onClick={() => scrollTo('faq')}
              className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
            >
              {t('faq')}
            </button>
            
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    {profile?.full_name || user?.email || 'Demo User'}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    {t('nav.signOut')}
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="px-5 py-2.5 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 hover:bg-white/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    {t('login')}
                  </button>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
