import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/utils/security.ts', 'src/utils/securityScanner.ts'],
      thresholds: {
        perFile: true,
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
});
