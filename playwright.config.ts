import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, STORAGE_STATE_PATH } from './tests/constants';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  globalSetup: require.resolve('./tests/setup/global-setup'),
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: false,
    }],
  ],
  use: {
    baseURL: BASE_URL,
    storageState: STORAGE_STATE_PATH,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      // API checks need no browser/device emulation — they run as their own
      // project so they aren't duplicated across the desktop/mobile matrix.
      name: 'api',
      testMatch: '**/setup/**/*.spec.ts',
      use: { storageState: undefined },
    },
    {
      name: 'desktop-chrome',
      testIgnore: '**/setup/**',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
      grepInvert: /@mobile/,
    },
    {
      name: 'mobile-chrome',
      testIgnore: '**/setup/**',
      use: { ...devices['Pixel 7'] },
      grep: /@mobile/,
    },
  ],
});