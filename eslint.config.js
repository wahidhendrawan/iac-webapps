import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Prevent console statements in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Prevent eval usage
      'no-eval': 'error',
      // Prevent implied eval
      'no-implied-eval': 'error',
      // Prevent new Function() constructor
      'no-new-func': 'error',
      // Strict mode
      'strict': ['error', 'never'],
      // Require const/let, disallow var
      'no-var': 'error',
      // Prefer const where let is not needed
      'prefer-const': 'error',
      // TypeScript-specific
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
])
