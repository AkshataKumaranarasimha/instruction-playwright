import path from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: path.resolve(process.cwd(), '.env') });

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function num(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const isCi = bool(process.env.CI, false);

/**
 * Typed, environment-driven configuration (12-factor style).
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'local',
  isCi,
  baseURL: process.env.BASE_URL ?? 'https://www.google.com',
  smokeBaseURL: process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4173/',
  smokePort: num(process.env.SMOKE_PORT, 4173),
  /**
   * Browser channel. Empty string = Playwright Chromium (preferred in CI).
   * Defaults to system Chrome locally for Google demo realism.
   */
  browserChannel:
    process.env.BROWSER_CHANNEL !== undefined ? process.env.BROWSER_CHANNEL : isCi ? '' : 'chrome',
  // Default headless; set HEADLESS=false to watch the browser locally.
  headless: bool(process.env.HEADLESS, true),
  slowMo: num(process.env.SLOW_MO, 0),
  /** Persistent profile helps Google locally; off by default in CI. */
  usePersistentProfile: bool(process.env.USE_PERSISTENT_PROFILE, !isCi),
  persistentProfileDir: path.resolve(
    process.cwd(),
    process.env.PERSISTENT_PROFILE_DIR ?? '.auth/chrome-profile',
  ),
  timeouts: {
    action: num(process.env.ACTION_TIMEOUT, 15_000),
    navigation: num(process.env.NAVIGATION_TIMEOUT, 30_000),
    expect: num(process.env.EXPECT_TIMEOUT, 15_000),
    test: num(process.env.TEST_TIMEOUT, 60_000),
  },
} as const;

export type Env = typeof env;
