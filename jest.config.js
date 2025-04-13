export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)'
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.css\\?inline$': '<rootDir>/mocks/styleMock.js',
    // Handle CSS imports (without CSS modules)
    '\\.css$': '<rootDir>/mocks/styleMock.js'
  }
};
