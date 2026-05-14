import { _electron as electron, ElectronApplication, Page } from '@playwright/test';
import logger from '@utils/Logger';

export class ElectronBase {
  protected electronApp?: ElectronApplication;
  protected page?: Page;

  async launchApp(executablePath: string, args: string[] = []) {
    logger.info(`Launching Electron app from: ${executablePath}`);
    this.electronApp = await electron.launch({
      executablePath,
      args,
    });
    this.page = await this.electronApp.firstWindow();
    return this.page;
  }

  async closeApp() {
    logger.info('Closing Electron app');
    if (this.electronApp) {
      await this.electronApp.close();
    }
  }

  async getMainWindow(): Promise<Page> {
    if (!this.page) {
      throw new Error('App not launched or window not found');
    }
    return this.page;
  }
}
