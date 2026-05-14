import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PIMPage } from '@pages/PIMPage';
import { BaseAPI } from '@core/api/BaseAPI';
import path from 'path';
import logger from '@utils/Logger';

test.describe('OrangeHRM E2E Test Suite', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let pimPage: PIMPage;
  let api: BaseAPI;
  let empNumber: number;

  const baseUrl = 'https://opensource-demo.orangehrmlive.com/';
  const credentials = { user: 'Admin', pass: 'admin123' };

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage = new PIMPage(page);
    api = new BaseAPI(request, baseUrl);

    await test.step('Step: Navigate to OrangeHRM', async () => {
      await page.goto(baseUrl);
    });
  });

  test.afterEach(async ({ page }) => {
    if (empNumber) {
      await test.step('Cleanup: Delete created employee via API', async () => {
        logger.info(`Cleaning up employee with internal ID: ${empNumber}`);
        // Use page.request to ensure session cookies are included
        const response = await page.request.delete(`${baseUrl}web/index.php/api/v2/pim/employees`, {
          data: { ids: [empNumber] }
        });
        
        if (!response.ok()) {
            logger.warn(`Cleanup failed with status: ${response.status()}`);
            const errorText = await response.text();
            logger.warn(`Error response: ${errorText}`);
        }
        expect(response.ok()).toBeTruthy();
        logger.info('Employee deleted successfully');
      });
    }
  });

  test('Scenario 1: Successful Login', async () => {
    await test.step('Step 1: Login with Admin credentials', async () => {
      await loginPage.login(credentials.user, credentials.pass);
    });

    await test.step('Step 2: Verify Dashboard header is visible', async () => {
      const headerText = await dashboardPage.getHeaderText();
      expect(headerText).toContain('Dashboard');
    });
  });

  test('Scenario 2: Hybrid Add Employee with API Interception', async ({ page }) => {
    const testData = {
      first: 'Playwright',
      middle: 'QA',
      last: 'Automation',
      id: `ID_${Date.now().toString().slice(-4)}`
    };

    await test.step('Step 1: Login to Application', async () => {
      await loginPage.login(credentials.user, credentials.pass);
    });

    await test.step('Step 2: Navigate to PIM Module', async () => {
      await dashboardPage.clickPIM();
      await pimPage.clickAddEmployee();
    });

    await test.step('Step 3: Add Employee via UI and Intercept API', async () => {
      await pimPage.fillEmployeeDetails(testData.first, testData.middle, testData.last, testData.id);
      
      const photoPath = path.resolve(__dirname, '../../utils/test-image.png');
      await pimPage.uploadPhoto(photoPath);

      // Start intercepting the Save request
      const saveResponsePromise = page.waitForResponse(
        response => response.url().includes('/api/v2/pim/employees') && response.request().method() === 'POST'
      );

      await pimPage.clickSave();

      const response = await saveResponsePromise;
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      logger.info(`Intercepted API Response: ${JSON.stringify(body)}`);
      
      // Verify payload in response
      expect(body.data.firstName).toBe(testData.first);
      expect(body.data.lastName).toBe(testData.last);
      
      // Capture internal employee number for cleanup
      empNumber = body.data.empNumber;
      logger.info(`Captured empNumber: ${empNumber}`);
    });

    await test.step('Step 4: Verify Success Toast or Redirect', async () => {
      await expect(page).toHaveURL(/viewPersonalDetails/);
    });
  });

  test('Scenario 3: Add Employee without Photo', async ({ page }) => {
    const testData = {
      first: 'NoPhoto',
      middle: 'QA',
      last: 'User',
      id: `ID_${Date.now().toString().slice(-4)}`
    };

    await test.step('Step 1: Login to Application', async () => {
      await loginPage.login(credentials.user, credentials.pass);
    });

    await test.step('Step 2: Navigate to PIM Module', async () => {
      await dashboardPage.clickPIM();
      await pimPage.clickAddEmployee();
    });

    await test.step('Step 3: Add Employee without Photo', async () => {
      await pimPage.fillEmployeeDetails(testData.first, testData.middle, testData.last, testData.id);
      
      const saveResponsePromise = page.waitForResponse(
        response => response.url().includes('/api/v2/pim/employees') && response.request().method() === 'POST'
      );

      await pimPage.clickSave();

      const response = await saveResponsePromise;
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      empNumber = body.data.empNumber;
    });

    await test.step('Step 4: Verify Success Redirect', async () => {
      await expect(page).toHaveURL(/viewPersonalDetails/);
    });
  });

  test('Scenario 4: User Logout', async ({ page }) => {
    await test.step('Step 1: Login to Application', async () => {
      await loginPage.login(credentials.user, credentials.pass);
    });

    await test.step('Step 2: Verify Dashboard header', async () => {
      const headerText = await dashboardPage.getHeaderText();
      expect(headerText).toContain('Dashboard');
    });

    await test.step('Step 3: Logout from Application', async () => {
      await dashboardPage.logout();
    });

    await test.step('Step 4: Verify login page is displayed', async () => {
      await expect(page).toHaveURL(/login/);
    });
  });
});
