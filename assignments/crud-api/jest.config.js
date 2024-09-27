const config = {
  transform: {
    "\\.[jt]s?$": ["ts-jest", {
      "useESM": true
    }]
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  extensionsToTreatAsEsm: [".ts"],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
};

export default config;
