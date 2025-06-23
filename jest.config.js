// jest.config.js

import '@testing-library/jest-dom';
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // for CSS modules
  },
  transformIgnorePatterns: [
    'node_modules/(?!(YOUR_MODULE_TO_INCLUDE|another-esm-lib)/)', // optional
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // optional
};
beforeAll(() => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router Future Flag Warning')
    ) {
      return;
    }
    originalWarn(...args);
  };
});