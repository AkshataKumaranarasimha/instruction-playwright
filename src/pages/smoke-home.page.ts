import { type Locator, type Page } from '@playwright/test';
import { env } from '../../config/env';

/**
 * Local smoke-app home page (CI-safe demo target).
 */
export class SmokeHomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly resultsHeading: Locator;
  readonly resultLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', {
      name: 'Instruction Playwright Smoke',
      level: 1,
    });
    this.searchBox = page.getByRole('searchbox', { name: 'Search' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resultsHeading = page.getByRole('heading', { name: 'Results', level: 2 });
    this.resultLinks = page.getByRole('main').getByRole('link');
  }

  async open(): Promise<void> {
    await this.page.goto(env.smokeBaseURL, { waitUntil: 'domcontentloaded' });
    await this.heading.waitFor({ state: 'visible' });
    await this.searchBox.waitFor({ state: 'visible' });
  }

  async search(query: string): Promise<void> {
    await this.searchBox.fill(query);
    await this.searchButton.click();
  }

  resultLink(name: string | RegExp): Locator {
    return this.page.getByRole('main').getByRole('link', { name });
  }
}
