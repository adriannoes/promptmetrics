export function extractDomain(input: string | null | undefined): string {
  if (!input) return '';
  let value = String(input).trim();
  // remove protocolo
  value = value.replace(/^https?:\/\//i, '');
  // remove www. apenas no início
  value = value.replace(/^www\./i, '');
  // remove path/query/fragment e trailing slash
  const firstSlash = value.indexOf('/');
  if (firstSlash !== -1) {
    value = value.substring(0, firstSlash);
  }
  value = value.replace(/\/$/, '');
  return value.toLowerCase();
}


