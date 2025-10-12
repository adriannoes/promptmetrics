import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText } from '@/utils/security';

describe('security sanitization', () => {
  it('removes script tags from HTML', () => {
    const dirty = '<div>ok<script>alert(1)</script></div>';
    const clean = sanitizeHtml(dirty);
    // default config does not allow <div>, but preserves inner text
    expect(clean).toBe('ok');
    expect(clean).not.toContain('<script>');
  });

  it('allows basic formatting tags and class attr', () => {
    const html = '<p class="x">Hello <strong>World</strong></p>';
    const clean = sanitizeHtml(html);
    expect(clean).toContain('<p class="x">Hello <strong>World</strong></p>');
  });

  it('sanitizes plain text by removing tags', () => {
    const input = 'Click <b>here</b> & enjoy';
    const clean = sanitizeText(input);
    // Tags are removed and & is escaped
    expect(clean).toBe('Click here &amp; enjoy');
  });

  it('sanitizes SVG by stripping event handlers and scripts while allowing basic shapes', () => {
    const svg = '<svg viewBox="0 0 10 10" onload="alert(1)"><path d="M0 0 L10 10" onclick="x()"/></svg>';
    const clean = sanitizeHtml(svg, {
      ALLOWED_TAGS: ['svg', 'path'],
      ALLOWED_ATTR: ['viewBox', 'd']
    });
    expect(clean).toContain('<svg');
    expect(clean).toContain('viewBox="0 0 10 10"');
    expect(clean).toContain('<path d="M0 0 L10 10"');
    expect(clean).not.toContain('onload');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('<script');
  });
});
