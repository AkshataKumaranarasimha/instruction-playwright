import { expect, type Page } from '@playwright/test';
import { GoogleResultsPage } from '../../pages/google/results.page';

/**
 * Domain assertions for Google search — reusable across specs.
 */
export async function assertSearchResultsLoaded(
  page: Page,
  query: string,
): Promise<GoogleResultsPage> {
  const results = new GoogleResultsPage(page);

  await expect(page).toHaveURL(
    new RegExp(`[?&]q=${encodeURIComponent(query)}`),
  );
  await expect(page).toHaveTitle(new RegExp(query, 'i'));

  const captcha = page.getByText(/unusual traffic|i'm not a robot/i);
  await expect(captcha, 'Google captcha should not appear').toHaveCount(0);

  await expect(results.resultHeadings.first().or(page.locator('#search a h3, #rso h3').first())).toBeVisible();
  await expect(page.locator('body')).toContainText(new RegExp(query, 'i'));

  return results;
}

export async function assertResultContains(
  results: GoogleResultsPage,
  text: string | RegExp,
): Promise<void> {
  await expect(results.contentScope.first()).toContainText(text);
}

export async function assertOfficialPlaywrightMcpResults(
  results: GoogleResultsPage,
): Promise<void> {
  await expect(
    results.resultHeading(/playwright mcp/i).first(),
  ).toBeVisible();

  await expect(
    results
      .resultLink(
        /playwright\.dev|github\.com\/microsoft\/playwright-mcp|microsoft\/playwright-mcp/i,
      )
      .first(),
  ).toBeVisible();
}
