import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
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
    baseURL: 'https://www.dulux.co.uk',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
      grepInvert: /@mobile/,
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      grep: /@mobile/,
    },
  ],
});