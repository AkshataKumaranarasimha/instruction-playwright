import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

const channel = env.browserChannel || undefined;

export default defineConfig({
  testDir: './tests',
  // Persistent Chrome profile is shared when enabled — keep serial.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: env.timeouts.test,
  expect: { timeout: env.timeouts.expect },
  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'en-US',
  },
  webServer: {
    command: 'node scripts/smoke-server.mjs',
    url: env.smokeBaseURL,
    reuseExistingServer: !env.isCi,
    timeout: 30_000,
  },
  projects: [
    {
      name: channel ? 'chrome' : 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(channel ? { channel } : {}),
      },
    },
  ],
});
