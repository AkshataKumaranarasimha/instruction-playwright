import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import fs from 'fs';
import { env } from '../../config/env';
import { GoogleHomePage } from '../pages/google-home.page';
import { GoogleResultsPage } from '../pages/google-results.page';
import { SmokeHomePage } from '../pages/smoke-home.page';

type Fixtures = {
  googleHome: GoogleHomePage;
  googleResults: GoogleResultsPage;
  smokeHome: SmokeHomePage;
  context: BrowserContext;
  page: Page;
};

type LaunchOptions = {
  headless: boolean;
  slowMo: number;
  channel?: string;
  args: string[];
};

function launchOptions(): LaunchOptions {
  const options: LaunchOptions = {
    headless: env.headless,
    slowMo: env.slowMo,
    args: ['--disable-blink-features=AutomationControlled'],
  };
  if (env.browserChannel) {
    options.channel = env.browserChannel;
  }
  return options;
}

/**
 * Shared fixtures — inject page objects into specs without re-wiring.
 * Persistent Chrome profile is optional (helps Google locally; off in CI).
 */
export const test = base.extend<Fixtures>({
  context: async ({}, use) => {
    const options = launchOptions();

    if (env.usePersistentProfile) {
      fs.mkdirSync(env.persistentProfileDir, { recursive: true });
      const context = await chromium.launchPersistentContext(env.persistentProfileDir, {
        ...options,
        locale: 'en-US',
        viewport: { width: 1280, height: 720 },
      });
      await use(context);
      await context.close();
      return;
    }

    const browser = await chromium.launch(options);
    const context = await browser.newContext({
      locale: 'en-US',
      viewport: { width: 1280, height: 720 },
    });
    await use(context);
    await context.close();
    await browser.close();
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
  smokeHome: async ({ page }, use) => {
    await use(new SmokeHomePage(page));
  },
});

export { expect } from '@playwright/test';
