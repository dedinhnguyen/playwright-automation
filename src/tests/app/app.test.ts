import { test, expect } from '@playwright/test';
import { ElectronBase } from '@core/app/ElectronBase';

test.describe('Electron Desktop App Tests', () => {
  let electronBase: ElectronBase;

  test.beforeAll(async () => {
    electronBase = new ElectronBase();
  });

  test('Launch and Verify Desktop App', async () => {
    test.skip(!process.env.ELECTRON_APP_PATH, 'ELECTRON_APP_PATH not set');
    
    const page = await electronBase.launchApp(process.env.ELECTRON_APP_PATH!);
    await expect(page).toHaveTitle(/Your App Title/);
    
    await electronBase.closeApp();
  });
});
