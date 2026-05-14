import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('TC09 - Navigation to PIM', () => {
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

  test.afterEach(async ({ page }) => {
    await test.step('Teardown: Return to Dashboard', async () => {
      await page.goto(`${baseUrl}web/index.php/dashboard/index`);
    });
  });

  test('Verify PIM Module URL', async ({ page }) => {
    await dashboardPage.clickPIM();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });
});
