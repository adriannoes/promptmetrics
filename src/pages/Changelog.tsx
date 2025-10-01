
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
            <div className="border-2 border-primary/50 bg-primary/5 rounded-lg p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">v1.4.0 - {t('changelog.v1.4.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">2 de julho, 2025</p>
                </div>
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-sm">
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
            </div>

            {/* Version 1.3.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.3.0 - {t('changelog.v1.3.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">28 de junho, 2025</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.3.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Version 1.2.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.2.0 - {t('changelog.v1.2.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">25 de junho, 2025</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.2.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Version 1.1.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.1.0 - {t('changelog.v1.1.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">19 de junho, 2025</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.1.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Version 1.0.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.0.0 - {t('changelog.v1.0.0.title')}</h3>
                  <p className="text-sm text-muted-foreground">13 de junho, 2025</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  {t('changelog.v1.0.0.changes').split('|').map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
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