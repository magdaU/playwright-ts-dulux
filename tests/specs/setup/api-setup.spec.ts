import { test, expect } from '@playwright/test';

// Demonstrates "API setup": checking the journey's preconditions over HTTP via
// Playwright's built-in `request` fixture, instead of spinning up a full
// browser just to find out a page is down. Runs in its own `api` project
// (see playwright.config.ts) — no browser/device emulation required.
test.describe('API setup — precondition checks', { tag: ['@api', '@regression'] }, () => {
  test('home page responds before the UI journey runs', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/`);

    expect(response.ok(), `Expected ${baseURL}/ to respond with a 2xx status`).toBeTruthy();
  });

  test('cart page responds before the UI journey runs', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/en/store/cart`);

    expect(response.ok(), `Expected ${baseURL}/en/store/cart to respond with a 2xx status`).toBeTruthy();
  });
});