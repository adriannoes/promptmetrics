
import { translations } from '@/contexts/LanguageContext';

/**
 * Hook que sempre retorna traduções em inglês
 * Usado para páginas específicas que devem sempre estar em inglês
 */
export const useEnglishLanguage = () => {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations.en;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return {
    language: 'en' as const,
    t,
    setLanguage: () => {}, // No-op para manter compatibilidade com useLanguage
  };
};
