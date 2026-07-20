import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import fs from 'fs';
import { env } from '../../config/env';
import { GoogleHomePage } from '../pages/google-home.page';
import { GoogleResultsPage } from '../pages/google-results.page';

type Fixtures = {
  googleHome: GoogleHomePage;
  googleResults: GoogleResultsPage;
  /** Persistent Chrome context — closer to Playwright MCP profile behavior */
  context: BrowserContext;
  page: Page;
};

/**
 * Shared fixtures — inject page objects into specs without re-wiring.
 * Uses a persistent Chrome profile to reduce Google bot interstitials.
 */
export const test = base.extend<Fixtures>({
  context: async ({}, use) => {
    fs.mkdirSync(env.persistentProfileDir, { recursive: true });
    const context = await chromium.launchPersistentContext(env.persistentProfileDir, {
      channel: env.browserChannel as 'chrome',
      headless: env.headless,
      locale: 'en-US',
      viewport: { width: 1280, height: 720 },
      slowMo: env.slowMo,
      args: ['--disable-blink-features=AutomationControlled'],
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? (await context.newPage());
    await use(page);
  },
  googleHome: async ({ page }, use) => {
    await use(new GoogleHomePage(page));
  },
  googleResults: async ({ page }, use) => {
    await use(new GoogleResultsPage(page));
  },
});

export { expect } from '@playwright/test';
