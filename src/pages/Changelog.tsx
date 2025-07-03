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
            {/* Version 1.4.0 - Latest */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.4.0 - {t('changelog.v1.4.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">3 de Janeiro, 2025</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                  {t('changelog.latest')}
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.4.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {t('changelog.by')} Development Team
              </div>
            </div>

            {/* Version 1.3.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.3.0 - {t('changelog.v1.3.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">2 de Janeiro, 2025</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.3.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {t('changelog.by')} Development Team
              </div>
            </div>

            {/* Version 1.2.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.2.0 - {t('changelog.v1.2.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">30 de Dezembro, 2024</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.2.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {t('changelog.by')} Development Team
              </div>
            </div>

            {/* Version 1.1.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.1.0 - {t('changelog.v1.1.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">28 de Dezembro, 2024</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.1.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {t('changelog.by')} Development Team
              </div>
            </div>

            {/* Version 1.0.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.0.0 - {t('changelog.v1.0.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">25 de Dezembro, 2024</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.0.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {t('changelog.by')} Development Team
              </div>
            </div>
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