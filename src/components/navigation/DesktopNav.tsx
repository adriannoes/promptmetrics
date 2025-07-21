
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import { authToast, getCurrentLanguage } from '@/utils/toastMessages';

interface DesktopNavProps {
  onSectionScroll?: (sectionId: string) => void;
}

export function DesktopNav({ onSectionScroll }: DesktopNavProps) {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log('Desktop nav: Starting sign out process');
    setSigningOut(true);
    const currentLanguage = getCurrentLanguage();
    
    try {
      const result = await signOut();
      console.log('Desktop nav: Sign out result:', result);
      
      if (result.success) {
        authToast.logoutSuccess(currentLanguage);
        // Navigate directly to home after successful logout
        navigate('/', { replace: true });
      } else {
        authToast.logoutError(currentLanguage);
      }
    } catch (error) {
      console.error('Desktop nav: Sign out error:', error);
      authToast.logoutError(currentLanguage);
    } finally {
      setSigningOut(false);
    }
  };

  const isLoggedIn = user || (profile && profile.email === 'demo@example.com');

  return (
    <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label={t('nav.main')}>
      <button 
        onClick={() => onSectionScroll('pricing')}
        className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
      >
        {t('pricing')}
      </button>
      <button 
        onClick={() => onSectionScroll('faq')}
        className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
      >
        {t('faq')}
      </button>
      
      <div className="flex items-center gap-4">
        <LanguageSelector />
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link 
              to="/analysis"
              className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
            >
              {t('analysis.title')}
            </Link>
            <span className="text-sm text-slate-600">
              {profile?.full_name || user?.email || 'Demo User'}
            </span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={signingOut}
              aria-busy={signingOut}
              aria-label={t('nav.signOut')}
            >
              {signingOut ? (
                <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="w-4 h-4" aria-hidden="true" />
              )}
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
  );
}
