export type SupportedLanguage = 'en' | 'pt-BR';

export function formatDateTime(
  isoString: string | number | Date,
  language: SupportedLanguage = 'en',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' }
): string {
  try {
    const date = isoString instanceof Date ? isoString : new Date(isoString);
    if (Number.isNaN(date.getTime())) return String(isoString);
    return new Intl.DateTimeFormat(language, options).format(date);
  } catch {
    return String(isoString);
  }
}

export function formatNumber(
  value: number,
  language: SupportedLanguage = 'en',
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);
    return new Intl.NumberFormat(language, options).format(value);
  } catch {
    return String(value);
  }
}


