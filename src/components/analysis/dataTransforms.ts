import type { ChartDataPoint } from '@/types/analysis';

/**
 * Reordena as chaves de série, colocando a chave do cliente (domínio) primeiro.
 */
export function orderSeriesKeys(domain: string, keys: string[]): string[] {
  const lower = domain.toLowerCase();
  const findExact = keys.find((k) => k.toLowerCase() === lower);
  const findIncludes = keys.find((k) => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()));
  const mainKey = findExact || findIncludes || keys[0];
  const others = keys.filter((k) => k !== mainKey);
  return [mainKey, ...others];
}

/**
 * Mantém o cliente e o Top 5 concorrentes (por média), agrupando demais em "Others".
 * Retorna nova matriz com a coluna Others somada corretamente por linha.
 */
export function trimToTop5WithOthers(
  domain: string,
  rows: Array<Record<string, number | string>>
): Array<Record<string, number | string>> {
  if (!rows?.length) return rows;
  const keys = Object.keys(rows[0]).filter((k) => k !== 'month');
  if (!keys.length) return rows;

  const orderedKeys = orderSeriesKeys(domain, keys);
  const mainKey = orderedKeys[0];
  const competitorKeys = orderedKeys.slice(1);

  // média por série (apenas competidores)
  const averages = competitorKeys.map((k) => {
    const avg = rows.reduce((acc, r) => acc + (Number(r[k]) || 0), 0) / rows.length;
    return { key: k, avg };
  });
  averages.sort((a, b) => b.avg - a.avg);

  const topKeys = averages.slice(0, 5).map((a) => a.key);
  const dropKeys = averages.slice(5).map((a) => a.key);
  if (dropKeys.length === 0) return rows;

  // construir nova matriz com Others
  const resultRows = rows.map((r) => {
    const othersSum = dropKeys.reduce((acc, k) => acc + (Number(r[k]) || 0), 0);
    const base: Record<string, number | string> = { month: r.month };
    base[mainKey] = Number(r[mainKey]) || 0;
    topKeys.forEach((k) => {
      base[k] = Number(r[k]) || 0;
    });
    base['Others'] = othersSum;
    return base;
  });
  return resultRows as ChartDataPoint[];
}


