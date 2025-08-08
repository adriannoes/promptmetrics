import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Landing accessibility (axe)', () => {
  test('no a11y violations on key sections', async ({ page }) => {
    await page.goto('/');
    // Garante que a página está renderizada antes de rodar o Axe
    await page.waitForSelector('header');
    await page.waitForSelector('#main-content');
    await page.waitForSelector('footer');

    const axe = new AxeBuilder({ page })
      // Regra de contraste verificada manualmente em 5.2/5.5
      .disableRules(['color-contrast']);

    const results = await axe.analyze();
    if (results.violations.length > 0) {
      console.log(JSON.stringify(results.violations, null, 2));
    }
    expect(results.violations).toEqual([]);
  });
});


