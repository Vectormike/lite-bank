module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["dist"],
  testTimeout: 10000,
  setupFilesAfterEnv: ['jest-extended'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  //globalSetup: '<rootDir>/src/tests/globalSetup.ts',
  // globalTeardown: '<rootDir>/src/tests/globalTeardown.ts',
};