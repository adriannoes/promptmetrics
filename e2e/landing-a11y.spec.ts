import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Landing accessibility (axe)', () => {
  test('no a11y violations on key sections', async ({ page }) => {
    await page.goto('/');

    const axe = new AxeBuilder({ page })
      .include('header')
      .include('#main-content')
      .include('#pricing')
      .include('#faq')
      .include('#form')
      .include('footer');

    const results = await axe.analyze();
    const filtered = results.violations.filter(v => v.id !== 'color-contrast');
    if (filtered.length > 0) {
      console.log(JSON.stringify(filtered, null, 2));
    }
    expect(filtered).toEqual([]);
  });
});


