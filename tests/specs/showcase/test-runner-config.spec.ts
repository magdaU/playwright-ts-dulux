import { test, expect } from '../../fixtures';

// Demonstrates "Test Runner config" — the per-test/per-suite knobs Playwright
// Test exposes on top of the global settings in playwright.config.ts:
//  - test.setTimeout() overrides the timeout for a single slow test
//  - test.skip(condition, reason) skips conditionally, with a documented reason
//    that shows up in the report instead of a silent no-op
//  - expect.soft() collects every failing assertion instead of stopping at the
//    first one — handy when checking several independent details in one go
//  - testInfo.annotations attaches metadata that surfaces in the HTML/Allure
//    reports (e.g. a note on what a smoke-style check does and doesn't cover)
test.describe('Test runner config showcase', { tag: ['@showcase', '@regression', '@desktop'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('a slow check can opt into a longer per-test timeout', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(page.getByRole('button', { name: 'Find a colour' })).toBeVisible();
  });

  test('expensive checks can be skipped in CI with a documented reason', async ({ page }) => {
    test.skip(
      !!process.env.CI,
      'expensive check — run locally when investigating visual regressions, skipped in CI to keep the pipeline fast',
    );

    await expect(page.getByText('I have some colours in mind')).toBeVisible();
  });

  test('soft assertions report every failing check, not just the first', async ({ page }) => {
    await expect.soft(page.getByRole('button', { name: 'Find a colour' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Shopping Cart' })).toBeVisible();
    await expect.soft(page.getByText('I have some colours in mind')).toBeVisible();
  });

  test('annotations attach metadata visible in the HTML/Allure reports', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'note',
      description: 'Smoke-checks the homepage hero without running a full purchase journey',
    });

    await expect(page.getByRole('button', { name: 'Find a colour' })).toBeVisible();
  });
});