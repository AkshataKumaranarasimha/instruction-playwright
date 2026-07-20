import { type Page } from '@playwright/test';
import { SmokeHomePage } from '../pages/smoke-home.page';
import { assertSmokeResultLink, assertSmokeResultsLoaded } from '../assertions/smoke.assertions';

export type SmokeSearchOptions = {
  query: string;
  expectLink?: string | RegExp;
};

/**
 * End-to-end smoke search flow (local app — CI-safe).
 */
export async function runSmokeSearch(
  page: Page,
  options: SmokeSearchOptions,
): Promise<SmokeHomePage> {
  const home = new SmokeHomePage(page);
  await home.open();
  await home.search(options.query);

  const results = await assertSmokeResultsLoaded(page, options.query);

  if (options.expectLink) {
    await assertSmokeResultLink(results, options.expectLink);
  }

  return results;
}
