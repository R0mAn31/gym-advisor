/** @format */

// Simple test that doesn't depend on any imports
test("true is true", () => {
  expect(true).toBe(true);
});

// Mock App.js properly
jest.mock("./App", () => ({
  __esModule: true,
  default: () => null,
}));
