import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PIMPage } from '@pages/PIMPage';
import { BaseAPI } from '@core/api/BaseAPI';
import logger from '@utils/Logger';

test.describe('TC03 - Add Employee', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let pimPage: PIMPage;
  let empNumber: number;
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
    if (empNumber) {
      await test.step('Teardown: Delete employee via API', async () => {
        logger.info(`Cleaning up employee: ${empNumber}`);
        const response = await page.request.delete(`${baseUrl}web/index.php/api/v2/pim/employees`, {
          data: { ids: [empNumber] }
        });
        expect(response.ok()).toBeTruthy();
      });
    }
  });

  test('Add Employee Successfully', async ({ page }) => {
    await dashboardPage.clickPIM();
    await pimPage.clickAddEmployee();
    
    const id = `ID_${Date.now().toString().slice(-4)}`;
    await pimPage.fillEmployeeDetails('Auto', 'Test', 'User', id);
    
    const saveResponsePromise = page.waitForResponse(
      response => response.url().includes('/api/v2/pim/employees') && response.request().method() === 'POST'
    );
    await pimPage.clickSave();
    
    const response = await saveResponsePromise;
    expect(response.status()).toBe(200);
    const body = await response.json();
    empNumber = body.data.empNumber;
    
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });
});
