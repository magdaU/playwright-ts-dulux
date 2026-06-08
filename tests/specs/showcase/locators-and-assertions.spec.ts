import { test, expect } from '../../fixtures';

// Demonstrates the locator strategies and assertion styles used throughout the
// suite, in isolation from a full purchase journey — handy as a quick reference
// for "how do I find X" / "how do I assert Y" without digging through page objects.
test.describe('Locators & assertions showcase', { tag: ['@showcase', '@regression', '@desktop'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('role-based locators identify elements by their accessible name', async ({ page }) => {
    // getByRole — the recommended, accessibility-first locator: matches how a
    // screen reader "sees" the page (role + accessible name) rather than markup.
    const findColour = page.getByRole('button', { name: 'Find a colour' });
    const shoppingCart = page.getByRole('link', { name: 'Shopping Cart' });

    await expect(findColour).toBeVisible();
    await expect(findColour).toBeEnabled();
    await expect(shoppingCart).toBeVisible();
  });

  test('text locators match visible copy on the page', async ({ page }) => {
    // getByText — finds an element by its rendered text content, useful for
    // copy/links that don't carry a distinct role or label of their own.
    const callToAction = page.getByText('I have some colours in mind');

    await expect(callToAction).toBeVisible();
    await expect(callToAction).toHaveText('I have some colours in mind');
  });

  test('count assertions describe how many matches a locator has', async ({ page }) => {
    // The home page repeats some links/buttons (e.g. "Bathroom" appears in both
    // a hero card and a room-picker carousel) — toHaveCount documents that.
    const bathroomButtons = page.getByRole('button', { name: 'Bathroom', exact: true });
    const listItems = page.getByRole('listitem');

    await expect(bathroomButtons).toHaveCount(2);
    await expect(listItems).not.toHaveCount(0);
  });

  test('navigating updates the page URL and title', async ({ page, navigation }) => {
    await navigation.clickDropdownFindColour();

    // Page-level assertions auto-retry until the navigation settles, instead of
    // reading `page.url()` / `page.title()` once and racing the navigation.
    await expect(page).toHaveURL(/colour-details/);
    await expect(page).toHaveTitle(/Find a colour/);
  });
});
