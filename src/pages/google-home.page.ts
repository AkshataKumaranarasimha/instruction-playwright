import { type Locator, type Page } from '@playwright/test';

/**
 * Google homepage page object.
 * Locators derived from Playwright MCP accessibility snapshots.
 */
export class GoogleHomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly consentAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByRole('combobox', { name: 'Search' });
    this.searchButton = page.getByRole('button', { name: 'Google Search' });
    this.consentAcceptButton = page.getByRole('button', {
      name: /accept all|i agree|accept/i,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.google.com/', {
      waitUntil: 'domcontentloaded',
    });
    await this.dismissConsentIfPresent();
    await this.searchBox.waitFor({ state: 'visible' });
  }

  async dismissConsentIfPresent(): Promise<void> {
    try {
      await this.consentAcceptButton.first().click({ timeout: 2_000 });
    } catch {
      // Consent dialog not shown for this locale/session.
    }
  }

  async search(query: string): Promise<void> {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
  }
}
