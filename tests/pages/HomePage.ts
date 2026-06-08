import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

const REJECT_ALL = '#onetrust-reject-all-handler';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState();
  }

  async rejectAllCookies(): Promise<void> {
    await this.page.locator(REJECT_ALL).click();
  }
}