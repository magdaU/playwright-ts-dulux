import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class AlertComponent extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async closeAlert(): Promise<void> {
    await this.page.getByRole('alert').getByRole('button').click();
  }
}