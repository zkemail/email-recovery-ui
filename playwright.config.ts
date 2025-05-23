import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.ts',
  use: {
    headless: true,
    viewport: { width: 1280, height: 1720 },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'bun run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 120 seconds
  },
  retries: 1,
  timeout: 600000, // 10 minutes in milliseconds for all tests
  expect: {
    timeout: 60000, // 1 minute default timeout for expects (can be overridden for specific expects)
  },
  reporter: [['html'], ['list']],
}); 
