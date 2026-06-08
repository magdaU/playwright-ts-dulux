import { test, expect } from '../../fixtures';

test.describe('Purchase a colour tester', { tag: ['@purchase', '@regression'] }, () => {
  const colourFamily = 'Violet';
  const shade = 'Gentle Lavender';

  test(
    'desktop customer adds a tester to the basket via the colour finder',
    { tag: ['@smoke', '@desktop'] },
    async ({ page, homePage, navigation, colorSelectionPage, cartPage, alert }) => {
      // GIVEN — cookie consent is already handled via storageState (see tests/setup/global-setup.ts)
      await cartPage.open();
      await expect(cartPage.getBasketEmptyText()).toBeVisible();

      // WHEN
      await homePage.open();
      await navigation.clickDropdownFindColour();
      await navigation.clickFindColour();
      await colorSelectionPage.chooseColour(colourFamily);
      await colorSelectionPage.chooseSpecificShade(shade);
      await colorSelectionPage.buyATester();
      await alert.closeAlert();
      await navigation.openShoppingCart();

      // THEN
      await expect(cartPage.getQuantity()).toBeVisible();
      await expect(cartPage.getQuantity()).toHaveValue('1');
      await expect(cartPage.findText('Dulux Colour Tester')).toBeVisible();
      await expect(cartPage.findText(shade)).toBeVisible();
      await page.screenshot({ path: `screenshots/tester-product/desktop-${Date.now()}.png` });
    },
  );

  test(
    'mobile customer adds a tester to the basket via the hamburger menu',
    { tag: ['@mobile'] },
    async ({ page, homePage, navigation, colorSelectionPage, cartPage, alert }) => {
      // GIVEN — cookie consent is already handled via storageState (see tests/setup/global-setup.ts)
      await cartPage.open();
      await expect(cartPage.getBasketEmptyText()).toBeVisible();

      // WHEN
      await homePage.open();
      await navigation.clickDropdownHamburgerMenu();
      await navigation.clickDropdownFindColour();
      await navigation.clickFindColour();
      await colorSelectionPage.chooseColour(colourFamily);
      await colorSelectionPage.chooseSpecificShade(shade);
      await colorSelectionPage.buyATester();
      await alert.closeAlert();
      await navigation.openShoppingCart();

      // THEN
      await expect(cartPage.getQuantity()).toBeVisible();
      await expect(cartPage.getQuantity()).toHaveValue('1');
      await expect(cartPage.findText('Dulux Colour Tester')).toBeVisible();
      await expect(cartPage.findText(shade)).toBeVisible();
      await page.screenshot({ path: `screenshots/tester-product/mobile-${Date.now()}.png` });
    },
  );
});