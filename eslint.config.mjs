import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'reports/**',
      '.auth/**',
      'fixtures/smoke/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Playwright requires `async ({}, use)` when a fixture depends on nothing.
    files: ['src/fixtures/**/*.ts', 'src/core/test.base.ts'],
    rules: {
      'no-empty-pattern': 'off',
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions live in flows/assertion helpers called from thin specs.
      'playwright/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect', 'assert*', 'runGoogleSearch', 'runSmokeSearch', 'run*'],
        },
      ],
    },
  },
  prettier,
);
