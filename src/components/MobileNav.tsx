
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { Button } from './ui/button';
import { Menu, X, Zap, LogOut } from 'lucide-react';
import { toast } from './ui/use-toast';

const MobileNav = () => {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  // Close mobile nav on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeNav();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when nav is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeNav();
    }
  };

  const handleSignOut = async () => {
    console.log('Mobile nav: Starting sign out process');
    setSigningOut(true);
    
    try {
      const success = await signOut();
      console.log('Mobile nav: Sign out result:', success);
      closeNav();
      
      // Don't set loading to false here - let the event handler do it
      // The signout-complete event will be fired by the authService
    } catch (error) {
      console.error('Mobile nav: Sign out error:', error);
      setSigningOut(false);
      toast({ 
        title: t('nav.signOut'), 
        description: 'Erro ao sair. Tente novamente.', 
        variant: 'destructive' 
      });
    }
  };

  // Feedback visual pós-signout
  React.useEffect(() => {
    const onSignoutComplete = (e: any) => {
      console.log('Mobile nav: Received signout-complete event', e.detail);
      setSigningOut(false);
      
      if (e.detail?.success) {
        toast({ 
          title: t('nav.signOut'), 
          description: 'Logout realizado com sucesso!', 
          variant: 'default' 
        });
      } else {
        toast({ 
          title: t('nav.signOut'), 
          description: 'Erro ao sair. Tente novamente.', 
          variant: 'destructive' 
        });
      }
    };
    
    window.addEventListener('signout-complete', onSignoutComplete);
    return () => window.removeEventListener('signout-complete', onSignoutComplete);
  }, [t]);

  // Check if user is logged in (including demo user)
  const isLoggedIn = user || (profile && profile.email === 'demo@example.com');

  return (
    <div className="md:hidden">
      <button
        onClick={toggleNav}
        className="p-2 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label={isOpen ? t('nav.close') : t('nav.open')}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeNav}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <nav
        id="mobile-navigation"
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={t('nav.main')}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">PromptMetrics</span>
            </div>
            <button
              onClick={closeNav}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              aria-label={t('nav.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-4 space-y-6">
            <div className="space-y-4">
              <button
                onClick={() => scrollTo('pricing')}
                className="block w-full text-left px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                {t('pricing')}
              </button>
              <button
                onClick={() => scrollTo('faq')}
                className="block w-full text-left px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                {t('faq')}
              </button>
              
              <Link 
                to="/analysis" 
                onClick={closeNav}
                className="block w-full text-left px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Análise
              </Link>
            </div>

            {/* Language Selector */}
            <div className="pt-4 border-t border-slate-200">
              <div className="px-4 mb-3">
                <span className="text-sm font-medium text-slate-600">{t('nav.language')}</span>
              </div>
              <LanguageSelector />
            </div>

            {/* Auth Section */}
            <div className="pt-4 border-t border-slate-200">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="px-4">
                    <span className="text-sm text-slate-600">
                      {profile?.full_name || user?.email || 'Demo User'}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center"
                    disabled={signingOut}
                    aria-busy={signingOut}
                    aria-label={t('nav.signOut')}
                  >
                    {signingOut ? (
                      <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    {t('nav.signOut')}
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={closeNav}>
                  <Button variant="outline" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;
