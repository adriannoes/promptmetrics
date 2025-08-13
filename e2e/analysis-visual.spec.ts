import { test, expect } from '@playwright/test';

test.describe('Analysis visual', () => {
  test('header and content snapshots', async ({ page }) => {
    // 1) Carrega a raiz para garantir que os listeners de demo-login foram registrados
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 2) Injeta sessão de demo no app via evento suportado por useDemoAuth
    await page.evaluate(() => {
      const user = { id: 'demo-user', email: 'demo@example.com' } as any;
      const session = { access_token: 'demo-token' } as any;
      window.dispatchEvent(new CustomEvent('demo-login', { detail: { user, session } }));
    });

    // 3) Navega para rota estável somente-dev que espelha /analysis
    await page.goto('/analysis-e2e?__e2e=1', { waitUntil: 'networkidle' });

    // Espera container principal confiável da página
    await expect(page.locator('[data-testid="analysis-container"]')).toBeVisible({ timeout: 20000 });

    // Header: deve exibir marca e ações (Export / Sign out)
    await expect(page.getByRole('heading', { name: 'PromptMetrics' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export Report/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign out|Sair/i })).toBeVisible();

    // Snapshot do topo (header/nav)
    await expect(page).toHaveScreenshot('analysis-header.png', { fullPage: false });

    // Conteúdo: dashboard (quando houver dados) ou grid de empty state
    const hasDashboard = await page.locator('[data-testid="analysis-dashboard"]').count();
    const hasGrid = await page.locator('[data-testid="analysis-grid"]').count();

    if (hasDashboard) {
      await expect(page.locator('[data-testid="analysis-dashboard"]')).toBeVisible();
      await expect(page).toHaveScreenshot('analysis-dashboard.png', { fullPage: false });
    } else if (hasGrid) {
      await expect(page.locator('[data-testid="analysis-grid"]')).toBeVisible();
      await expect(page).toHaveScreenshot('analysis-grid.png', { fullPage: false });
    }
  });
});


