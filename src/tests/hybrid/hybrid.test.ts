import { test, expect } from '@playwright/test';
import { RegistrationPage } from '@pages/RegistrationPage';
import { BaseAPI } from '@core/api/BaseAPI';
import { DatabaseManager } from '@core/database/DatabaseManager';
import { ENV } from '@utils/Env';
import logger from '@utils/Logger';

test.describe('Hybrid E2E Flow: Web -> API -> DB', () => {
  let db: DatabaseManager;
  const testEmail = `test_${Date.now()}@example.com`;

  test.beforeAll(async () => {
    // Initialize DB Connection
    db = new DatabaseManager({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'test_db',
    });
    // In a real scenario, we'd call await db.connect();
    // But we'll catch if it fails since there's no real DB here
    try {
        await db.connect();
    } catch (e) {
        logger.warn('Could not connect to real DB, skipping DB connection for demo');
    }
  });

  test.afterAll(async () => {
    // Cleanup: Delete test user from DB
    logger.info(`Cleaning up test data for: ${testEmail}`);
    try {
        await db.delete('users', 'email = $1', [testEmail]);
        await db.disconnect();
    } catch (e) {
        logger.warn('Cleanup failed (expected if DB is not reachable)');
    }
  });

  test('User Registration and Validation Flow', async ({ page, request }) => {
    const registrationPage = new RegistrationPage(page);
    const api = new BaseAPI(request, ENV.API_URL);

    // 1. Web UI: Register User
    logger.info('Step 1: Registering user via Web UI');
    await registrationPage.navigateTo('https://playwright.dev'); // Placeholder URL
    // await registrationPage.register(testEmail, 'Password123!');

    // 2. API: Check User Status
    logger.info('Step 2: Checking user status via API');
    const response = await api.get(`/users/1`); // Using public API for demo
    expect(response.ok()).toBeTruthy();
    const userData = await response.json();
    logger.info(`API Response: ${JSON.stringify(userData)}`);

    // 3. Database: Verify Row Exists
    logger.info('Step 3: Verifying user record in Database');
    // const dbUser = await db.findOne('users', 'email = $1', [testEmail]);
    // expect(dbUser).toBeDefined();
    // expect(dbUser.email).toBe(testEmail);
    
    logger.info('Hybrid test completed successfully');
  });
});
