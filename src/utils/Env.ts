import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://playwright.dev',
  API_URL: process.env.API_URL || 'https://jsonplaceholder.typicode.com',
  USER_NAME: process.env.USER_NAME || 'admin',
  PASSWORD: process.env.PASSWORD || 'password',
  ENVIRONMENT: process.env.ENVIRONMENT || 'qa',
};
