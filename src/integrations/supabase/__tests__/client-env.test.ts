import { describe, expect, it } from 'vitest';
import { selectNonEmptyEnv, getSupabaseEnvFromValues } from '../client';

describe('supabase client env helpers', () => {
  it('selectNonEmptyEnv retorna fallback quando valor é vazio', () => {
    expect(selectNonEmptyEnv('', 'fallback')).toBe('fallback');
    expect(selectNonEmptyEnv('   ', 'fallback')).toBe('fallback');
  });

  it('selectNonEmptyEnv retorna valor quando não está vazio', () => {
    expect(selectNonEmptyEnv('abc', 'fallback')).toBe('abc');
  });

  it('getSupabaseEnvFromValues usa fallback quando variáveis estão vazias', async () => {
    const { url, anonKey } = getSupabaseEnvFromValues(' ', '');
    expect(url).toMatch(/^https:\/\//);
    expect(anonKey.length).toBeGreaterThan(10);
  });
});


