import * as fs from 'fs';
import { pathsToModuleNameMapper } from 'ts-jest';

const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json'));
const paths = tsconfig.compilerOptions.paths;

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverageFrom: [
    'src/engine/**/*.ts',
    'src/game/**/*.ts',
    'src/utils/**/*.ts',
    '!src/**/index.ts',
    '!src/**/abstract.ts',
    '!src/**/types.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src/' }),
};

export default config;