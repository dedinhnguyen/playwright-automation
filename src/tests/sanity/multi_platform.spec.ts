import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('Multi-Platform Sanity Check', () => {
  test('Login and Dashboard Verification', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Navigate to OrangeHRM', async () => {
      await page.goto('https://opensource-demo.orangehrmlive.com/');
    });

    await test.step('Perform Login', async () => {
      await loginPage.login('Admin', 'admin123');
    });

    await test.step('Verify Dashboard Content', async () => {
      const header = await dashboardPage.getHeaderText();
      expect(header).toBe('Dashboard');
      
      // Platform-specific log
      const isMobile = test.info().project.name.toLowerCase().includes('mobile');
      console.log(`Running on ${isMobile ? 'Mobile' : 'Desktop'} platform`);
    });
  });
});
