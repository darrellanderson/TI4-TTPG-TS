/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/global/global.ts"],

  moduleNameMapper: {
    "^@tabletop-playground/api$": "ttpg-mock",
  },
};
