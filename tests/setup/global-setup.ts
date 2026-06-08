import { chromium } from '@playwright/test';
import { BASE_URL, STORAGE_STATE_PATH } from '../constants';
import { HomePage } from '../pages/HomePage';

// Runs once before the whole suite. The cookie-consent decision is the same
// for every test, so we make it once here and persist it as storage state —
// every spec then starts already past the consent banner instead of clicking
// through it on every single run.
export default async function globalSetup(): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.rejectAllCookies();

  await context.storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}