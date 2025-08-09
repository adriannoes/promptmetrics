import { describe, it, expect } from 'vitest';
import { extractDomain } from './domain';

describe('extractDomain (5.1.3)', () => {
  it('remove protocolo http/https e prefixo www', () => {
    expect(extractDomain('https://www.example.com')).toBe('example.com');
    expect(extractDomain('http://www.example.com')).toBe('example.com');
    expect(extractDomain('https://example.com')).toBe('example.com');
    expect(extractDomain('http://example.com')).toBe('example.com');
  });

  it('mantém subdomínios e remove apenas www', () => {
    expect(extractDomain('https://sub.example.com')).toBe('sub.example.com');
    expect(extractDomain('www.example.co.uk')).toBe('example.co.uk');
  });

  it('lida com espaços e caixa alta', () => {
    expect(extractDomain('  HTTPS://WWW.Example.COM  ')).toBe('Example.COM'.toLowerCase());
  });
});


