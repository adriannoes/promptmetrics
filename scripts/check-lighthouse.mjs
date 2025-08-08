// Verifica métricas do Lighthouse a partir do JSON gerado
// Requisitos: Performance >= 90, LCP <= 2500ms, CLS <= 0.1
import fs from 'node:fs';

const REPORT_PATH = new URL('../lighthouse-report-mobile.json', import.meta.url);
const raw = fs.readFileSync(REPORT_PATH, 'utf-8');
const data = JSON.parse(raw);

// Performance score vem normalizado (0..1)
const performanceScore = Math.round((data.categories.performance.score || 0) * 100);
const cls = data.audits['cumulative-layout-shift']?.numericValue ?? Infinity;
const lcpMs = data.audits['largest-contentful-paint']?.numericValue ?? Infinity;

const errors = [];
if (performanceScore < 90) errors.push(`Performance abaixo de 90: ${performanceScore}`);
if (cls > 0.1) errors.push(`CLS acima de 0.1: ${cls}`);
if (lcpMs > 2500) errors.push(`LCP acima de 2500ms: ${lcpMs}ms`);

if (errors.length) {
  console.error('Falha na checagem do Lighthouse:', errors.join(' | '));
  process.exit(1);
}

console.log(`Lighthouse OK ✅ Performance: ${performanceScore}, CLS: ${cls}, LCP: ${lcpMs}ms`);


