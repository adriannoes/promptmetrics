import React from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import SkipNav from '../components/SkipNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccessibilityPanel from '../components/AccessibilityPanel';

const ChangelogContent = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipNav />
      <Header />
      <main id="main-content" tabIndex={-1} role="main" className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {t('changelog.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('changelog.subtitle')}
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Empty state - will be populated by Lovable Git integration */}
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  className="w-8 h-8 text-muted-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                Coming Soon
              </h3>
              <p className="text-muted-foreground">
                {t('changelog.empty')}
              </p>
            </div>
            
            {/* Template for future changelog entries */}
            {/* 
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Version Title</h3>
                  <p className="text-sm text-muted-foreground">Date</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                  Latest
                </span>
              </div>
              <div className="prose prose-sm max-w-none">
                <p>Change description will appear here.</p>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                By Author Name
              </div>
            </div>
            */}
          </div>
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

const Changelog = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <ChangelogContent />
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default Changelog;