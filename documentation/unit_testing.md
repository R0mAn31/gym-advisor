<!-- @format -->

# Gym Advisor - Unit Testing Guide

## 1. Setup and Configuration

### TC-001: Setting Up Test Environment

**Objective**: Understand how to set up the Jest testing environment
**Steps**:

1. Install required dependencies
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```
2. Configure Jest in jest.config.js
3. Set up test environment in setupTests.js
   **Expected Result**: Jest testing environment is properly configured

### TC-002: Running Unit Tests

**Objective**: Execute unit tests for the project
**Steps**:

1. Navigate to the project root directory
2. Run the test command
   ```bash
   npm test
   ```
   **Expected Result**: All tests execute and results are displayed in the console

### TC-003: Running Specific Test Files

**Objective**: Execute specific test files only
**Steps**:

1. Navigate to the project root directory
2. Run the test command with the file path
   ```bash
   npm test -- tests/unit/components/SimpleComponentTest.test.js
   ```
   **Expected Result**: Only the specified test file is executed

## 2. Basic Testing

### TC-004: Writing Simple Unit Tests

**Objective**: Create basic unit tests for utility functions
**Steps**:

1. Create a test file with .test.js extension
2. Import the function to be tested
3. Write test cases using Jest's test() or it() functions
4. Use expect() assertions to verify behavior
   **Expected Result**: Test cases accurately verify the function's behavior

### TC-005: Using Test Suites

**Objective**: Organize related tests into suites
**Steps**:

1. Use describe() to create a test suite
2. Add multiple test cases within the suite
3. Run the tests
   **Expected Result**: Tests are logically grouped and executed together

## 3. Component Testing

### TC-006: Testing React Components Rendering

**Objective**: Verify React components render correctly
**Steps**:

1. Import the component to be tested
2. Import render and screen from @testing-library/react
3. Render the component
4. Use screen queries to verify elements exist
   **Expected Result**: Component renders with expected elements

### TC-007: Testing Component Props

**Objective**: Verify components handle props correctly
**Steps**:

1. Import the component to be tested
2. Render the component with specific props
3. Verify component displays or uses props correctly
   **Expected Result**: Component correctly utilizes the provided props

### TC-008: Testing User Interactions

**Objective**: Verify component behavior when users interact with it
**Steps**:

1. Import userEvent from @testing-library/user-event
2. Render the component
3. Simulate user interactions (clicks, typing, etc.)
4. Verify component responds correctly
   **Expected Result**: Component behaves as expected when users interact with it

## 4. Service Testing

### TC-009: Testing API Service Functions

**Objective**: Verify service functions that interact with APIs
**Steps**:

1. Mock the fetch or axios function
2. Call the service function
3. Verify the function makes the correct API call
4. Verify the function correctly processes the response
   **Expected Result**: Service function behaves correctly with mocked API responses

### TC-010: Testing Authentication Services

**Objective**: Verify authentication-related functions
**Steps**:

1. Mock Firebase auth methods
2. Call authentication service functions
3. Verify correct interactions with Firebase
4. Verify correct handling of successful/failed authentication
   **Expected Result**: Authentication services function correctly

## 5. Context Testing

### TC-011: Testing React Context Providers

**Objective**: Verify context providers supply correct values
**Steps**:

1. Create a test component that uses the context
2. Render the test component wrapped in the context provider
3. Verify the component receives the expected context values
   **Expected Result**: Context provider supplies correct values to consumers

### TC-012: Testing Context State Updates

**Objective**: Verify context state updates correctly
**Steps**:

1. Create a test component that uses and updates context
2. Render the test component wrapped in the context provider
3. Trigger a state update
4. Verify the context state changes correctly
   **Expected Result**: Context state updates correctly when actions are dispatched

## 6. Advanced Testing

### TC-013: Testing Asynchronous Code

**Objective**: Verify async functions work correctly
**Steps**:

1. Use async/await in test functions
2. Mock any external services
3. Call the async function
4. Use await to wait for promises to resolve
5. Verify the function's behavior after resolution
   **Expected Result**: Asynchronous functions behave correctly

### TC-014: Testing Route Navigation

**Objective**: Verify routing functionality
**Steps**:

1. Mock React Router components and functions
2. Render the component that includes navigation
3. Trigger navigation actions
4. Verify routing functions are called with correct parameters
   **Expected Result**: Navigation occurs correctly with proper routes

### TC-015: Testing Form Submission

**Objective**: Verify form submission behavior
**Steps**:

1. Render the form component
2. Fill in form fields with test data
3. Submit the form
4. Verify form submission handler is called with correct data
5. Verify form validation and error handling
   **Expected Result**: Form processes submission correctly with proper validation

## 7. Mocking

### TC-016: Mocking External Services

**Objective**: Mock dependencies for isolated testing
**Steps**:

1. Create mock implementations in __mocks__ directory
2. Configure Jest to use mocks via moduleNameMapper
3. Write tests that rely on mocked dependencies
   **Expected Result**: Tests run with mocked dependencies instead of real ones

### TC-017: Using Jest Mock Functions

**Objective**: Create and verify mock function behavior
**Steps**:

1. Create mock functions using jest.fn()
2. Set up return values or implementations if needed
3. Pass mock functions as props or dependencies
4. Verify mock functions are called correctly
   **Expected Result**: Mock functions record calls and simulate expected behavior

## 8. Test Coverage

### TC-018: Running Coverage Reports

**Objective**: Generate and interpret test coverage reports
**Steps**:

1. Run tests with coverage enabled
   ```bash
   npm test -- --coverage
   ```
2. View the coverage report in console or browser
3. Identify code areas with insufficient coverage
   **Expected Result**: Coverage report shows percentage of code covered by tests

### TC-019: Improving Test Coverage

**Objective**: Enhance test coverage for the project
**Steps**:

1. Identify components or functions with low coverage
2. Write additional tests targeting uncovered code paths
3. Run coverage report again to verify improvement
   **Expected Result**: Test coverage percentage increases