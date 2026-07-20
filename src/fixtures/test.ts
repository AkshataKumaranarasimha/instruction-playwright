import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { GoogleHomePage } from '../pages/google-home.page';
import { GoogleResultsPage } from '../pages/google-results.page';

type Fixtures = {
  googleHome: GoogleHomePage;
  googleResults: GoogleResultsPage;
  /** Persistent Chrome context — closer to Playwright MCP profile behavior */
  context: BrowserContext;
  page: Page;
};

const profileDir = path.join(__dirname, '../../.auth', 'chrome-profile');

/**
 * Shared fixtures — inject page objects into specs without re-wiring.
 * Uses a persistent Chrome profile to reduce Google bot interstitials.
 */
export const test = base.extend<Fixtures>({
  context: async ({}, use) => {
    fs.mkdirSync(profileDir, { recursive: true });
    const context = await chromium.launchPersistentContext(profileDir, {
      channel: 'chrome',
      headless: !!process.env.CI,
      locale: 'en-US',
      viewport: { width: 1280, height: 720 },
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
