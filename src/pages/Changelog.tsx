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
                  <h3 className="text-lg font-semibold">v1.4.0 - Changelog & Transparency</h3>
                  <p className="text-sm text-muted-foreground">January 3, 2025</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                  Latest
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  <li>• Added comprehensive changelog page with version history</li>
                  <li>• Implemented footer navigation with changelog link</li>
                  <li>• Enhanced responsive design for changelog display</li>
                  <li>• Improved footer layout with better mobile responsiveness</li>
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                By Development Team
              </div>
            </div>

            {/* Version 1.3.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.3.0 - Domain Management</h3>
                  <p className="text-sm text-muted-foreground">January 2, 2025</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  <li>• Implemented first-time user domain setup flow</li>
                  <li>• Added domain validation with real-time feedback</li>
                  <li>• Created beautiful domain setup page with animations</li>
                  <li>• Enhanced user onboarding experience</li>
                  <li>• Added redirect logic based on domain configuration status</li>
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                By Development Team
              </div>
            </div>

            {/* Version 1.2.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.2.0 - Interactive Demo</h3>
                  <p className="text-sm text-muted-foreground">December 30, 2024</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  <li>• Built comprehensive demo page with AI analysis tabs</li>
                  <li>• Added prompt analysis, competitor analysis, and strategic insights</li>
                  <li>• Implemented interactive data tables and charts</li>
                  <li>• Created sentiment analysis visualization</li>
                  <li>• Added prompt customization and flash cards features</li>
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                By Development Team
              </div>
            </div>

            {/* Version 1.1.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.1.0 - Authentication & Admin</h3>
                  <p className="text-sm text-muted-foreground">December 28, 2024</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  <li>• Implemented complete authentication system with Supabase</li>
                  <li>• Added role-based access control (admin, client)</li>
                  <li>• Created admin dashboard with user management</li>
                  <li>• Built invitation code system for user registration</li>
                  <li>• Added security audit logs and login attempt tracking</li>
                  <li>• Implemented organization management system</li>
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                By Development Team
              </div>
            </div>

            {/* Version 1.0.0 */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">v1.0.0 - Platform Launch</h3>
                  <p className="text-sm text-muted-foreground">December 25, 2024</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="space-y-2">
                  <li>• Launched PromptMetrics platform with landing page</li>
                  <li>• Implemented bilingual support (English & Portuguese)</li>
                  <li>• Created responsive design with accessibility features</li>
                  <li>• Built pricing, FAQ, and contact form sections</li>
                  <li>• Added waitlist functionality with form validation</li>
                  <li>• Established design system with Tailwind CSS</li>
                </ul>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                By Development Team
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