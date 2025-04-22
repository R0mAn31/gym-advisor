/**
 * Jest configuration for unit tests
 */

const { PASSING_TESTS } = require('./testgroups');

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: PASSING_TESTS.map(pattern => `<rootDir>/${pattern}`),
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    'firebase/auth': '<rootDir>/__mocks__/firebase-auth.js',
    'firebase/firestore': '<rootDir>/__mocks__/firebase-firestore.js',
    'firebase/storage': '<rootDir>/__mocks__/firebase-storage.js',
    '@mui/material': '<rootDir>/__mocks__/@mui/material.js',
    '@mui/icons-material': '<rootDir>/__mocks__/@mui/icons-material.js',
    '@tinymce/tinymce-react': '<rootDir>/__mocks__/@tinymce/tinymce-react.js',
    'mammoth': '<rootDir>/__mocks__/mammoth.js',
    'react-dropzone': '<rootDir>/__mocks__/react-dropzone.js',
    'react-leaflet': '<rootDir>/__mocks__/react-leaflet.js',
    '../../../../frontend/src/components/posts/PostCard': '<rootDir>/components/posts/__mocks__/PostCard.js',
    '../../contexts/AuthContext': '<rootDir>/__mocks__/AuthContext.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'frontend/src/**/*.{js,jsx}',
    '!frontend/src/index.js',
    '!frontend/src/reportWebVitals.js',
    '!**/node_modules/**'
  ],
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 30000,
  maxWorkers: 2
}; 