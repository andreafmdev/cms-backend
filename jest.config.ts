import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@module/(.*)$': '<rootDir>/modules/$1',
    '^@base/infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@userModule/(.*)$': '<rootDir>/modules/users/$1',
    '^@productCatalog/(.*)$': '<rootDir>/modules/productCatalog/$1',
    '^@authModule/(.*)$': '<rootDir>/modules/auth/$1',
    '^@healthModule/(.*)$': '<rootDir>/modules/healthCheck/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
