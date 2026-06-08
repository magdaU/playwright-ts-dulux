# Dulux E2E Tests — Playwright + TypeScript

End-to-end tests for [dulux.co.uk](https://www.dulux.co.uk) built with [Playwright Test](https://playwright.dev/) and TypeScript.

[![View Allure Report](https://img.shields.io/badge/Allure%20Report-View%20latest%20results-orange?logo=qameta&logoColor=white)](https://magdau.github.io/playwright-ts-dulux/)

The project produces [Allure](https://allurereport.org/) test reports that are generated and published automatically
to **GitHub Pages** on every run on `main`. Click the badge above (or [this link](https://magdau.github.io/playwright-ts-dulux/))
to open the latest test results — no setup required.

See [TEST_STRATEGY.md](TEST_STRATEGY.md) for the approach behind this suite — scope, tagging, environments,
risk-based prioritisation, and what's intentionally out of scope.

## Project structure

```
tests/
├── pages/            # Page objects (HomePage, ColorSelectionPage, CartPage, ...)
├── components/       # Shared UI components (NavigationComponent, AlertComponent)
├── setup/            # Global setup (captures storageState once for the whole suite)
├── constants.ts      # Shared values (BASE_URL, storage state path)
├── fixtures.ts       # Custom Playwright test fixtures wiring page objects into tests
└── specs/
    ├── purchase/     # Tester-purchase journeys (UI, desktop + mobile)
    ├── setup/        # API-level precondition checks (no browser needed)
    └── showcase/     # Reference specs demonstrating locator/assertion strategies
```

## Getting started

```bash
npm install
npx playwright install --with-deps chromium
```

## Running tests

```bash
npm test                              # run the full suite (api + desktop + mobile projects)
npm run test:headed                   # run with a visible browser
npm run test:smoke                    # run tests tagged @smoke
npm run test:desktop                  # run only the desktop-chrome project
npm run test:mobile                   # run only the mobile-chrome project
npm run test:api                      # run only the API precondition checks (no browser)
npm run report                        # open the last Playwright HTML report
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

### Allure report on GitHub Pages

On every push to `main`, the CI workflow (`.github/workflows/e2e-tests.yml`):
1. runs the Playwright suite — the full `@regression` suite (both desktop and mobile scenarios) by default;
   `workflow_dispatch` lets you target a narrower tag (e.g. `@smoke`) via the `grep` input,
2. generates the Allure report from the results (`npm run allure:generate`),
3. uploads the raw `allure-results/` as a build artifact, and
4. publishes the generated `allure-report/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`,
   which GitHub Pages then serves at https://magdau.github.io/playwright-ts-dulux/

To view it: open the link above, or check the **Actions** tab → latest run on `main` → download the
`playwright-report` / `allure-results` artifacts to inspect locally.

To reproduce the same report locally:

```bash
npm test
npm run allure:generate
npm run allure:open      # or: npm run allure:serve
```

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

### Locators & assertions showcase
`tests/specs/showcase/locators-and-assertions.spec.ts` (`@showcase @regression @desktop`)

A reference suite (no purchase flow) that demonstrates the locator and assertion styles used across the project:
1. **Role-based locators** — find the "Find a colour" button and "Shopping Cart" link by their accessible role + name, and assert they're visible/enabled.
2. **Text locators** — find the "I have some colours in mind" call-to-action by its rendered text and assert its exact text content.
3. **Count assertions** — assert how many "Bathroom" buttons and list items appear on the page (`toHaveCount`).
4. **Page-level assertions** — navigate to the colour finder and assert the URL and title update (`toHaveURL`, `toHaveTitle`), auto-retrying until the navigation settles.

## Tech stack

- [Playwright Test](https://playwright.dev/docs/intro) — test runner & browser automation
- TypeScript
- Page Object Model
- [Allure Report](https://allurereport.org/) — test reporting (`allure-playwright`, `allure-commandline`)
- GitHub Actions CI + GitHub Pages — automated runs and published Allure reports

## Common Playwright building blocks — where they're used here

The table below maps the concepts that show up in most Playwright projects to where each one is actually
applied in this repo (or planned, if not yet implemented).

| Concept | Where it's applied | Notes |
|---|---|---|
| **Test runner** (Playwright Test — TS equivalent of JUnit/TestNG) | `playwright.config.ts`, every file in `tests/specs/**` | Native runner: `test.describe`, tagged `test()`, hooks via fixtures instead of `@BeforeEach`/`@AfterEach` |
| **Browser Contexts** | `tests/fixtures.ts` (each test gets an isolated `page`/context from Playwright Test), `playwright.config.ts` `projects` (`desktop-chrome` vs `mobile-chrome` carry distinct viewport/device contexts) | No shared cookies/storage between tests — each journey starts clean |
| **Storage State** | `tests/setup/global-setup.ts` + `playwright.config.ts` (`globalSetup`, `use.storageState`) | Cookie-consent is accepted **once** before the whole suite runs and persisted to `playwright/.auth/storage-state.json`; every test then starts already past the consent banner — no repeated `rejectAllCookies()` calls |
| **API Setup** | `tests/specs/setup/api-setup.spec.ts`, runs in its own `api` project (no browser) | Uses Playwright's `request` fixture / `APIRequestContext` to verify the home page and cart page respond with a 2xx **before** the full UI journey runs — a fast precondition check that doesn't need a browser |
| **Locators** | `tests/pages/*.ts`, `tests/components/*.ts`, showcased end-to-end in `tests/specs/showcase/locators-and-assertions.spec.ts` | Role/text-first locators: `getByRole`, `getByText`, plus `filter({ hasText })` and chaining (e.g. `ColorSelectionPage.openVisualizerApp()`) |
| **Assertions** | `tests/specs/purchase/tester-product.spec.ts`, `tests/specs/showcase/locators-and-assertions.spec.ts` | Web-first, auto-retrying assertions: `toBeVisible()`, `toBeEnabled()`, `toHaveText()`, `toHaveValue()`, `toHaveCount()`, and page-level `toHaveURL()` / `toHaveTitle()` |
| **Trace Viewer** | `playwright.config.ts` (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`) | Traces are captured on retry and uploaded as part of the Playwright HTML report in CI for failure diagnosis (`npx playwright show-trace`) |
| **Parallel Tests** | `playwright.config.ts` (`fullyParallel: true`, `workers: process.env.CI ? 2 : undefined`) | Desktop and mobile projects also run as independent, parallel jobs by default |

See [TEST_STRATEGY.md](TEST_STRATEGY.md) for the reasoning behind these choices.