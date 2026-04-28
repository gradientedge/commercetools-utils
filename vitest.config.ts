import { defineConfig } from 'vitest/config'

const collectCoverage = !!process.env.CI

export default defineConfig({
  test: {
    root: './src',
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    reporters: ['default'],
    coverage: {
      enabled: collectCoverage,
      provider: 'v8',
      reportsDirectory: '../.coverage',
      reporter: ['lcov', 'text-summary'],
    },
  },
})
