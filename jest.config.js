import * as fs from 'fs';
import { pathsToModuleNameMapper } from 'ts-jest';

const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json'));
const paths = tsconfig.compilerOptions.paths;

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src/' }),
};

export default config;