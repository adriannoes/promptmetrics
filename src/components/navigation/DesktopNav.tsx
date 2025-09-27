
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from '../LanguageSelector';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

interface DesktopNavProps {
  onSectionScroll: (sectionId: string) => void;
}

export function DesktopNav({ onSectionScroll }: DesktopNavProps) {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('SignOut error:', error);
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
  );
}
