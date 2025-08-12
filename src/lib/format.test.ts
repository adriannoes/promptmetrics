import { describe, it, expect } from 'vitest';
import { formatDateTime, formatNumber } from './format';

describe('formatDateTime', () => {
  it('formata datas em en e pt-BR', () => {
    const iso = '2025-08-10T23:04:00.000Z';
    const en = formatDateTime(iso, 'en');
    const pt = formatDateTime(iso, 'pt-BR');
    expect(typeof en).toBe('string');
    expect(typeof pt).toBe('string');
    expect(en).not.toBe(String(iso));
    expect(pt).not.toBe(String(iso));
  });

  it('retorna string original quando inválida', () => {
    expect(formatDateTime('invalid-date', 'en')).toBe('invalid-date');
  });
});

describe('formatNumber', () => {
  it('formata número em en e pt-BR', () => {
    expect(formatNumber(1234.56, 'en')).toMatch(/1,234|1,234\.56/);
    expect(formatNumber(1234.56, 'pt-BR')).toMatch(/1.234|1.234,56/);
  });

  it('retorna valor original quando não numérico', () => {
    expect(formatNumber(NaN as any, 'en')).toBe('NaN');
  });
});


