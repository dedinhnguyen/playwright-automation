import { Page, Locator, expect, test } from '@playwright/test';
import logger from '@utils/Logger';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '') {
    await test.step(`Navigate to: ${path}`, async () => {
      logger.info(`Navigating to path: ${path}`);
      await this.page.goto(path);
    });
  }

  async click(locator: Locator, name: string) {
    await test.step(`Click: ${name}`, async () => {
      logger.info(`Clicking on ${name}`);
      await locator.click();
    });
  }

  async fill(locator: Locator, value: string, name: string) {
    await test.step(`Fill ${name} with: ${value}`, async () => {
      logger.info(`Filling ${name} with value: ${value}`);
      await locator.fill(value);
    });
  }

  async getText(locator: Locator): Promise<string> {
    const text = await locator.innerText();
    logger.info(`Text found: ${text}`);
    return text;
  }

  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async assertTitle(expectedTitle: string | RegExp) {
    await test.step(`Assert Title: ${expectedTitle}`, async () => {
      logger.info(`Asserting title matches: ${expectedTitle}`);
      await expect(this.page).toHaveTitle(expectedTitle);
    });
  }

  async takeScreenshot(name: string) {
    const screenshot = await this.page.screenshot();
    await test.info().attach(name, {
      body: screenshot,
      contentType: 'image/png',
    });
  }
}
