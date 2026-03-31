module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".test.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
}
