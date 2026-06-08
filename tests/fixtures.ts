import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ColorSelectionPage } from './pages/ColorSelectionPage';
import { CartPage } from './pages/CartPage';
import { NavigationComponent } from './components/NavigationComponent';
import { AlertComponent } from './components/AlertComponent';

type Pages = {
  homePage: HomePage;
  colorSelectionPage: ColorSelectionPage;
  cartPage: CartPage;
  navigation: NavigationComponent;
  alert: AlertComponent;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  colorSelectionPage: async ({ page }, use) => {
    await use(new ColorSelectionPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  navigation: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },
  alert: async ({ page }, use) => {
    await use(new AlertComponent(page));
  },
});

export { expect } from '@playwright/test';