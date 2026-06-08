# Dulux E2E Tests — Playwright + TypeScript

End-to-end tests for [dulux.co.uk](https://www.dulux.co.uk) built with [Playwright Test](https://playwright.dev/) and TypeScript.

## Project structure

```
tests/
├── pages/            # Page objects (HomePage, ColorSelectionPage, CartPage, ...)
├── components/       # Shared UI components (NavigationComponent, AlertComponent)
├── fixtures.ts       # Custom Playwright test fixtures wiring page objects into tests
└── specs/            # Test specs grouped by feature area
```

## Getting started

```bash
npm install
npx playwright install --with-deps chromium
```

## Running tests

```bash
npm test                # run the full suite (desktop + mobile projects)
npm run test:headed     # run with a visible browser
npm run test:smoke      # run tests tagged @smoke
npm run test:desktop    # run only the desktop-chrome project
npm run test:mobile     # run only the mobile-chrome project
npm run report          # open the last Playwright HTML report
```

## Allure reporting

Test runs are also recorded as [Allure](https://allurereport.org/) results (via `allure-playwright`) for richer
reporting — history, severity, steps and attachments per test.

```bash
npm test                  # generates raw results into allure-results/
npm run allure:generate   # builds the static HTML report into allure-report/
npm run allure:open       # opens the generated report in a browser
npm run allure:serve      # generates and serves the report in one step
```

In CI, the Allure report is generated after every run, uploaded as a build artifact, and (on `main`) published to
GitHub Pages via the `gh-pages` branch. On push/PR, the workflow runs the full `@regression` suite (both the
desktop and mobile scenarios) by default — `workflow_dispatch` lets you target a narrower tag, e.g. `@smoke`,
via the `grep` input.

## Test cases

### Tester Product — add a colour tester to the basket
`tests/specs/purchase/tester-product.spec.ts` (`@purchase @regression`)

**Desktop — `@smoke @desktop`:** *desktop customer adds a tester to the basket via the colour finder*
1. Open the cart page and reject all cookies.
2. Verify the basket is empty.
3. Open the home page.
4. Open the "Find a colour" navigation item.
5. Click "Find a colour" to go to the colour finder.
6. Choose the colour family "Violet".
7. Choose the specific shade "Gentle Lavender".
8. Click "Buy a Tester in this colour".
9. Close the confirmation alert.
10. Open the shopping cart.
11. Verify the quantity field is visible and equals "1".
12. Verify the basket shows "Dulux Colour Tester" and the shade "Gentle Lavender".
13. Take a screenshot of the basket.

**Mobile — `@mobile`:** *mobile customer adds a tester to the basket via the hamburger menu*
1. Open the cart page and reject all cookies.
2. Verify the basket is empty.
3. Open the home page.
4. Open the hamburger menu.
5. Open the "Find a colour" navigation item.
6. Click "Find a colour" to go to the colour finder.
7. Choose the colour family "Violet".
8. Choose the specific shade "Gentle Lavender".
9. Click "Buy a Tester in this colour".
10. Close the confirmation alert.
11. Open the shopping cart.
12. Verify the quantity field is visible and equals "1".
13. Verify the basket shows "Dulux Colour Tester" and the shade "Gentle Lavender".
14. Take a screenshot of the basket.

## Tech stack

- [Playwright Test](https://playwright.dev/docs/intro) — test runner & browser automation
- TypeScript
- Page Object Model