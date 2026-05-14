import { test, expect } from '@playwright/test';

test.describe('Mobile Emulation Tests', () => {
  test('Verify mobile layout on Playwright site', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check if the menu burger is visible (standard mobile pattern)
    const menuBurger = page.locator('.navbar__toggle');
    await expect(menuBurger).toBeVisible();
    
    await menuBurger.click();
    const sidebar = page.locator('.navbar-sidebar');
    await expect(sidebar).toBeVisible();
  });
});
