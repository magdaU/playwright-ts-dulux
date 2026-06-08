# Test Strategy — Dulux E2E (Playwright + TypeScript)

## 1. Objective

Provide automated end-to-end coverage of the customer-facing journeys on
[dulux.co.uk](https://www.dulux.co.uk) that carry the highest business risk — finding a colour, buying a
tester, and previewing a shade with the Visualizer App — across both desktop and mobile, running on every
change and reporting results in a way that's easy to consume (Allure + GitHub Pages).

This is a UI-driven E2E suite against the **live production site**. It is not a substitute for unit/integration
tests owned by the application teams; it exists to catch regressions in critical customer journeys from the
outside, the way a real user would experience them.

## 2. Scope

### In scope
- Critical shopping journeys: colour discovery → tester purchase → basket
- Cross-device behaviour: desktop (1920×1080) vs. mobile (Pixel 7 viewport) navigation and layout differences
- Third-party/embedded experiences reachable from the site (e.g. the Visualizer App opening in a new tab)
- Cookie-consent and basic alert/notification handling that gates the rest of the journey

### Out of scope
- Visual regression / pixel-diff testing (screenshots are captured for evidence, not compared)
- Performance, load, accessibility (a11y) and security testing
- Payment/checkout completion (no real transactions are performed against production)
- API-level/contract testing of Dulux's backend services
- Cross-browser matrix beyond Chromium (see [§5](#5-environments--coverage))

## 3. Test levels & types

| Level | What it covers | Where it lives |
|---|---|---|
| E2E UI tests | Full user journeys through the real site, asserting on visible outcomes (basket contents, navigation, page transitions) | `tests/specs/**/*.spec.ts` |
| Smoke (`@smoke`) | The smallest set of tests that prove the core journey still works — run first, fail fast | tagged subset of the above |
| Regression (`@regression`) | The full suite for a feature area, run on every push/PR to `main` | tagged subset of the above |

Tests are **not** split by "unit/integration/E2E" within this repo — this repo *is* the E2E layer. Granularity
is instead expressed through tags (see [§4](#4-tagging--execution-strategy)) so the same suite can be run at
different depths depending on context (fast feedback in PRs vs. full regression on `main`).

## 4. Tagging & execution strategy

Tests are tagged at the `describe`/`test` level (mirrors the `@Epic`/`@Feature`/`@Story` structure used in the
original Cucumber/Java version of this suite, simplified to flat tags for the native Playwright runner):

| Tag | Meaning | Example use |
|---|---|---|
| `@smoke` | Must-pass, fastest-signal subset | Run on every push for quick feedback |
| `@regression` | Full suite for a feature area | Run on `main` / before release |
| `@desktop` / `@mobile` | Viewport-specific scenarios | Target a specific device class |
| `@purchase`, `@visualizer` | Feature-area grouping | Run only the tests relevant to a change |

Execution is filtered with `--grep`:

```bash
npm run test:smoke      # @smoke only — fast feedback
npm test                # full suite, both desktop-chrome and mobile-chrome projects
npx playwright test --grep "@purchase"
```

Playwright **projects** (`desktop-chrome`, `mobile-chrome`) carry the viewport/device configuration, and each
project's `grep`/`grepInvert` ensures a desktop-tagged test only runs in the desktop project and a
mobile-tagged test only in the mobile project — avoiding duplicate, meaningless runs (e.g. a "mobile hamburger
menu" scenario executing at 1920×1080).

## 5. Environments & coverage

- **Target environment:** production (`https://www.dulux.co.uk`) — there is no dedicated staging environment
  available to this suite, so tests are written to be resilient to real content (fixed colour/shade names that
  are stable catalogue entries, not seasonal promotions).
- **Browser:** Chromium only, via two device profiles:
  - `desktop-chrome` — 1920×1080 viewport
  - `mobile-chrome` — Pixel 7 emulation
  
  Firefox/WebKit are not currently part of the matrix; this can be extended by adding projects in
  `playwright.config.ts` if cross-browser risk becomes material.
- **Network conditions:** default (no throttling). Not currently in scope.

## 6. Test design approach

- **Page Object Model (POM):** all interactions and locators live in `tests/pages/` (page-level objects:
  `HomePage`, `ColorSelectionPage`, `CartPage`) and `tests/components/` (cross-page UI fragments:
  `NavigationComponent`, `AlertComponent`). Specs read as a sequence of business actions and assertions, not
  raw selectors.
- **Fixtures over setup boilerplate:** `tests/fixtures.ts` extends Playwright's `test` to inject ready-to-use
  page objects (`homePage`, `cartPage`, `navigation`, …) per test, replacing the manual `BaseTest` /
  `createSetup()` pattern from the original Java suite with Playwright-native dependency injection.
- **User-facing locators first:** `getByRole`, `getByLabel`, `getByText` are preferred over CSS/XPath so tests
  track what a user perceives (and stay stable across markup refactors on the Dulux side).
- **Arrange / Act / Assert:** each test is structured as GIVEN (state setup, e.g. empty basket) → WHEN
  (the journey under test) → THEN (observable outcome + evidence screenshot).

## 7. Test data

- Catalogue data (colour family "Violet", shade "Gentle Lavender", product name "Dulux Colour Tester") is
  treated as **stable reference data** — chosen because it represents an evergreen part of the Dulux colour
  range rather than a seasonal/promotional item likely to disappear.
- No user accounts, payment details or persisted state are required; each test starts from a clean
  `BrowserContext` (no shared cookies/storage between tests) and explicitly drives the basket to a known
  empty state before asserting on it.
- Because this runs against production, tests **do not complete checkout** — they assert on basket state, not
  on order confirmation, to avoid creating real orders.

## 8. Reporting & evidence

- **Playwright HTML report** — generated every run (`playwright-report/`), with trace/video/screenshot capture
  on failure (`trace: on-first-retry`, `screenshot: only-on-failure`, `video: retain-on-failure`) for fast
  failure diagnosis.
- **Allure report** — richer, stakeholder-friendly reporting (history, severities, suites, timeline) generated
  via `allure-playwright` + `allure-commandline`. Published automatically to **GitHub Pages** on every push to
  `main`:
  [![View Allure Report](https://img.shields.io/badge/Allure%20Report-View%20latest%20results-orange?logo=qameta&logoColor=white)](https://magdau.github.io/playwright-ts-dulux/)
- **Manual evidence** — each journey captures a timestamped screenshot of its final state (e.g. the basket) to
  `screenshots/`, useful for quick visual sanity checks alongside the automated assertions.

## 9. CI/CD integration

GitHub Actions (`.github/workflows/e2e-tests.yml`) runs the suite:
- on every push to `main`, `feature/**`, `fix/**`, and on PRs into `main` — full `@regression` suite by
  default, so both desktop and mobile journeys are exercised before/at merge time;
- on demand via `workflow_dispatch`, with a configurable `grep` input (defaults to `@regression`, can be
  narrowed to `@smoke`, `@desktop`, etc.) for targeted re-runs;
- always uploads the Playwright report and raw Allure results as build artifacts (kept 7 days) regardless of
  pass/fail, so failures are diagnosable without re-running locally;
- on `main`, additionally builds and publishes the Allure HTML report to GitHub Pages.

Retries (`retries: 2` in CI) absorb transient flakiness from testing against a live, uncontrolled production
site without masking genuine regressions — a test that only passes on retry still surfaces in the report as
flaky, not silently green.

## 10. Risk-based prioritisation

Coverage is prioritised by **business impact × likelihood of breakage**:

1. **Highest:** the purchase journey (`@purchase`) — directly tied to revenue; tagged `@smoke` on desktop so
   it's the first thing that runs and the first signal if something is fundamentally broken.
2. **High:** cross-device navigation differences (hamburger menu vs. top nav) — a common source of regressions
   when the site ships responsive layout changes.
3. **Medium:** the Visualizer experience (`@visualizer`) — an engagement/discovery feature, not a transactional
   one; covers both the "works" (desktop, opens in new tab) and "gracefully degrades" (mobile, shows a support
   message) paths.

This ordering also drives what `@smoke` contains: the minimum set of tests that, if they fail, justify treating
the site as broken and stopping further investigation until fixed.

## 11. Maintenance & flakiness handling

- **Resilient locators:** role/label/text-based locators reduce breakage from CSS/markup churn on a site this
  suite doesn't control.
- **Explicit waits over sleeps:** `waitForLoadState()` / Playwright's auto-waiting is used at known
  navigation boundaries (e.g. after `clickDropdownFindColour()`, which triggers a real page navigation rather
  than a dropdown — a subtlety captured in a code comment so it isn't "fixed" away by mistake).
- **Isolation:** every test gets its own `BrowserContext`/`page` via fixtures — no cross-test state leakage.
- **CI retries + trace/video on failure** turn intermittent production noise into actionable evidence rather
  than red herrings or silent flakiness.

## 12. Future improvements

- Port the Visualizer App journey (`@visualizer`) from the original Java/Cucumber suite — it's referenced in
  this strategy as a known feature area but not yet implemented as Playwright specs.
- Add a Firefox/WebKit project if cross-browser risk is identified as material.
- Consider visual regression checks (e.g. `toHaveScreenshot`) for high-traffic landing/colour-selection pages.
- Track flaky-test trends via Allure history once the suite has run enough times on `main` to build a baseline.