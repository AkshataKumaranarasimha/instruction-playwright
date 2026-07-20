import { test } from '../src/fixtures/test';
import { runSmokeSearch } from '../src/flows/smoke-search.flow';
import { smokeSearchData } from '../data/smoke.search.data';

/**
 * Generated from: instructions/smoke-search.md
 * Local smoke app — used as the CI-safe UI gate (Google remains a demo).
 */
test.describe('Smoke search — local app', () => {
  test('opens smoke app, searches playwright-mcp, and asserts results', async ({ page }) => {
    await runSmokeSearch(page, { ...smokeSearchData.playwrightMcp });
  });
});
