import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

const FIND_A_COLOUR_MENU_ITEM = 'Find a colour';
const MENU_HAMBURGER = 'Menu';
const SHOPPING_CART = 'Shopping Cart';
const SEARCH_FIELD = 'search-field';
const SEARCH_BUTTON = 'Search';

export class NavigationComponent extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickDropdownFindColour(): Promise<void> {
    await this.page.getByRole('button', { name: FIND_A_COLOUR_MENU_ITEM }).click();
    // The button triggers a page navigation (not a dropdown). Wait for the new
    // page to load before proceeding — without this, the next click resolves
    // against the outgoing page and hits a stale element.
    await this.page.waitForLoadState();
  }

  async clickDropdownHamburgerMenu(): Promise<void> {
    await this.page.getByRole('button', { name: MENU_HAMBURGER }).click();
  }

  async clickFindColour(): Promise<void> {
    await this.page.getByRole('link', { name: FIND_A_COLOUR_MENU_ITEM }).click();
  }

  async openShoppingCart(): Promise<void> {
    await this.page.getByRole('link', { name: SHOPPING_CART }).click();
  }

  async clickSearch(): Promise<void> {
    await this.page.getByRole('button', { name: SEARCH_BUTTON }).click();
  }

  async searchForColour(colour: string): Promise<void> {
    const searchField = this.page.getByRole('textbox', { name: SEARCH_FIELD });
    await searchField.fill(colour);
    await searchField.press('Enter');
  }
}