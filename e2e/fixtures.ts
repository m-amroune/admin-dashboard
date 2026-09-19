import { execSync } from "node:child_process";

import { expect, test as base } from "@playwright/test";

type E2EFixtures = {
  resetDatabase: void;
};

export const test = base.extend<E2EFixtures>({
  resetDatabase: [
    async ({}, use) => {
      const seedCommand = process.env.CI
  ? "npm run db:e2e:seed:ci"
  : "npm run db:e2e:seed";

execSync(seedCommand, {
  stdio: "inherit",
});

      await use();
    },
    { auto: true },
  ],
});

export { expect };