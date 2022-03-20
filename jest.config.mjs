const defaultConfig = {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: [
    "text",
    "lcov",
  ],
  coverageThreshold: {
    global: {
      branch: 100,
      funcitons: 100,
      lines: 100,
      statements: 100
    }
  },
  maxWorkers: "50%",
  watchPathIgnorePatterns: [
    "node_modules"
  ],
  transformIgonerePatterns: [
    "node_modules"
  ]
}

export default {
  projects: [
    {
      ...defaultConfig,
      testEnvironment: "node",
      displayName: "backend",
      collectCoverageFrom: [
        "server/",
        "!server/index.js",
      ],
      transformIgonerePatterns: [
        ...defaultConfig.transformIgonerePatterns,
        "public"
      ],
      testMatch: [
        "**/test/**/server/**/*.test.js"
      ]
    },
    {
      ...defaultConfig,
      testEnvironment: "jsdom",
      displayName: "frontend",
      collectCoverageFrom: [
        "public/",
      ],
      transformIgonerePatterns: [
        ...defaultConfig.transformIgonerePatterns,
        "server"
      ],
      testMatch: [
        "**/test/**/public/**/*.test.js"
      ]
    }
  ]
}