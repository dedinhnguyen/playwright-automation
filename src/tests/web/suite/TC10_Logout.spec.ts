import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('TC10 - Logout', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const baseUrl = 'https://opensource-demo.orangehrmlive.com/';
  const credentials = { user: 'Admin', pass: 'admin123' };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto(baseUrl);
    await loginPage.login(credentials.user, credentials.pass);
  });

  test.afterEach(async ({ context }) => {
    await test.step('Teardown: Clear cookies', async () => {
      // Just a safety measure, we are already logged out
      await context.clearCookies();
    });
  });

  test('User Logout Successfully', async ({ page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
  });
});
