import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

test.describe('TC02 - Invalid Login', () => {
  let loginPage: LoginPage;
  const baseUrl = 'https://opensource-demo.orangehrmlive.com/';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto(baseUrl);
  });

  test.afterEach(async ({ context }) => {
    await test.step('Teardown: Clear cookies', async () => {
      await context.clearCookies();
    });
  });

  test('Login fails with invalid credentials', async ({ page }) => {
    await loginPage.login('Admin', 'invalidPass123');
    // Verify login page is still displayed or error is shown
    await expect(page).toHaveURL(/login/);
  });
});
