
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from '../LanguageSelector';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface DesktopNavProps {
  onSectionScroll: (sectionId: string) => void;
}

export function DesktopNav({ onSectionScroll }: DesktopNavProps) {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    console.log('Desktop nav: Starting sign out process');
    setSigningOut(true);
    
    try {
      const success = await signOut();
      console.log('Desktop nav: Sign out result:', success);
      
      // Don't set loading to false here - let the event handler do it
      // The signout-complete event will be fired by the authService
    } catch (error) {
      console.error('Desktop nav: Sign out error:', error);
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
      console.log('Desktop nav: Received signout-complete event', e.detail);
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
      
      <Link 
        to="/analysis"
        className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
      >
        {t('analysis.title')}
      </Link>
      
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
