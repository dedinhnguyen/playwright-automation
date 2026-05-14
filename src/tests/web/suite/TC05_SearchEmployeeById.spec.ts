import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PIMPage } from '@pages/PIMPage';

test.describe('TC05 - Search Employee by ID', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let pimPage: PIMPage;
  const baseUrl = 'https://opensource-demo.orangehrmlive.com/';
  const credentials = { user: 'Admin', pass: 'admin123' };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage = new PIMPage(page);
    await page.goto(baseUrl);
    await loginPage.login(credentials.user, credentials.pass);
  });

  test.afterEach(async ({ page }) => {
    await test.step('Teardown: Return to Dashboard', async () => {
      await page.goto(`${baseUrl}web/index.php/dashboard/index`);
    });
  });

  test('Search existing employee by ID', async ({ page }) => {
    await dashboardPage.clickPIM();
    // Use an employee ID likely to be in the database, e.g., 0001
    await pimPage.searchEmployeeById('0001');
    
    // Wait for network response after search
    const searchResponse = await page.waitForResponse(
      response => response.url().includes('/api/v2/pim/employees?') && response.request().method() === 'GET'
    );
    expect(searchResponse.ok()).toBeTruthy();
  });
});
