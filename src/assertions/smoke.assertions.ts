import { expect, type Page } from '@playwright/test';
import { SmokeHomePage } from '../pages/smoke-home.page';

/**
 * Assertions for the local smoke search app.
 */
export async function assertSmokeResultsLoaded(page: Page, query: string): Promise<SmokeHomePage> {
  const home = new SmokeHomePage(page);

  await expect(page).toHaveURL(new RegExp(`[?&]q=${encodeURIComponent(query)}`));
  await expect(page).toHaveTitle(new RegExp(query, 'i'));
  await expect(home.resultsHeading).toBeVisible();
  await expect(home.resultLinks.first()).toBeVisible();

  return home;
}

export async function assertSmokeResultLink(
  home: SmokeHomePage,
  name: string | RegExp,
): Promise<void> {
  await expect(home.resultLink(name).first()).toBeVisible();
}
