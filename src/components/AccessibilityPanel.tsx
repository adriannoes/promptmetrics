
import { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Settings, X, Eye, Zap, Type } from 'lucide-react';
// import { Button } from './ui/button';

const AccessibilityPanel = () => {
  const { t } = useLanguage();
  const { 
    highContrast, 
    reducedMotion, 
    fontSize,
    toggleHighContrast, 
    toggleReducedMotion, 
    setFontSize 
  } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        aria-label={t('accessibility.openSettings')}
        title={t('accessibility.openSettings')}
      >
        <Settings className="w-5 h-5 mx-auto" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={togglePanel}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="fixed bottom-20 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl z-50 border border-slate-200"
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-modal="true"
          >
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 id="accessibility-title" className="text-lg font-semibold text-slate-900">
                  {t('accessibility.settings')}
                </h2>
                <button
                  onClick={togglePanel}
                  className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={t('accessibility.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-slate-600" />
                  <div>
                    <label htmlFor="high-contrast" className="text-sm font-medium text-slate-900">
                      {t('accessibility.highContrast')}
                    </label>
                    <p className="text-xs text-slate-600">
                      {t('accessibility.highContrastDesc')}
                    </p>
                  </div>
                </div>
                <button
                  id="high-contrast"
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    highContrast ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                  role="switch"
                  aria-checked={highContrast}
                  aria-labelledby="high-contrast"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-slate-600" />
                  <div>
                    <label htmlFor="reduced-motion" className="text-sm font-medium text-slate-900">
                      {t('accessibility.reducedMotion')}
                    </label>
                    <p className="text-xs text-slate-600">
                      {t('accessibility.reducedMotionDesc')}
                    </p>
                  </div>
                </div>
                <button
                  id="reduced-motion"
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    reducedMotion ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-labelledby="reduced-motion"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-slate-600" />
                  <label className="text-sm font-medium text-slate-900">
                    {t('accessibility.fontSize')}
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'large', 'extra-large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-2 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      aria-pressed={fontSize === size}
                    >
                      {t(`accessibility.fontSize.${size}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AccessibilityPanel;
