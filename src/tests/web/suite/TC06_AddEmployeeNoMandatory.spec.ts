import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PIMPage } from '@pages/PIMPage';

test.describe('TC06 - Add Employee Without Mandatory Fields', () => {
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

  test('Validation error appears when fields are missing', async ({ page }) => {
    await dashboardPage.clickPIM();
    await pimPage.clickAddEmployee();
    
    // Fill only middle name, leave first and last name empty
    await pimPage.fillEmployeeDetails('', 'QA', '', '');
    await pimPage.clickSave();
    
    // Verify that the required error message is displayed
    const errorMsg = page.locator('span.oxd-input-field-error-message').first();
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText('Required');
  });
});
