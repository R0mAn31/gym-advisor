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

### TC-054: Critical Path - Login and Workout Plan Creation

**Objective**: Verify user can login and create a workout plan
**Steps**:

1. Navigate to login page
2. Login with valid credentials
3. Navigate to workout plan section
4. Create a new workout plan
   **Expected Result**: User successfully logs in and creates a workout plan

### TC-055: Data Persistence - User Settings

**Objective**: Verify user settings are preserved between sessions
**Steps**:

1. Login to the application
2. Modify user settings
3. Logout and login again
   **Expected Result**: Modified settings are preserved after logging back in

### TC-056: Mobile Responsiveness - Critical Pages

**Objective**: Verify critical pages render correctly on mobile devices
**Steps**:

1. Access application from mobile device
2. Navigate to login, home, gym details, and profile pages
   **Expected Result**: Pages display correctly with proper layout on mobile device

### TC-057: Error Recovery - Network Interruption

**Objective**: Verify application recovers from network interruption
**Steps**:

1. Login to application
2. Disconnect from network
3. Reconnect to network
4. Attempt to continue using the application
   **Expected Result**: Application recovers and continues to function after network is restored

### TC-058: Search Functionality - Basic Search

**Objective**: Verify basic search functionality works across the application
**Steps**:

1. Navigate to the search bar
2. Enter a search term
3. Submit search
   **Expected Result**: Relevant search results are displayed

## 11. Authentication - Additional Test Cases

### TC-059: User Registration - Password Strength Validation

**Objective**: Verify password strength requirements during registration
**Steps**:

1. Navigate to registration page
2. Enter valid email
3. Enter password without special characters
4. Click 'Sign Up' button
   **Expected Result**: Error message indicating password strength requirements is displayed

### TC-060: User Registration - Duplicate Email

**Objective**: Verify system prevents registration with existing email
**Steps**:

1. Navigate to registration page
2. Enter an email that already exists in the system
3. Enter valid password
4. Click 'Sign Up' button
   **Expected Result**: Error message indicating email is already registered is displayed

### TC-061: User Registration - Form Field Auto-Focus

**Objective**: Verify first form field is auto-focused on registration page
**Steps**:

1. Navigate to registration page
   **Expected Result**: Email field is automatically focused

### TC-062: User Login - Remember Me Functionality

**Objective**: Verify "Remember Me" checkbox functionality
**Steps**:

1. Navigate to login page
2. Enter valid credentials
3. Check "Remember Me" box
4. Login successfully
5. Close browser and reopen application
   **Expected Result**: User session is preserved and user remains logged in

### TC-063: User Login - Auto-Fill Credentials

**Objective**: Verify browser auto-fill works correctly with login form
**Steps**:

1. Save credentials in browser
2. Navigate to login page
3. Trigger auto-fill (if required)
   **Expected Result**: Form fields are correctly populated with saved credentials

### TC-064: Password Reset - Invalid Email

**Objective**: Verify system response to password reset for unregistered email
**Steps**:

1. Navigate to forgot password page
2. Enter email that is not registered
3. Click 'Reset Password' button
   **Expected Result**: Appropriate message is displayed without revealing if email exists in system

### TC-065: Password Reset - Reset Link Expiry

**Objective**: Verify password reset link expires after specified time
**Steps**:

1. Request password reset email
2. Wait for link expiration period (e.g., 24 hours)
3. Click on reset link in email
   **Expected Result**: Link is invalid with appropriate message

### TC-066: Password Reset - New Password Validation

**Objective**: Verify new password validation during reset
**Steps**:

1. Request password reset email
2. Click valid reset link
3. Enter new password that doesn't meet strength requirements
4. Submit form
   **Expected Result**: Error message indicating password requirements is displayed

### TC-067: Account Lockout - Multiple Failed Login Attempts

**Objective**: Verify account lockout after multiple failed login attempts
**Steps**:

1. Attempt to login with incorrect password multiple times (e.g., 5 times)
   **Expected Result**: Account is temporarily locked with appropriate message

### TC-068: Session Timeout - Inactivity

**Objective**: Verify session timeout after period of inactivity
**Steps**:

1. Login to the application
2. Leave the application idle for the session timeout period
3. Attempt to perform an action
   **Expected Result**: User is redirected to login page with session timeout message

## 12. User Profile Management

### TC-069: View User Profile

**Objective**: Verify user can view their profile information
**Steps**:

1. Login to the application
2. Navigate to profile section
   **Expected Result**: User profile information is correctly displayed

### TC-070: Edit User Profile - Name

**Objective**: Verify user can edit their name
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Click edit profile
4. Change first and last name
5. Save changes
   **Expected Result**: Profile is updated with new name

### TC-071: Edit User Profile - Email

**Objective**: Verify user can update their email address
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Click edit profile
4. Change email address
5. Save changes
   **Expected Result**: Profile is updated with new email and verification email is sent

### TC-072: Edit User Profile - Profile Picture

**Objective**: Verify user can update profile picture
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Click on profile picture or edit icon
4. Upload new image
5. Save changes
   **Expected Result**: Profile picture is updated successfully

### TC-073: Edit User Profile - Image Size Validation

**Objective**: Verify validation for profile picture upload size
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Attempt to upload image larger than allowed limit
   **Expected Result**: Error message indicating size limit is displayed

### TC-074: Edit User Profile - Image Format Validation

**Objective**: Verify validation for profile picture file format
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Attempt to upload image in unsupported format
   **Expected Result**: Error message indicating supported formats is displayed

### TC-075: Change Password - Current Password Validation

**Objective**: Verify current password validation when changing password
**Steps**:

1. Login to the application
2. Navigate to profile security settings
3. Enter incorrect current password
4. Enter new password and confirmation
5. Submit form
   **Expected Result**: Error message indicating incorrect current password is displayed

### TC-076: Change Password - New Password Confirmation

**Objective**: Verify new password confirmation match
**Steps**:

1. Login to the application
2. Navigate to profile security settings
3. Enter correct current password
4. Enter new password and different confirmation
5. Submit form
   **Expected Result**: Error message indicating password confirmation doesn't match is displayed

### TC-077: Change Password - Success

**Objective**: Verify successful password change
**Steps**:

1. Login to the application
2. Navigate to profile security settings
3. Enter correct current password
4. Enter new password and matching confirmation
5. Submit form
   **Expected Result**: Password is changed successfully with confirmation message

### TC-078: Delete Account - Confirmation

**Objective**: Verify account deletion confirmation
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Find delete account option
4. Click delete account
   **Expected Result**: Confirmation dialog appears asking for confirmation

### TC-079: Delete Account - Password Verification

**Objective**: Verify password verification before account deletion
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Request account deletion
4. Enter incorrect password in verification prompt
   **Expected Result**: Error message is displayed and account is not deleted

### TC-080: Delete Account - Success

**Objective**: Verify successful account deletion
**Steps**:

1. Login to the application
2. Navigate to profile section
3. Request account deletion
4. Enter correct password
5. Confirm deletion
   **Expected Result**: Account is deleted and user is logged out with confirmation

## 13. Workout Plan Management

### TC-081: Create New Workout Plan

**Objective**: Verify user can create a new workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Click "Create New Plan"
4. Enter plan name and details
5. Save plan
   **Expected Result**: New workout plan is created successfully

### TC-082: Edit Existing Workout Plan

**Objective**: Verify user can edit an existing workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Click edit
5. Modify plan details
6. Save changes
   **Expected Result**: Workout plan is updated successfully

### TC-083: Delete Workout Plan

**Objective**: Verify user can delete a workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Click delete option
5. Confirm deletion
   **Expected Result**: Workout plan is deleted successfully

### TC-084: Add Exercise to Workout Plan

**Objective**: Verify user can add exercises to a workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Click "Add Exercise"
5. Search and select an exercise
6. Set reps, sets, and weight
7. Save exercise
   **Expected Result**: Exercise is added to workout plan

### TC-085: Remove Exercise from Workout Plan

**Objective**: Verify user can remove exercises from a workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Find exercise to remove
5. Click remove or delete icon
6. Confirm removal
   **Expected Result**: Exercise is removed from workout plan

### TC-086: Reorder Exercises in Workout Plan

**Objective**: Verify user can reorder exercises in a workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Drag and drop exercises to reorder
   **Expected Result**: Exercises are reordered according to user's arrangement

### TC-087: Create Plan from Template

**Objective**: Verify user can create a workout plan from a template
**Steps**:

1. Login to the application
2. Navigate to workout templates section
3. Select a template
4. Click "Create Plan from Template"
5. Customize plan details if needed
6. Save plan
   **Expected Result**: New workout plan is created based on selected template

### TC-088: Share Workout Plan

**Objective**: Verify user can share workout plan with others
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Click share option
5. Enter recipient email or generate shareable link
   **Expected Result**: Plan is shared or link is generated successfully

### TC-089: Copy Workout Plan

**Objective**: Verify user can duplicate an existing workout plan
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select existing plan
4. Click duplicate or copy option
5. Modify name if needed
6. Save copy
   **Expected Result**: Duplicate workout plan is created successfully

### TC-090: Track Workout Completion

**Objective**: Verify user can mark workout as completed
**Steps**:

1. Login to the application
2. Navigate to workout plans section
3. Select active plan
4. Complete exercises
5. Mark workout as completed
   **Expected Result**: Workout is marked as completed with timestamp

## 14. Exercise Library

### TC-091: Browse Exercise Categories

**Objective**: Verify user can browse different exercise categories
**Steps**:

1. Login to the application
2. Navigate to exercise library
3. Select different category filters
   **Expected Result**: Exercises are filtered by selected categories

### TC-092: Search Exercises

**Objective**: Verify user can search for specific exercises
**Steps**:

1. Login to the application
2. Navigate to exercise library
3. Enter search term in search field
4. Submit search
   **Expected Result**: Relevant exercises matching search term are displayed

### TC-093: View Exercise Details

**Objective**: Verify user can view detailed information about an exercise
**Steps**:

1. Login to the application
2. Navigate to exercise library
3. Select an exercise
   **Expected Result**: Detailed page for selected exercise is displayed with instructions and images/videos

### TC-094: View Exercise Demonstration Video

**Objective**: Verify user can view exercise demonstration videos
**Steps**:

1. Login to the application
2. Navigate to exercise details page
3. Click on video play button
   **Expected Result**: Demonstration video plays correctly

### TC-095: Filter Exercises by Equipment

**Objective**: Verify exercise filtering by equipment type
**Steps**:

1. Login to the application
2. Navigate to exercise library
3. Select equipment filter options
   **Expected Result**: Exercises requiring selected equipment are displayed

### TC-096: Filter Exercises by Difficulty Level

**Objective**: Verify exercise filtering by difficulty level
**Steps**:

1. Login to the application
2. Navigate to exercise library
3. Select difficulty level filter
   **Expected Result**: Exercises matching selected difficulty level are displayed

### TC-097: Save Exercise to Favorites

**Objective**: Verify user can save exercises to favorites
**Steps**:

1. Login to the application
2. Navigate to exercise library
3. Find desired exercise
4. Click favorite or bookmark icon
   **Expected Result**: Exercise is added to user's favorites list

### TC-098: Remove Exercise from Favorites

**Objective**: Verify user can remove exercises from favorites
**Steps**:

1. Login to the application
2. Navigate to favorites list
3. Find exercise to remove
4. Click remove or un-favorite icon
   **Expected Result**: Exercise is removed from favorites list

### TC-099: Rate Exercise Effectiveness

**Objective**: Verify user can rate the effectiveness of exercises
**Steps**:

1. Login to the application
2. Navigate to exercise details
3. Find rating section
4. Select rating value
5. Submit rating
   **Expected Result**: Exercise rating is recorded and average rating is updated

### TC-100: Report Incorrect Exercise Information

**Objective**: Verify user can report inaccurate exercise information
**Steps**:

1. Login to the application
2. Navigate to exercise details
3. Find report or flag option
4. Select reason for report
5. Submit report
   **Expected Result**: Report is submitted successfully with confirmation message

## 15. Nutrition Tracking

### TC-101: Log Daily Food Intake

**Objective**: Verify user can log daily food intake
**Steps**:

1. Login to the application
2. Navigate to nutrition tracker
3. Select meal type (breakfast, lunch, dinner, or snack)
4. Search and select food items
5. Enter portion size
6. Save entry
   **Expected Result**: Food intake is logged successfully

### TC-102: View Nutrition Summary

**Objective**: Verify user can view nutrition summary
**Steps**:

1. Login to the application
2. Navigate to nutrition dashboard
   **Expected Result**: Nutrition summary displaying calories, macronutrients, and other nutrition metrics is displayed

### TC-103: Add Custom Food Item

**Objective**: Verify user can add custom food items
**Steps**:

1. Login to the application
2. Navigate to nutrition tracker
3. Select option to add custom food
4. Enter food details (name, nutrition facts)
5. Save custom food
   **Expected Result**: Custom food item is created and available for future logging

### TC-104: Create Meal Recipe

**Objective**: Verify user can create and save recipes
**Steps**:

1. Login to the application
2. Navigate to recipes section
3. Select create new recipe
4. Enter recipe name and ingredients
5. Set portion size and servings
6. Save recipe
   **Expected Result**: Recipe is created and saved successfully

### TC-105: Import Recipe Nutrition Information

**Objective**: Verify user can import recipe nutrition information
**Steps**:

1. Login to the application
2. Navigate to recipes section
3. Select import recipe option
4. Enter recipe URL or copy/paste recipe
5. Review imported nutrition data
6. Save recipe
   **Expected Result**: Recipe nutrition information is imported and saved correctly

### TC-106: Set Nutrition Goals

**Objective**: Verify user can set nutrition goals
**Steps**:

1. Login to the application
2. Navigate to nutrition settings
3. Set daily calorie target
4. Set macronutrient goals (protein, carbs, fat)
5. Save nutrition goals
   **Expected Result**: Nutrition goals are saved and reflected in nutrition dashboard

### TC-107: Generate Meal Plan

**Objective**: Verify user can generate a meal plan
**Steps**:

1. Login to the application
2. Navigate to meal planning section
3. Select meal plan generation
4. Set preferences and restrictions
5. Generate meal plan
   **Expected Result**: Meal plan is generated according to user preferences

### TC-108: Export Nutrition Data

**Objective**: Verify user can export nutrition data
**Steps**:

1. Login to the application
2. Navigate to nutrition history
3. Select date range
4. Click export option
5. Select export format
   **Expected Result**: Nutrition data is exported in selected format

### TC-109: Scan Barcode for Food Information

**Objective**: Verify barcode scanning functionality for food logging
**Steps**:

1. Login to the application
2. Navigate to nutrition tracker
3. Select barcode scan option
4. Scan product barcode
   **Expected Result**: Food item is identified and nutrition information is populated

### TC-110: Track Water Intake

**Objective**: Verify user can track daily water intake
**Steps**:

1. Login to the application
2. Navigate to nutrition tracker
3. Find water tracking section
4. Add water consumption amount
   **Expected Result**: Water intake is recorded and updated in daily total

## 16. Progress Tracking

### TC-111: Log Body Measurements

**Objective**: Verify user can log body measurements
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select body measurements
4. Enter measurement values
5. Save measurements
   **Expected Result**: Body measurements are saved with timestamp

### TC-112: Track Body Weight

**Objective**: Verify user can track body weight over time
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select weight tracking
4. Enter new weight
5. Save entry
   **Expected Result**: Weight entry is saved and displayed on progress chart

### TC-113: View Progress Charts

**Objective**: Verify user can view progress charts
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select chart type (weight, measurements, workout volume)
   **Expected Result**: Selected chart displays correctly with historical data

### TC-114: Set Fitness Goals

**Objective**: Verify user can set fitness goals
**Steps**:

1. Login to the application
2. Navigate to goals section
3. Select new goal option
4. Enter goal details and target date
5. Save goal
   **Expected Result**: Goal is created and displayed in goals dashboard

### TC-115: Track Workout Performance

**Objective**: Verify user can track workout performance metrics
**Steps**:

1. Login to the application
2. Navigate to performance tracking
3. Select exercise to track
4. View performance history
   **Expected Result**: Performance metrics (weight, reps, sets) are displayed over time

### TC-116: Add Progress Photos

**Objective**: Verify user can add progress photos
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select progress photos
4. Upload new photo
5. Add date and optional notes
6. Save photo
   **Expected Result**: Progress photo is saved with timestamp

### TC-117: Compare Progress Photos

**Objective**: Verify user can compare progress photos from different dates
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select progress photos
4. Select comparison view
5. Choose photos from different dates
   **Expected Result**: Selected photos are displayed side by side for comparison

### TC-118: Share Progress

**Objective**: Verify user can share progress with others
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select sharing option
4. Choose what to share (charts, achievements)
5. Generate shareable link or post to social media
   **Expected Result**: Progress information is shared via selected method

### TC-119: Set Reminders for Measurement Updates

**Objective**: Verify user can set reminders for updating measurements
**Steps**:

1. Login to the application
2. Navigate to progress tracking settings
3. Set reminder frequency
4. Save settings
   **Expected Result**: Reminders are set and will trigger at specified intervals

### TC-120: Export Progress Data

**Objective**: Verify user can export progress data
**Steps**:

1. Login to the application
2. Navigate to progress tracking section
3. Select export option
4. Choose date range and data types
5. Select export format
   **Expected Result**: Progress data is exported in selected format

## 17. Social Features

### TC-121: Create User Community Post

**Objective**: Verify user can create posts in the community section
**Steps**:

1. Login to the application
2. Navigate to community section
3. Create new post
4. Add text, optional image, and tags
5. Publish post
   **Expected Result**: Post is published and visible in community feed

### TC-122: Comment on Community Posts

**Objective**: Verify user can comment on community posts
**Steps**:

1. Login to the application
2. Navigate to community section
3. Find a post
4. Add comment
5. Submit comment
   **Expected Result**: Comment is added to the post

### TC-123: Like/React to Community Content

**Objective**: Verify user can like or react to community content
**Steps**:

1. Login to the application
2. Navigate to community section
3. Find a post
4. Click like/reaction button
   **Expected Result**: Reaction is recorded and count is updated

### TC-124: Follow Other Users

**Objective**: Verify user can follow other users
**Steps**:

1. Login to the application
2. Navigate to another user's profile
3. Click follow button
   **Expected Result**: User is added to following list and receives updates from followed user

### TC-125: Create and Join Groups

**Objective**: Verify user can create and join interest groups
**Steps**:

1. Login to the application
2. Navigate to groups section
3. Create new group or search existing groups
4. Join group or invite members
   **Expected Result**: Group is created or user joins existing group successfully

### TC-126: Create Fitness Challenge

**Objective**: Verify user can create fitness challenges
**Steps**:

1. Login to the application
2. Navigate to challenges section
3. Create new challenge
4. Set challenge details (type, duration, goals)
5. Invite participants
6. Launch challenge
   **Expected Result**: Challenge is created and invitations are sent

### TC-127: Join Fitness Challenge

**Objective**: Verify user can join existing fitness challenges
**Steps**:

1. Login to the application
2. Navigate to challenges section
3. Browse available challenges
4. Select a challenge
5. Join challenge
   **Expected Result**: User is added to challenge participants

### TC-128: View Leaderboards

**Objective**: Verify user can view challenge leaderboards
**Steps**:

1. Login to the application
2. Navigate to active challenge
3. Select leaderboard tab
   **Expected Result**: Leaderboard displays participant rankings correctly

## 18. Notification System

### TC-129: Receive System Notifications

**Objective**: Verify user receives system notifications
**Steps**:

1. Login to the application
2. Trigger notification event (e.g., new follower, comment)
3. Check notification center
   **Expected Result**: Notification appears in notification center

### TC-130: Enable/Disable Notification Types

**Objective**: Verify user can customize notification preferences
**Steps**:

1. Login to the application
2. Navigate to notification settings
3. Toggle different notification types
4. Save preferences
   **Expected Result**: Only selected notification types are received

### TC-131: Mark Notifications as Read

**Objective**: Verify user can mark notifications as read
**Steps**:

1. Login to the application
2. Navigate to notification center with unread notifications
3. Click mark as read option
   **Expected Result**: Notifications are marked as read and unread count is updated

### TC-132: Clear All Notifications

**Objective**: Verify user can clear all notifications
**Steps**:

1. Login to the application
2. Navigate to notification center
3. Select clear all option
4. Confirm action
   **Expected Result**: All notifications are cleared from the list

### TC-133: Receive Push Notifications (Mobile)

**Objective**: Verify push notifications on mobile devices
**Steps**:

1. Login to application on mobile device
2. Enable push notifications
3. Trigger notification event while app is in background
   **Expected Result**: Push notification is received on mobile device

### TC-134: Receive Email Notifications

**Objective**: Verify email notifications are sent
**Steps**:

1. Login to the application
2. Enable email notifications in settings
3. Trigger notification event
4. Check associated email account
   **Expected Result**: Email notification is received
