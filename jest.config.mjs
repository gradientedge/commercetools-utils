const collectCoverage = !!process.env.CI;

export default {
  testEnvironment: "node",
  rootDir: "./src",
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["node_modules/", "dist/"],
  setupFilesAfterEnv: ["jest-matcher-specific-error"],
  collectCoverage,
  coverageDirectory: '../.coverage',
  coverageProvider: 'v8',
  verbose: true,
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            useESM: true,
            syntax: "typescript",
            tsx: false,
            decorators: true,
            dynamicImport: true
          }
        }
      }
    ]
  }
};
