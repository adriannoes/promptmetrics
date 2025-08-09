export function extractDomain(input: string | null | undefined): string {
  if (!input) return '';
  let value = String(input).trim();
  // remove protocolo
  value = value.replace(/^https?:\/\//i, '');
  // remove www. apenas no início
  value = value.replace(/^www\./i, '');
  return value.toLowerCase();
}


