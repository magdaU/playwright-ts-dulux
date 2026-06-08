import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

const BUY_A_TESTER_TEXT = 'Buy a Tester in this colour';
const VISUALIZER_APP_TEXT = 'Try our Visualizer App';

export class ColorSelectionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async chooseColour(colour: string): Promise<void> {
    await this.page.getByRole('button', { name: colour }).click();
  }

  async chooseSpecificShade(shade: string): Promise<void> {
    await this.page.getByRole('button', { name: shade }).click();
  }

  async buyATester(): Promise<void> {
    await this.page.getByRole('button', { name: BUY_A_TESTER_TEXT }).click();
  }

  async openVisualizerApp(): Promise<void> {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: VISUALIZER_APP_TEXT })
      .getByRole('link')
      .click();
  }
}