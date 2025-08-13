import { test, expect } from '@playwright/test';

test.describe('Landing navigation', () => {
  test('mobile menu scrolls to pricing and faq', async ({ page }) => {
    // Skip on desktop projects; this test validates mobile drawer behavior only
    if (test.info().project.name.includes('desktop')) {
      test.skip();
    }
    await page.goto('/');

    // Open mobile menu (avoid accessibility FAB button) and wait drawer
    await page.getByRole('button', { name: 'Open navigation menu' }).click({ force: true });
    await page.locator('#mobile-navigation').waitFor({ state: 'visible' });
    await page.locator('#mobile-navigation').getByRole('button', { name: /pricing/i }).click({ force: true });

    // pricing should be in viewport
    const pricing = page.locator('section#pricing').first();
    await expect(pricing).toBeVisible();

    // open menu again and go to faq
    await page.getByRole('button', { name: 'Open navigation menu' }).click({ force: true });
    await page.locator('#mobile-navigation').waitFor({ state: 'visible' });
    await page.locator('#mobile-navigation').getByRole('button', { name: /faq/i }).click({ force: true });
    const faq = page.locator('#faq');
    await expect(faq).toBeVisible();
  });

  test('hero CTA scrolls to form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /contact|contato|form/i }).first().click();
    const form = page.locator('#form');
    await expect(form).toBeVisible();
  });
});


