import type { Config } from 'jest';
// @ts-ignore
import path from 'path'

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: "node",
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  clearMocks: true,
  roots: [path.join('<rootDir>', 'src')],
  // Mongodb-memory-server: https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners :
  globalSetup: path.join('<rootDir>', 'src', 'test', 'globalSetup.ts'),
  globalTeardown: path.join('<rootDir>', 'src', 'test', 'globalTeardown.ts'),
  setupFilesAfterEnv: [path.join('<rootDir>', 'src', 'test', 'setupFile.ts')],
};

export default config;
