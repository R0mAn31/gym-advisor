# Gym Advisor Tests

This directory contains the test suites for the Gym Advisor application.

## Test Structure

- **unit/**: Unit tests for individual components and services
- **api/**: Tests for API endpoints
- **e2e/**: End-to-end tests for the application

## Running Tests

To run all tests:

```bash
npm test
```

To run specific test suites:

```bash
# Run just the frontend tests
npm run test:frontend

# Run just the API tests
npm run test:api

# Run just the unit tests
npm run test:unit
```

## Test Coverage

Test coverage reports can be found in the `coverage/` directory after running tests.

## Mocks

- Firebase services are mocked in `unit/__mocks__/firebase.js`
- File imports are mocked in `unit/__mocks__/fileMock.js`

## Adding Tests

When adding new tests, follow these patterns:

1. Place tests in the appropriate directory based on the type of test
2. Use descriptive test names that follow the "should..." pattern
3. Mock external dependencies
4. Follow the existing testing patterns for consistency 