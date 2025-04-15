<!-- @format -->

# Gym Advisor - Manual Test Cases

## 1. Authentication

### TC-001: User Registration

**Objective**: Verify that a new user can successfully register
**Steps**:

1. Navigate to registration page
2. Enter valid email address
3. Enter valid password
4. Click 'Sign Up' button
   **Expected Result**: User is successfully registered and redirected to the home page

### TC-002: User Registration - Validation (Email Format)

**Objective**: Verify email validation for registration
**Steps**:

1. Navigate to registration page
2. Enter invalid email format
3. Click 'Sign Up' button
   **Expected Result**: Error message indicating invalid email format is displayed

### TC-003: User Registration - Validation (Password Length)

**Objective**: Verify password length validation for registration
**Steps**:

1. Navigate to registration page
2. Enter valid email
3. Enter password less than minimum length
4. Click 'Sign Up' button
   **Expected Result**: Error message indicating password is too short is displayed

### TC-004: User Login

**Objective**: Verify that existing user can log in
**Steps**:

1. Navigate to login page
2. Enter valid email
3. Enter correct password
4. Click 'Sign In' button
   **Expected Result**: User is successfully logged in and redirected to the home page

### TC-005: User Login - Invalid Credentials

**Objective**: Verify system response to invalid login credentials
**Steps**:

1. Navigate to login page
2. Enter valid email
3. Enter incorrect password
4. Click 'Sign In' button
   **Expected Result**: Error message indicating invalid credentials is displayed

### TC-006: Password Reset Request

**Objective**: Verify password reset functionality
**Steps**:

1. Navigate to login page
2. Click 'Forgot Password' link
3. Enter registered email address
4. Click 'Reset Password' button
   **Expected Result**: Password reset email is sent to the user

### TC-007: User Logout

**Objective**: Verify user can logout
**Steps**:

1. Login to the application
2. Click user menu
3. Click 'Logout' option
   **Expected Result**: User is logged out and redirected to login page

## 2. Gym Listing

### TC-008: View All Gyms

**Objective**: Verify all gyms are displayed on the main page
**Steps**:

1. Navigate to 'Gyms' page
2. Observe the list of gyms displayed
   **Expected Result**: All available gyms are displayed with their basic information

### TC-009: Gym Search by Name

**Objective**: Verify gym search functionality by name
**Steps**:

1. Navigate to 'Gyms' page
2. Enter gym name in search field
3. Click 'Search' button
   **Expected Result**: Gyms matching the search criteria are displayed

### TC-010: Gym Search by Location

**Objective**: Verify gym search functionality by location
**Steps**:

1. Navigate to 'Gyms' page
2. Enter location in location search field
3. Click 'Search' button
   **Expected Result**: Gyms near the specified location are displayed

### TC-011: Gym Filtering by Rating

**Objective**: Verify gym filtering functionality by rating
**Steps**:

1. Navigate to 'Gyms' page
2. Use rating filter to select minimum rating
3. Apply filter
   **Expected Result**: Only gyms with rating equal to or above the selected rating are displayed

### TC-012: Gym Filtering by Amenities

**Objective**: Verify gym filtering functionality by amenities
**Steps**:

1. Navigate to 'Gyms' page
2. Select specific amenities in filter options
3. Apply filter
   **Expected Result**: Only gyms with selected amenities are displayed

## 3. Gym Details

### TC-013: View Gym Details

**Objective**: Verify detailed information of a gym can be viewed
**Steps**:

1. Navigate to 'Gyms' page
2. Click on a gym card
   **Expected Result**: Detailed page for the selected gym is displayed

### TC-014: View Gym Photos

**Objective**: Verify gym photos can be viewed
**Steps**:

1. Navigate to gym details page
2. Click on photo gallery
   **Expected Result**: Photo gallery opens and displays images properly

### TC-015: View Gym Location on Map

**Objective**: Verify gym location on map
**Steps**:

1. Navigate to gym details page
2. Locate map section
   **Expected Result**: Map displays accurately showing gym location

### TC-016: View Gym Working Hours

**Objective**: Verify gym working hours information
**Steps**:

1. Navigate to gym details page
2. Find working hours section
   **Expected Result**: Correct working hours for each day of the week are displayed

### TC-017: View Gym Contact Information

**Objective**: Verify gym contact information
**Steps**:

1. Navigate to gym details page
2. Find contact information section
   **Expected Result**: Correct phone, email, and other contact methods are displayed

## 4. User Reviews

### TC-018: Submit New Review

**Objective**: Verify users can submit reviews for gyms
**Steps**:

1. Login to the application
2. Navigate to a gym details page
3. Find review section
4. Enter rating and review text
5. Click 'Submit Review' button
   **Expected Result**: Review is successfully submitted and appears in reviews list

### TC-019: Edit Existing Review

**Objective**: Verify users can edit their reviews
**Steps**:

1. Login to the application
2. Navigate to a gym with user's existing review
3. Find user's review
4. Click 'Edit' button
5. Modify rating or review text
6. Click 'Update Review' button
   **Expected Result**: Review is successfully updated with new information

### TC-020: Delete Existing Review

**Objective**: Verify users can delete their reviews
**Steps**:

1. Login to the application
2. Navigate to a gym with user's existing review
3. Find user's review
4. Click 'Delete' button
5. Confirm deletion
   **Expected Result**: Review is successfully deleted and removed from reviews list

### TC-021: View All Reviews for a Gym

**Objective**: Verify all reviews for a gym can be viewed
**Steps**:

1. Navigate to a gym details page
2. Find reviews section
   **Expected Result**: All reviews for the gym are displayed with reviewer names, ratings, and comments

### TC-022: Sort Reviews by Date

**Objective**: Verify reviews can be sorted by date
**Steps**:

1. Navigate to a gym details page
2. Find reviews section
3. Select 'Sort by Date' option
   **Expected Result**: Reviews are displayed in chronological order

### TC-023: Sort Reviews by Rating

**Objective**: Verify reviews can be sorted by rating
**Steps**:

1. Navigate to a gym details page
2. Find reviews section
3. Select 'Sort by Rating' option
   **Expected Result**: Reviews are displayed in order of rating (highest to lowest or vice versa)

## 5. User Profile

### TC-024: View User Profile

**Objective**: Verify user can view their profile
**Steps**:

1. Login to the application
2. Click on user menu
3. Select 'Profile' option
   **Expected Result**: User profile page is displayed with correct user information

### TC-025: Edit User Profile

**Objective**: Verify user can edit their profile information
**Steps**:

1. Navigate to user profile page
2. Click 'Edit Profile' button
3. Modify profile information
4. Click 'Save Changes' button
   **Expected Result**: Profile information is successfully updated

### TC-026: Change Password

**Objective**: Verify user can change their password
**Steps**:

1. Navigate to user profile page
2. Click 'Change Password' button
3. Enter current password
4. Enter new password and confirm
5. Click 'Save Changes' button
   **Expected Result**: Password is successfully changed

### TC-027: View User's Reviews

**Objective**: Verify user can see all their reviews
**Steps**:

1. Navigate to user profile page
2. Find 'My Reviews' section
   **Expected Result**: All reviews submitted by the user are displayed

### TC-028: Delete User Account

**Objective**: Verify user can delete their account
**Steps**:

1. Navigate to user profile page
2. Click 'Delete Account' button
3. Confirm deletion
   **Expected Result**: User account is deleted and user is logged out

## 6. Admin Functions

### TC-029: Admin Login

**Objective**: Verify admin can log in with admin credentials
**Steps**:

1. Navigate to login page
2. Enter admin email and password
3. Click 'Sign In' button
   **Expected Result**: Admin is logged in and redirected to admin dashboard

### TC-030: Add New Gym

**Objective**: Verify admin can add a new gym
**Steps**:

1. Login as admin
2. Navigate to admin dashboard
3. Click 'Add Gym' button
4. Fill in gym details form
5. Click 'Save' button
   **Expected Result**: New gym is added to the database and appears in gym listings

### TC-031: Edit Existing Gym

**Objective**: Verify admin can edit gym information
**Steps**:

1. Login as admin
2. Navigate to admin dashboard
3. Find gym in list
4. Click 'Edit' button
5. Modify gym information
6. Click 'Save Changes' button
   **Expected Result**: Gym information is successfully updated

### TC-032: Delete Gym

**Objective**: Verify admin can delete a gym
**Steps**:

1. Login as admin
2. Navigate to admin dashboard
3. Find gym in list
4. Click 'Delete' button
5. Confirm deletion
   **Expected Result**: Gym is successfully removed from the database

### TC-033: Manage Users

**Objective**: Verify admin can view and manage users
**Steps**:

1. Login as admin
2. Navigate to admin dashboard
3. Select 'Users' tab
   **Expected Result**: List of all users is displayed with management options

### TC-034: Block User

**Objective**: Verify admin can block a user
**Steps**:

1. Login as admin
2. Navigate to users management
3. Find user in list
4. Click 'Block' button
5. Confirm action
   **Expected Result**: User is blocked and cannot login to the application

### TC-035: Delete Review as Admin

**Objective**: Verify admin can delete inappropriate reviews
**Steps**:

1. Login as admin
2. Navigate to gym details with the review
3. Find the review
4. Click 'Delete' button
5. Confirm deletion
   **Expected Result**: Review is successfully deleted from the system

## 7. User Interface

### TC-036: Responsive Design - Desktop

**Objective**: Verify application displays correctly on desktop screens
**Steps**:

1. Open application on desktop browser
2. Navigate through various pages
   **Expected Result**: All elements are properly sized and aligned on desktop screens

### TC-037: Responsive Design - Tablet

**Objective**: Verify application displays correctly on tablet screens
**Steps**:

1. Open application on tablet or use browser developer tools to simulate tablet
2. Navigate through various pages
   **Expected Result**: All elements are properly sized and aligned on tablet screens

### TC-038: Responsive Design - Mobile

**Objective**: Verify application displays correctly on mobile screens
**Steps**:

1. Open application on mobile device or use browser developer tools to simulate mobile
2. Navigate through various pages
   **Expected Result**: All elements are properly sized and aligned on mobile screens

### TC-039: Theme Toggle (Light/Dark)

**Objective**: Verify theme toggle functionality
**Steps**:

1. Open application in default theme
2. Find theme toggle switch
3. Click the toggle
   **Expected Result**: Application theme changes between light and dark mode correctly

### TC-040: Accessibility - Screen Reader Compatibility

**Objective**: Verify application is screen reader compatible
**Steps**:

1. Enable screen reader
2. Navigate through application
   **Expected Result**: Screen reader properly announces all elements and content

### TC-041: Accessibility - Keyboard Navigation

**Objective**: Verify application can be navigated using keyboard only
**Steps**:

1. Open application
2. Use Tab, Enter, and arrow keys to navigate
   **Expected Result**: All interactive elements can be accessed and used with keyboard

## 8. Performance

### TC-042: Page Load Time - Home Page

**Objective**: Verify reasonable load time for home page
**Steps**:

1. Clear browser cache
2. Open application home page
3. Measure load time
   **Expected Result**: Page loads within acceptable time frame (under 3 seconds)

### TC-043: Page Load Time - Gym Listings

**Objective**: Verify reasonable load time for gym listings
**Steps**:

1. Clear browser cache
2. Navigate to 'Gyms' page
3. Measure load time
   **Expected Result**: Page loads within acceptable time frame (under 3 seconds)

### TC-044: Page Load Time - Gym Details

**Objective**: Verify reasonable load time for gym details
**Steps**:

1. Clear browser cache
2. Navigate to a specific gym details page
3. Measure load time
   **Expected Result**: Page loads within acceptable time frame (under 3 seconds)

### TC-045: Search Response Time

**Objective**: Verify reasonable response time for search functionality
**Steps**:

1. Navigate to 'Gyms' page
2. Perform a search
3. Measure response time
   **Expected Result**: Search results appear within acceptable time frame (under 2 seconds)

### TC-046: Filter Response Time

**Objective**: Verify reasonable response time for filter functionality
**Steps**:

1. Navigate to 'Gyms' page
2. Apply filters
3. Measure response time
   **Expected Result**: Filtered results appear within acceptable time frame (under 2 seconds)

## 9. Security

### TC-047: Session Timeout

**Objective**: Verify session timeout functionality
**Steps**:

1. Login to the application
2. Leave the application idle for the session timeout period
3. Attempt to perform an action
   **Expected Result**: User is logged out and redirected to login page

### TC-048: SQL Injection Prevention

**Objective**: Verify application is protected against SQL injection
**Steps**:

1. Identify input fields
2. Enter SQL injection test strings
3. Submit form
   **Expected Result**: No database errors or unexpected behavior

### TC-049: XSS Prevention

**Objective**: Verify application is protected against Cross-Site Scripting
**Steps**:

1. Identify input fields
2. Enter XSS test strings
3. Submit form
   **Expected Result**: Script is not executed and is displayed as plain text

### TC-050: Secure Routes

**Objective**: Verify protected routes require authentication
**Steps**:

1. Log out of the application
2. Attempt to access protected routes directly by URL
   **Expected Result**: User is redirected to login page

## 10. Smoke Testing

### TC-051: Application Launch

**Objective**: Verify application launches successfully
**Steps**:

1. Navigate to application URL
   **Expected Result**: Application loads successfully without errors

### TC-052: Basic Navigation

**Objective**: Verify basic navigation between main pages
**Steps**:

1. Navigate to application home page
2. Click on main navigation links
   **Expected Result**: Navigation between pages works correctly

### TC-053: Basic User Flow - Registration to Review

**Objective**: Verify end-to-end flow from registration to submitting a review
**Steps**:

1. Register a new user
2. Login with new user credentials
3. Find a gym
4. View gym details
5. Submit a review
   **Expected Result**: All steps complete successfully without errors
