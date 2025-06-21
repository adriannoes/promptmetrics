
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
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
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">RankMeLLM</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollTo('pricing')}
              className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105"
            >
              {t('pricing')}
            </button>
            <button 
              onClick={() => scrollTo('faq')}
              className="text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105"
            >
              {t('faq')}
            </button>
            
            <div className="flex items-center gap-6">
              <LanguageSelector />
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    {profile?.full_name || user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="px-5 py-2.5 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium text-sm hover:scale-105 hover:bg-white/50 rounded-lg backdrop-blur-sm">
                    {t('login')}
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
