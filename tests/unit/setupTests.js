/**
 * Jest setup file
 */

import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
Object.defineProperty(window, 'location', {
  configurable: true,
  value: {
    href: '',
    pathname: '',
    search: '',
    hash: '',
    reload: jest.fn(),
    replace: jest.fn(),
    assign: jest.fn(),
  },
});

// Mock for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Polyfill for TextEncoder/TextDecoder which are needed for React Router
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder; 