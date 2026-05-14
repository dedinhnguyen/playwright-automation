import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('TC01 - Login', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const baseUrl = 'https://opensource-demo.orangehrmlive.com/';
  const credentials = { user: 'Admin', pass: 'admin123' };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto(baseUrl);
  });

  test.afterEach(async () => {
    await test.step('Teardown: Logout', async () => {
      await dashboardPage.logout();
    });
  });

  test('Successful Login', async ({ page }) => {
    await loginPage.login(credentials.user, credentials.pass);
    const headerText = await dashboardPage.getHeaderText();
    expect(headerText).toContain('Dashboard');
  });
});
