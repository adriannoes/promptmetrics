import { test, expect } from '@playwright/test';

test.describe('Landing visual and a11y', () => {
  test('sections render and take snapshots', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await expect(page).toHaveScreenshot('landing-hero.png', { fullPage: false, maxDiffPixels: 100 });
    await page.locator('section#pricing').first().scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('landing-pricing.png', { fullPage: false, maxDiffPixels: 100 });
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('landing-faq.png', { fullPage: false });
    await page.locator('#form').scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('landing-form.png', { fullPage: false });
  });
});


