import { type Locator, type Page, expect } from '@playwright/test';
import { env } from '../../config/env';

/**
 * Industry-standard base page object.
 * All page objects extend this for shared navigation/wait helpers.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(
    pathOrUrl = '/',
    options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' },
  ): Promise<void> {
    const target = /^https?:\/\//.test(pathOrUrl)
      ? pathOrUrl
      : new URL(pathOrUrl, env.baseURL).toString();

    await this.page.goto(target, {
      waitUntil: options?.waitUntil ?? 'domcontentloaded',
      timeout: env.timeouts.navigation,
    });
  }

  async waitForVisible(locator: Locator, timeout = env.timeouts.action): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickIfVisible(locator: Locator, timeout = 2_000): Promise<boolean> {
    try {
      await locator.first().click({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  async expectTitle(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(pattern);
  }

  async expectUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }
}
