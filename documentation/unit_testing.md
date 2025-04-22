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

## 9. Implemented Tests Overview

The following section documents the 60 tests currently implemented in the project:

### Authentication Service Tests (11 tests)

These tests verify that authentication services interact correctly with Firebase Authentication:

1. **Sign in with valid credentials**: Verifies users can sign in with correct email/password
2. **Handle invalid credentials**: Checks appropriate errors are thrown for invalid credentials
3. **User account creation**: Tests that new user accounts can be created successfully
4. **Handle duplicate email**: Ensures errors are thrown when registering with existing email
5. **User sign out**: Verifies sign out functionality works correctly
6. **Get current user**: Checks that the currently authenticated user can be retrieved
7. **Handle no authenticated user**: Ensures null is returned when no user is signed in
8. **Update user profile**: Tests that user profile information can be updated
9. **Handle missing user for profile update**: Verifies error is thrown when no user is provided
10. **Password reset email**: Tests sending password reset emails to existing users
11. **Handle password reset for non-existent user**: Ensures error is thrown for invalid users

### Database Service Tests (6 tests)

These tests verify that database service functions interact correctly with Firestore:

1. **Fetch document by ID**: Tests retrieving a document by its ID from a collection
2. **Handle non-existent document**: Ensures null is returned for documents that don't exist
3. **Add new document**: Tests adding new documents to a collection
4. **Update existing document**: Verifies existing documents can be updated
5. **Delete document**: Tests deleting documents from a collection
6. **Fetch all documents**: Verifies retrieving all documents from a collection

### Authentication Context Tests (5 tests)

These tests verify the functionality of the AuthContext provider:

1. **Render auth provider with children**: Tests the provider renders its children
2. **Initialize with current user**: Verifies context initializes with the current Firebase user
3. **Provide auth context to children**: Tests that child components can access auth context
4. **Show children after loading**: Ensures children are only shown after auth state resolves
5. **Fetch user profile after authentication**: Tests user profile is fetched after authentication

### Post Components Tests (33 tests)

#### PostCard Tests (7 tests)
1. **Render post details**: Tests rendering of post title, content, author
2. **Link to view post**: Verifies post card has a link to view the full post
3. **Hide edit options for non-authors**: Tests that edit/delete options are hidden for non-authors
4. **Show edit options for authors**: Verifies authors can see edit/delete options
5. **Call delete function**: Tests that delete function is called when delete button is clicked
6. **Truncate long content**: Verifies long content is truncated with ellipsis
7. **Format date correctly**: Tests that post date is formatted correctly

#### PostList Tests (15 tests)
1. **Render loading state**: Tests loading state display
2. **Render post list**: Verifies posts are displayed after loading
3. **Filter by category**: Tests filtering posts by category
4. **Filter by tag**: Tests filtering posts by tag
5. **Filter by author**: Tests filtering posts by author (userId)
6. **Sort by recent date**: Verifies posts are sorted by recent date by default
7. **Sort by popularity**: Tests sorting posts by popularity
8. **Load more posts**: Verifies more posts load when button is clicked
9. **Hide load more button**: Tests button is hidden when no more posts
10. **Display author information**: Verifies author name and avatar are displayed
11. **Format post date**: Tests post date format display
12. **Display post tags**: Verifies tags are properly displayed
13. **Display engagement metrics**: Tests like and comment counts display
14. **Show error message**: Verifies error message displays when posts fail to load
15. **Show empty state**: Tests message display when no posts match filters

#### PostDetail Tests (12 tests)
1. **Render loading state**: Tests loading state appearance
2. **Render error state**: Verifies error state is displayed properly
3. **Render not found state**: Tests display when post is null
4. **Render post details**: Verifies title, content, author, etc. are displayed
5. **Handle missing author**: Tests "Anonymous" is shown when author is not provided
6. **Handle missing image**: Verifies component works without an image URL
7. **Delete post**: Tests delete button functionality
8. **Work with MemoryRouter**: Verifies compatibility with React Router
9. **Handle special characters**: Tests display of content with special characters
10. **Handle long content**: Verifies very long content displays correctly
11. **Handle missing title**: Tests graceful handling of missing title
12. **Handle missing content**: Verifies component works with no content

#### PostCreate and NewPostForm Tests (22 tests)
1. **Render post form**: Tests form field rendering
2. **Require authentication**: Verifies form requires user to be logged in
3. **Fill out form**: Tests entering data in form fields
4. **Validate required fields**: Verifies validation of required fields
5. **Upload image**: Tests image upload functionality
6. **Show upload progress**: Verifies progress bar during upload
7. **Submit form**: Tests post creation on form submission
8. **Upload image before submission**: Verifies image upload before post creation
9. **Handle creation errors**: Tests error handling during post creation
10. **Handle upload errors**: Verifies error handling during image upload
11. **Show post preview**: Tests preview functionality
12. **Return to edit mode**: Verifies return from preview to edit mode
13. **Save as draft**: Tests saving post as draft
14. **Update input values**: Verifies form fields update when user types
15. **Display validation errors**: Tests error messages for empty fields
16. **Call onSubmit with data**: Verifies callback with form data
17. **Clear fields after submission**: Tests form reset after successful submission
18. **Disable during loading**: Verifies form elements disabled during loading
19. **Prevent invalid submission**: Tests that onSubmit isn't called for invalid forms
20. **Clear error on valid submission**: Verifies error message clears on valid submission

### Gym Components Tests (22 tests)

#### GymDetail Tests (16 tests)
1. **Render loading state**: Tests loading indicator display
2. **Render gym details**: Verifies gym information display after loading
3. **Display rating**: Tests gym rating display
4. **Display working hours**: Verifies working hours display correctly
5. **Display equipment and amenities**: Tests amenities list display
6. **Display contact information**: Verifies contact details display
7. **Display map location**: Tests map rendering with correct location
8. **Display reviews**: Verifies gym reviews display
9. **Format review dates**: Tests review date formatting
10. **Calculate average rating**: Verifies average rating calculation from reviews
11. **Show review form for authenticated users**: Tests review form display for logged-in users
12. **Hide review form for anonymous users**: Verifies form is hidden for guests
13. **Handle missing gym**: Tests error state when gym is not found
14. **Handle loading errors**: Verifies error handling during gym data loading
15. **Handle review loading errors**: Tests error handling during review loading
16. **Record check-ins**: Verifies check-in functionality

#### CityGymsFetcher Tests (6 tests)
1. **Render initial state**: Tests initial component rendering
2. **Fetch gyms**: Verifies gym data fetching from API
3. **Save gyms to Firebase**: Tests saving gym data to database
4. **Handle fetch errors**: Verifies error handling during API fetching
5. **Handle database errors**: Tests error handling during database operations
6. **Change city for search**: Verifies city input functionality

This comprehensive test suite ensures the Gym Advisor application is thoroughly tested across authentication, data management, and UI components.