/**  @type {import('@jest/types').Config.ProjectConfig} */
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
};

export default config;
