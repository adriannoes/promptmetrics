import { describe, it, expect } from 'vitest';

// This is a lightweight test asserting header logic after we refactor the function
// We will import the helper we add (getAllowedOrigins/getCorsHeaders) from the same file/module.

describe('receive-analysis CORS helpers', () => {
  it('returns specific origin when allowed', async () => {
    const { getAllowedOrigins, getCorsHeaders } = await import('../../../supabase/functions/receive-analysis/cors-helpers.ts');
    const origins = getAllowedOrigins('development');
    expect(origins).toEqual(expect.arrayContaining(['http://localhost:5173']));
    const headers = getCorsHeaders('http://localhost:5173', origins);
    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
    expect(headers['Vary']).toContain('Origin');
  });

  it('returns 403 headers when origin is not allowed', async () => {
    const { getAllowedOrigins, getCorsHeaders } = await import('../../../supabase/functions/receive-analysis/cors-helpers.ts');
    const origins = getAllowedOrigins('production');
    const headers = getCorsHeaders('https://evil.example', origins);
    expect(headers['Access-Control-Allow-Origin']).toBe('');
    expect(headers['Vary']).toContain('Origin');
  });
});
