import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

const jestConfig = createJestConfig(config);

const finalJestConfig = async () => {
  const resolvedConfig = await jestConfig();

  resolvedConfig.transformIgnorePatterns = [
    "/node_modules/(?!@tanstack/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ];

  return resolvedConfig;
};

export default finalJestConfig;