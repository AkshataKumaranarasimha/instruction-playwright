import { type Locator } from '@playwright/test';
import { BasePage } from '../../core/base.page';
import { env } from '../../../config/env';

/**
 * Google search results page object.
 * Locators derived from Playwright MCP accessibility snapshots.
 */
export class GoogleResultsPage extends BasePage {
  readonly searchBox: Locator = this.page.getByRole('combobox', { name: 'Search' });
  readonly resultsHeading: Locator = this.page.getByRole('heading', {
    name: 'Search Results',
    level: 1,
  });
  readonly mainResults: Locator = this.page.getByRole('main');
  readonly resultHeadings: Locator = this.mainResults.getByRole('heading', {
    level: 3,
  });

  private get resultSignal(): Locator {
    return this.resultHeadings
      .first()
      .or(this.page.locator('#search a h3').first())
      .or(this.page.locator('#rso h3').first());
  }

  async waitForResults(query: string): Promise<void> {
    await this.page.waitForURL(
      (url) =>
        url.pathname === '/search' &&
        url.searchParams.get('q')?.includes(query) === true,
      { timeout: env.timeouts.navigation },
    );

    try {
      await this.resultSignal.waitFor({
        state: 'visible',
        timeout: env.timeouts.navigation,
      });
    } catch (error) {
      const body = await this.page.locator('body').innerText();
      if (/unusual traffic|not a robot|recaptcha/i.test(body)) {
        throw new Error(
          'Google served a bot-check / captcha page. Use headed Chrome with USE_PERSISTENT_PROFILE=true, or complete the captcha once in .auth/chrome-profile.',
        );
      }
      throw error;
    }
  }

  resultLink(name: string | RegExp): Locator {
    return this.mainResults
      .or(this.page.locator('#search, #rso'))
      .getByRole('link', { name });
  }

  resultHeading(name: string | RegExp): Locator {
    return this.mainResults
      .or(this.page.locator('#search, #rso'))
      .getByRole('heading', { name, level: 3 });
  }

  get contentScope(): Locator {
    return this.mainResults.or(this.page.locator('#search, #rso, body'));
  }
}
