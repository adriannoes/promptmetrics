import { describe, it, expect } from 'vitest';


describe('timing-safe compare', async () => {
  const { timingSafeEqual } = await import('../../../supabase/functions/receive-analysis/timing.ts');

  it('returns true for equal strings', () => {
    expect(timingSafeEqual('secret', 'secret')).toBe(true);
  });

  it('returns false for different strings', () => {
    expect(timingSafeEqual('secret', 'Secret')).toBe(false);
  });

  it('returns false for different lengths', () => {
    expect(timingSafeEqual('secret', 'secret1')).toBe(false);
  });

  it('handles empty and null-like values safely', () => {
    // @ts-expect-error - testing runtime behavior with non-strings
    expect(timingSafeEqual(null, 'x')).toBe(false);
    // @ts-expect-error
    expect(timingSafeEqual('x', undefined)).toBe(false);
  });
});
