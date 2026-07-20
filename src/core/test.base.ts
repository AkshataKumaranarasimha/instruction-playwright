import { test as base } from '@playwright/test';

type StepFixtures = {
  /** Wrap actions in Playwright report steps for readable traces */
  step: <T>(title: string, body: () => Promise<T>) => Promise<T>;
};

export const test = base.extend<StepFixtures>({
  step: async ({}, use) => {
    await use(async (title, body) => base.step(title, body));
  },
});

export { expect } from '@playwright/test';
