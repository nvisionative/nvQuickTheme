import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript recommended rules (no type-checking required)
  ...tseslint.configs.recommended,

  // Project-specific overrides
  {
    files: ['scripts/**/*.ts', '*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Enforce explicit return types on exported functions
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // Disallow floating (unawaited) promises
      '@typescript-eslint/no-floating-promises': 'error',

      // Disallow explicit `any` — use `unknown` instead
      '@typescript-eslint/no-explicit-any': 'error',

      // Warn on unused variables, but allow underscore-prefixed ones
      // (used in serve.ts middleware params: _req, _res)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Enforce consistent use of `import type` for type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Prefer nullish coalescing (??) over logical OR (||) for defaults
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',

      // Prefer optional chaining (?.) over manual null checks
      '@typescript-eslint/prefer-optional-chain': 'warn',
    },
  },

  // Files to ignore entirely
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'dist-scripts/**',
      'temp/**',
      'build/**',
    ],
  }
);
