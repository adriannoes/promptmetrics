
import { translations } from '@/contexts/LanguageContext';

/**
 * Hook que sempre retorna traduções em inglês
 * Usado para páginas específicas que devem sempre estar em inglês
 */
export const useEnglishLanguage = () => {
  const t = (key: string): string => {
    console.log('🔍 useEnglishLanguage: Translating key:', key);
    
    const keys = key.split('.');
    let value: any = translations.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn('🚨 useEnglishLanguage: Translation key not found:', key, 'at segment:', k);
        return key; // Return the key if translation not found
      }
    }
    
    const result = typeof value === 'string' ? value : key;
    console.log('✅ useEnglishLanguage: Translation result:', key, '->', result);
    return result;
  };

  return {
    language: 'en' as const,
    t,
    setLanguage: () => {}, // No-op para manter compatibilidade com useLanguage
  };
};
