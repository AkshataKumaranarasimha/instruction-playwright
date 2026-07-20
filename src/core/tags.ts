/** Shared suite tags for filtering: npx playwright test --grep @smoke */
export const Tag = {
  Smoke: '@smoke',
  Regression: '@regression',
  E2E: '@e2e',
  Google: '@google',
  Critical: '@critical',
} as const;

export type TagName = (typeof Tag)[keyof typeof Tag];
