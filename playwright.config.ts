import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
 fullyParallel: false,
workers: 1,
retries: 0,

 use: {
  baseURL: "http://localhost:3001",
  trace: "on-first-retry",
},

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
  command: process.env.CI
    ? "npm run dev -- -p 3001"
    : "npx dotenv -e .env.e2e -- npm run dev -- -p 3001",
  url: "http://localhost:3001",
  reuseExistingServer: false,
},
});