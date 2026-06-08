import { test, expect } from '../../fixtures';

// Demonstrates two related Playwright features:
//
//  - Trace Viewer: `test.use({ trace: 'on' })` forces a full trace for every run
//    of this file (the project default is `on-first-retry` — fine for CI noise,
//    but too sparse when you actually want to *look* at a trace; must be set at
//    the top level of the file, since changing context options starts a new
//    worker). `test.step()` breaks each test into named, collapsible actions
//    that show up on the trace timeline, making the recording easy to read with
//    `npx playwright show-trace`.
//
//  - Parallel Tests: `test.describe.configure({ mode: 'parallel' })` marks these
//    independent tests as safe to run concurrently in the same file/worker — on
//    top of the project-wide `fullyParallel: true` default in playwright.config.ts.
test.use({ trace: 'on' });

test.describe('Trace Viewer & parallel tests showcase', { tag: ['@showcase', '@regression', '@desktop'] }, () => {
  test.describe.configure({ mode: 'parallel' });

  test('home page renders its main navigation', async ({ page, homePage }) => {
    await test.step('open the home page', async () => {
      await homePage.open();
    });

    await test.step('verify the "Find a colour" navigation is visible', async () => {
      await expect(page.getByRole('button', { name: 'Find a colour' })).toBeVisible();
    });
  });

  test('cart page renders an empty basket', async ({ cartPage }) => {
    await test.step('open the cart page', async () => {
      await cartPage.open();
    });

    await test.step('verify the basket is empty', async () => {
      await expect(cartPage.getBasketEmptyText()).toBeVisible();
    });
  });
});
