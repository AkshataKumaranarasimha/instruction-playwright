import { type Locator, type Page } from '@playwright/test';

/**
 * Google search results page object.
 * Locators derived from Playwright MCP accessibility snapshots.
 */
export class GoogleResultsPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly resultsHeading: Locator;
  readonly mainResults: Locator;
  readonly resultHeadings: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByRole('combobox', { name: 'Search' });
    this.resultsHeading = page.getByRole('heading', {
      name: 'Search Results',
      level: 1,
    });
    this.mainResults = page.getByRole('main');
    this.resultHeadings = this.mainResults.getByRole('heading', { level: 3 });
  }

  async waitForResults(query: string): Promise<void> {
    await this.page.waitForURL(
      (url) => url.pathname === '/search' && url.searchParams.get('q')?.includes(query) === true,
      { timeout: 30_000 },
    );

    // Prefer real result headings; "Search Results" is often a11y-only / hidden.
    const ready = this.resultHeadings
      .first()
      .or(this.page.locator('#search a h3').first())
      .or(this.page.locator('#rso h3').first());

    try {
      await ready.waitFor({ state: 'visible', timeout: 30_000 });
    } catch (error) {
      const body = await this.page.locator('body').innerText();
      if (/unusual traffic|not a robot|recaptcha/i.test(body)) {
        throw new Error(
          'Google served a bot-check / captcha page. Re-run headed with channel=chrome, or complete the captcha once in a persistent profile.',
          { cause: error },
        );
      }
      throw error;
    }
  }

  resultLink(name: string | RegExp): Locator {
    return this.mainResults.getByRole('link', { name });
  }

  resultHeading(name: string | RegExp): Locator {
    return this.mainResults.getByRole('heading', { name, level: 3 });
  }
}
