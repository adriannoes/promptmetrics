

import { useLanguage } from '../../contexts/LanguageContext';

const SkipNav = () => {
  const { t } = useLanguage();

  const skipToContent = () => {
    const content = document.getElementById('main-content');
    if (content) {
      content.focus();
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus:not-sr-only">
      <button
        onClick={skipToContent}
        className="fixed top-4 left-4 z-[100] bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        {t('accessibility.skipToContent')}
      </button>
    </div>
  );
};

export { SkipNav };
