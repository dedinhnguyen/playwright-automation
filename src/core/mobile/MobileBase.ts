import { Page } from '@playwright/test';
import { BasePage } from '@core/web/BasePage';
import logger from '@utils/Logger';

export class MobileBase extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async swipeUp() {
    logger.info('Swiping up');
    await this.page.mouse.move(200, 500);
    await this.page.mouse.down();
    await this.page.mouse.move(200, 200, { steps: 5 });
    await this.page.mouse.up();
  }

  async swipeDown() {
    logger.info('Swiping down');
    await this.page.mouse.move(200, 200);
    await this.page.mouse.down();
    await this.page.mouse.move(200, 500, { steps: 5 });
    await this.page.mouse.up();
  }
}
