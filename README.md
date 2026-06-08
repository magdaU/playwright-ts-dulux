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
npm run report          # open the last HTML report
```

## Tech stack

- [Playwright Test](https://playwright.dev/docs/intro) — test runner & browser automation
- TypeScript
- Page Object Model