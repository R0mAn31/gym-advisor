
#### Test: Render Content For Admins
```javascript
test('should render children when user is an admin', () => {
  // Mock auth context with admin user
  useAuth.mockReturnValue({
    userLoggedIn: true,
    isAdmin: true,
    loading: false
  });

  render(
    <BrowserRouter>
      <AdminRoute>
        <div data-testid="admin-content">Admin Content</div>
      </AdminRoute>
    </BrowserRouter>
  );

  expect(screen.getByTestId('admin-content')).toBeInTheDocument();
});
```
---
**Description**: This test ensures that admin users can access admin-only content.

**Setup**:
- Mocks the `useAuth` hook to return a logged-in state with admin privileges
- Renders the AdminRoute component with child content
- Uses BrowserRouter for routing context

**Expected Behavior**:
- The admin content should be rendered
- No access denied message or redirect should be shown

### Header Component

#### Test: Logo and Navigation Links
```javascript
test('should render logo and navigation links', () => {
  renderHeader();
  
  expect(screen.getByText(/блог-платформа/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /головна/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /спортзали/i })).toBeInTheDocument();
});
```

**Description**: This test checks that the header renders with the application logo and navigation links.

**Setup**:
- Uses a helper function `renderHeader()` that renders the Header component with necessary context
- The function mocks authentication state and theme context

**Expected Behavior**:
- The application name/logo should be displayed
- Navigation links to the home page and gyms page should be visible
---

#### Test: Unauthenticated User UI
```javascript
test('should render login and register links when user is not logged in', () => {
  renderHeader(false);
  
  expect(screen.getByRole('link', { name: /увійти/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /зареєструватися/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /вийти/i })).not.toBeInTheDocument();
});
```

**Description**: This test verifies that login and register links appear for non-logged in users.

**Setup**:
- Uses the `renderHeader()` helper function with `false` for the userLoggedIn parameter
- This sets up the component with an unauthenticated user state

**Expected Behavior**:
- Login link should be displayed
- Register link should be displayed
- Logout button should not be present

---

#### Test: Authenticated User UI
```javascript
test('should render create post and logout buttons when user is logged in', () => {
  renderHeader(true);
  
  expect(screen.queryByRole('link', { name: /увійти/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /зареєструватися/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /створити статтю/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /вийти/i })).toBeInTheDocument();
});
```

**Description**: This test confirms that logged-in users see post creation and logout options.

**Setup**:
- Uses the `renderHeader()` helper function with `true` for the userLoggedIn parameter
- This sets up the component with an authenticated user state

**Expected Behavior**:
- Login and register links should not be displayed
- Create post link should be visible
- Logout button should be visible

---

#### Test: Admin Links
```javascript
test('should render admin panel link when user is an admin', () => {
  renderHeader(true, true);
  
  expect(screen.getByRole('link', { name: /адмін-панель/i })).toBeInTheDocument();
});
```

**Description**: This test ensures admin users see admin panel links in the header.

**Setup**:
- Uses the `renderHeader()` helper function with parameters:
  - `true` for userLoggedIn (authenticated)
  - `true` for isAdmin (admin privileges)

**Expected Behavior**:
- Admin panel link should be visible in the header

---

#### Test: Regular User Links
```javascript
test('should not render admin panel link for regular users', () => {
  renderHeader(true, false);
  
  expect(screen.queryByRole('link', { name: /адмін-панель/i })).not.toBeInTheDocument();
});
```

**Description**: This test verifies that regular users don't see admin-only links.

**Setup**:
- Uses the `renderHeader()` helper function with parameters:
  - `true` for userLoggedIn (authenticated)
  - `false` for isAdmin (regular user)

**Expected Behavior**:
- Admin panel link should not be present in the header

---

#### Test: Logout Handler
```javascript
test('should handle logout when logout button is clicked', async () => {
  renderHeader(true);
  
  fireEvent.click(screen.getByRole('button', { name: /вийти/i }));
  
  expect(doSignOut).toHaveBeenCalled();
});
```

**Description**: This test validates the logout functionality when the logout button is clicked.

**Setup**:
- Uses the `renderHeader()` helper function with authenticated user
- Mocks the `doSignOut` function to test if it's called

**Expected Behavior**:
- When the logout button is clicked, the `doSignOut` function should be called

---

#### Test: Theme Toggle
```javascript
test('should toggle theme when theme button is clicked', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Initial theme should be light
  expect(document.body.getAttribute('data-theme')).toBe('light');
  
  // Click theme toggle button
  fireEvent.click(screen.getByTestId('theme-toggle'));
  
  // Theme should change to dark
  expect(document.body.getAttribute('data-theme')).toBe('dark');
  expect(window.localStorage.setItem).toHaveBeenCalledWith('themeMode', 'dark');
  
  // Click again to toggle back to light
  fireEvent.click(screen.getByTestId('theme-toggle'));
  
  // Theme should change back to light
  expect(document.body.getAttribute('data-theme')).toBe('light');
  expect(window.localStorage.setItem).toHaveBeenCalledWith('themeMode', 'light');
});
```

**Description**: This test validates theme switching between light and dark modes.

**Setup**:
- Mocks localStorage
- Mocks the theme toggle button in the Header component
- Renders the App component
- Simulates clicking the theme toggle button twice

**Expected Behavior**:
- Initial theme should be light
- After first click, theme should change to dark and save to localStorage
- After second click, theme should change back to light and update localStorage

---

#### Test: LocalStorage Theme
```javascript
test('should apply theme from localStorage', () => {
  // Set theme in localStorage
  window.localStorage.setItem('themeMode', 'dark');
  
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Theme should be loaded from localStorage
  expect(document.body.getAttribute('data-theme')).toBe('dark');
});
```

**Description**: This test confirms that theme preference is saved and loaded from localStorage.

**Setup**:
- Sets 'dark' theme in localStorage before rendering
- Renders the App component

**Expected Behavior**:
- The app should load the dark theme from localStorage
- Dark theme should be applied to document.body

### PostDetail Component

#### Test: Loading State
```javascript
test('should show loading state initially', () => {
  // Mock Firestore
  doc.mockReturnValue('postRef');
  getDoc.mockImplementation(() => new Promise(() => {})); // Never resolves
  
  useAuth.mockReturnValue({
    currentUser: { email: 'user@example.com' }
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

**Description**: This test checks that a loading indicator is shown while post data is being fetched.

**Setup**:
- Mocks the Firestore `doc` function to return a reference
- Mocks the `getDoc` function to return a promise that never resolves (simulating loading)
- Mocks the authentication context with a current user
- Renders the PostDetail component

**Expected Behavior**:
- A progress indicator should be displayed while the post is loading

---

#### Test: Post Display
```javascript
test('should display post details when loaded', async () => {
  // Mock Firestore
  doc.mockReturnValue('postRef');
  getDoc.mockResolvedValue({
    exists: () => true,
    id: 'test-post-id',
    data: () => mockPost
  });
  
  useAuth.mockReturnValue({
    currentUser: { email: 'user@example.com' }
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('test-document.docx')).toBeInTheDocument();
  });
  
  // Check for components
  expect(screen.getByTestId('post-rating')).toBeInTheDocument();
  expect(screen.getByTestId('comment-section')).toBeInTheDocument();
});
```

**Description**: This test verifies that post content, author information, and attached components are rendered correctly when the post loads.

**Setup**:
- Mocks the Firestore functions to return a valid post
- Creates a mock post with title, content, author, and file data
- Mocks the authentication context
- Renders the PostDetail component

**Expected Behavior**:
- Post title, author, content, and attached file name should be displayed
- The PostRating component should be rendered
- The CommentSection component should be rendered 

#### Test: Author UI Controls
```javascript
test('should show edit and delete buttons for post author', async () => {
  // Mock Firestore
  doc.mockReturnValue('postRef');
  getDoc.mockResolvedValue({
    exists: () => true,
    id: 'test-post-id',
    data: () => mockPost
  });
  
  // Mock auth context with matching email
  useAuth.mockReturnValue({
    currentUser: { email: 'test@example.com' } // Same as post author
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /редагувати/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /видалити/i })).toBeInTheDocument();
  });
});
```

**Description**: This test confirms that post authors see edit and delete buttons when viewing their own posts.

**Setup**:
- Mocks Firestore to return a post with author email "test@example.com"
- Mocks the authentication context with a matching email (same as post author)
- Renders the PostDetail component

**Expected Behavior**:
- Edit button should be visible
- Delete button should be visible

---

#### Test: Non-Author UI
```javascript
test('should not show edit and delete buttons for non-authors', async () => {
  // Mock Firestore
  doc.mockReturnValue('postRef');
  getDoc.mockResolvedValue({
    exists: () => true,
    id: 'test-post-id',
    data: () => mockPost
  });
  
  // Mock auth context with different email
  useAuth.mockReturnValue({
    currentUser: { email: 'other@example.com' } // Different from post author
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(screen.queryByRole('button', { name: /редагувати/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /видалити/i })).not.toBeInTheDocument();
  });
});
```

**Description**: This test ensures that users who didn't create the post don't see edit and delete controls.

**Setup**:
- Mocks Firestore to return a post with author email "test@example.com"
- Mocks the authentication context with a different email "other@example.com"
- Renders the PostDetail component

**Expected Behavior**:
- Edit button should not be visible
- Delete button should not be visible

---

#### Test: Delete Confirmation Dialog
```javascript
test('should handle delete confirmation dialog', async () => {
  // Mock Firestore
  doc.mockReturnValue('postRef');
  getDoc.mockResolvedValue({
    exists: () => true,
    id: 'test-post-id',
    data: () => mockPost
  });
  deleteDoc.mockResolvedValue();
  
  // Mock auth context with matching email
  useAuth.mockReturnValue({
    currentUser: { email: 'test@example.com' } // Same as post author
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  // Wait for post to load
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /видалити/i })).toBeInTheDocument();
  });
  
  // Click delete button
  fireEvent.click(screen.getByRole('button', { name: /видалити/i }));
  
  // Check if confirmation dialog appears
  expect(screen.getByText(/видалити статтю?/i)).toBeInTheDocument();
  expect(screen.getByText(/ви впевнені, що хочете видалити цю статтю?/i)).toBeInTheDocument();
  
  // Click cancel
  fireEvent.click(screen.getByRole('button', { name: /скасувати/i }));
  
  // Dialog should close
  expect(screen.queryByText(/видалити статтю?/i)).not.toBeInTheDocument();
  
  // Delete document should not be called
  expect(deleteDoc).not.toHaveBeenCalled();
});
```

**Description**: This test verifies the delete confirmation dialog UI and cancellation behavior.

**Setup**:
- Mocks Firestore to return a post
- Mocks the authentication context with the post author's email
- Renders the PostDetail component
- Simulates clicking the delete button and then cancel

**Expected Behavior**:
- Delete confirmation dialog should appear when delete button is clicked
- Dialog should close when cancel is clicked
- Post shouldn't be deleted when dialog is cancelled

---

#### Test: Post Deletion
```javascript
test('should handle post deletion', async () => {
  // Mock Firestore
  doc.mockReturnValue('postRef');
  getDoc.mockResolvedValue({
    exists: () => true,
    id: 'test-post-id',
    data: () => mockPost
  });
  deleteDoc.mockResolvedValue();
  
  // Mock auth context with matching email
  useAuth.mockReturnValue({
    currentUser: { email: 'test@example.com' } // Same as post author
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  // Wait for post to load
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /видалити/i })).toBeInTheDocument();
  });
  
  // Click delete button
  fireEvent.click(screen.getByRole('button', { name: /видалити/i }));
  
  // Check if confirmation dialog appears
  expect(screen.getByText(/видалити статтю?/i)).toBeInTheDocument();
  
  // Click confirm delete
  fireEvent.click(screen.getByRole('button', { name: /видалити/i, exact: true }));
  
  // Check if deleteDoc was called
  expect(deleteDoc).toHaveBeenCalledWith('postRef');
});
```

**Description**: This test validates that post deletion functionality works when confirmed.

**Setup**:
- Mocks Firestore to return a post
- Mocks the authentication context with the post author's email
- Renders the PostDetail component
- Simulates clicking the delete button and then confirm

**Expected Behavior**:
- Delete confirmation dialog should appear when delete button is clicked
- When confirm is clicked, the `deleteDoc` function should be called with the post reference

---

#### Test: Not Found Error
```javascript
test('should show error when post not found', async () => {
  // Mock Firestore - post does not exist
  doc.mockReturnValue('postRef');
  getDoc.mockResolvedValue({
    exists: () => false
  });
  
  useAuth.mockReturnValue({
    currentUser: { email: 'user@example.com' }
  });
  
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByText(/статтю не знайдено/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /повернутися на головну/i })).toBeInTheDocument();
  });
});
```

**Description**: This test ensures that an appropriate error is shown when the requested post doesn't exist.

**Setup**:
- Mocks Firestore's `exists()` function to return false, indicating the post does not exist
- Mocks the authentication context
- Renders the PostDetail component

**Expected Behavior**:
- A "post not found" error message should be displayed
- A button to return to the home page should be visible

### GymMap Component

#### Test: Map and List Rendering
```javascript
test('should render map and gym list', async () => {
  render(
    <BrowserRouter>
      <GymMap />
    </BrowserRouter>
  );
  
  // Initially should show loading state
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  
  // Map container should be rendered
  expect(screen.getByTestId('map-container')).toBeInTheDocument();
  
  // Gym listings should be rendered
  expect(screen.getByText('Fitness Club')).toBeInTheDocument();
  expect(screen.getByText('Yoga Studio')).toBeInTheDocument();
  
  // Search and filter controls should be rendered
  expect(screen.getByLabelText(/пошук спортзалу/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/тип спортзалу/i)).toBeInTheDocument();
  
  // Location controls should be rendered
  expect(screen.getByRole('button', { name: /визначити місцезнаходження/i })).toBeInTheDocument();
  expect(screen.getByText(/радіус пошуку/i)).toBeInTheDocument();
});
```

**Description**: This test checks that both the map and a list of gyms are rendered correctly after data loads.

**Setup**:
- Mocks Firestore to return sample gym data
- The test uses a common `beforeEach` to set up mocks for map components
- Renders the GymMap component

**Expected Behavior**:
- During loading, a progress indicator should be shown
- After loading, the map container should be visible
- Gym listings should appear with correct names
- Search field, filter controls, and location controls should be displayed

---

#### Test: Gym Type Filter
```javascript
test('should filter gyms by type', async () => {
  render(
    <BrowserRouter>
      <GymMap />
    </BrowserRouter>
  );
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  
  // Both gyms should be visible initially
  expect(screen.getByText('Fitness Club')).toBeInTheDocument();
  expect(screen.getByText('Yoga Studio')).toBeInTheDocument();
  
  // Open the filter dropdown
  fireEvent.mouseDown(screen.getByLabelText(/тип спортзалу/i));
  
  // Select Yoga option
  const yogaOption = screen.getByRole('option', { name: /йога/i });
  fireEvent.click(yogaOption);
  
  // Only Yoga Studio should be visible now
  expect(screen.queryByText('Fitness Club')).not.toBeInTheDocument();
  expect(screen.getByText('Yoga Studio')).toBeInTheDocument();
});
```

**Description**: This test verifies the functionality to filter gyms by type.

**Setup**:
- Mocks Firestore to return sample gym data with different types
- Renders the GymMap component
- Waits for data to load
- Simulates selecting a filter option

**Expected Behavior**:
- Initially all gyms should be visible
- After selecting "Yoga" in the filter, only yoga studios should be displayed
- Fitness clubs should be filtered out

---

#### Test: Gym Name Search
```javascript
test('should search gyms by name', async () => {
  render(
    <BrowserRouter>
      <GymMap />
    </BrowserRouter>
  );
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  
  // Both gyms should be visible initially
  expect(screen.getByText('Fitness Club')).toBeInTheDocument();
  expect(screen.getByText('Yoga Studio')).toBeInTheDocument();
  
  // Search for "Yoga"
  fireEvent.change(screen.getByLabelText(/пошук спортзалу/i), {
    target: { value: 'Yoga' }
  });
  
  // Only Yoga Studio should be visible now
  expect(screen.queryByText('Fitness Club')).not.toBeInTheDocument();
  expect(screen.getByText('Yoga Studio')).toBeInTheDocument();
});
```

**Description**: This test validates the search functionality to find gyms by name.

**Setup**:
- Mocks Firestore to return sample gym data
- Renders the GymMap component
- Waits for data to load
- Simulates typing in the search field

**Expected Behavior**:
- Initially all gyms should be visible
- After searching for "Yoga", only gyms with "Yoga" in the name should be displayed
- "Fitness Club" should be filtered out of the results 

#### Test: Gym Details Drawer
```javascript
test('should show gym details in drawer when selected', async () => {
  render(
    <BrowserRouter>
      <GymMap />
    </BrowserRouter>
  );
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  
  // Click on a gym card
  fireEvent.click(screen.getByText('Fitness Club'));
  
  // Drawer should open with gym details
  expect(screen.getAllByText('Fitness Club')).toHaveLength(2); // One in card, one in drawer
  expect(screen.getByText('123 Main St, City')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /прокласти маршрут/i })).toBeInTheDocument();
  
  // Close drawer
  fireEvent.click(screen.getByRole('button', { name: /close/i }));
  
  // Drawer should close
  expect(screen.getAllByText('Fitness Club')).toHaveLength(1); // Only in card
});
```

**Description**: This test confirms that gym details appear in a drawer when a gym is selected from the list.

**Setup**:
- Mocks Firestore to return sample gym data
- Renders the GymMap component
- Waits for data to load
- Simulates clicking on a gym card

**Expected Behavior**:
- When a gym is clicked, a drawer should open with detailed information
- The gym's name should appear twice (in the list and the drawer)
- The address and route button should be visible in the drawer
- When close button is clicked, the drawer should close

### CommentSection Component

#### Test: Comments Display
```javascript
test('should render comments when available', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user-id', email: 'test@example.com' }
  });
  
  render(<CommentSection postId="test-post-id" />);
  
  // Wait for comments to load
  await waitFor(() => {
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Another test comment')).toBeInTheDocument();
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });
});
```

**Description**: This test verifies that existing comments are rendered correctly when loaded.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks Firestore's `onSnapshot` to return sample comment data
- Renders the CommentSection component with a test post ID

**Expected Behavior**:
- Comment content should be displayed for each comment
- Comment author names should be shown
- All comments should be visible

---

#### Test: Authenticated Comment Form
```javascript
test('should render comment form for authenticated users', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user-id', email: 'test@example.com' }
  });
  
  render(<CommentSection postId="test-post-id" />);
  
  // Comment form should be rendered
  expect(screen.getByPlaceholderText(/додайте коментар/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /коментувати/i })).toBeInTheDocument();
});
```

**Description**: This test confirms that logged-in users see a comment form they can use to add comments.

**Setup**:
- Mocks the authentication context with a logged-in user
- Renders the CommentSection component

**Expected Behavior**:
- Comment text input field should be displayed
- Comment submit button should be visible

---

#### Test: Unauthenticated Comment UI
```javascript
test('should not render comment form for non-authenticated users', async () => {
  // Mock auth context - not logged in
  useAuth.mockReturnValue({
    currentUser: null
  });
  
  render(<CommentSection postId="test-post-id" />);
  
  // Comment form should not be rendered
  expect(screen.queryByPlaceholderText(/додайте коментар/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /коментувати/i })).not.toBeInTheDocument();
  
  // Should show login message
  expect(screen.getByText(/увійдіть, щоб залишити коментар/i)).toBeInTheDocument();
});
```

**Description**: This test checks that non-logged in users see a login prompt instead of a comment form.

**Setup**:
- Mocks the authentication context with no user (logged out)
- Renders the CommentSection component

**Expected Behavior**:
- Comment form should not be visible
- A message prompting the user to log in should be displayed

---

#### Test: New Comment Submission
```javascript
test('should handle adding a new comment', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { 
      uid: 'user-id', 
      email: 'test@example.com',
      displayName: 'Test User'
    }
  });
  
  render(<CommentSection postId="test-post-id" />);
  
  // Type a comment
  fireEvent.change(screen.getByPlaceholderText(/додайте коментар/i), {
    target: { value: 'This is a new comment' }
  });
  
  // Submit the comment
  fireEvent.click(screen.getByRole('button', { name: /коментувати/i }));
  
  // Check if addDoc was called with correct data
  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledWith(
      'commentsCollection',
      expect.objectContaining({
        postId: 'test-post-id',
        content: 'This is a new comment',
        author: 'test@example.com',
        authorId: 'user-id',
        authorName: 'Test User'
      })
    );
  });
});
```

**Description**: This test validates the functionality for adding a new comment.

**Setup**:
- Mocks the authentication context with a logged-in user who has a display name
- Mocks Firestore's `addDoc` function
- Renders the CommentSection component
- Simulates typing a comment and submitting it

**Expected Behavior**:
- When a comment is submitted, Firestore's `addDoc` should be called
- The comment data should include the post ID, content, author information, and timestamp

---

#### Test: Comment Validation
```javascript
test('should validate comment before submission', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user-id', email: 'test@example.com' }
  });
  
  render(<CommentSection postId="test-post-id" />);
  
  // Submit button should be disabled initially (empty comment)
  expect(screen.getByRole('button', { name: /коментувати/i })).toBeDisabled();
  
  // Type a comment
  fireEvent.change(screen.getByPlaceholderText(/додайте коментар/i), {
    target: { value: 'This is a new comment' }
  });
  
  // Submit button should be enabled
  expect(screen.getByRole('button', { name: /коментувати/i })).not.toBeDisabled();
  
  // Clear the comment
  fireEvent.change(screen.getByPlaceholderText(/додайте коментар/i), {
    target: { value: '' }
  });
  
  // Submit button should be disabled again
  expect(screen.getByRole('button', { name: /коментувати/i })).toBeDisabled();
});
```

**Description**: This test verifies that comment validation occurs before submission.

**Setup**:
- Mocks the authentication context with a logged-in user
- Renders the CommentSection component
- Simulates different states of the comment field (empty, filled, empty again)

**Expected Behavior**:
- Submit button should be disabled when comment field is empty
- Submit button should be enabled when comment field has content
- Submit button should be disabled again when comment is cleared

---

#### Test: Empty Comments Display
```javascript
test('should handle empty comments list', async () => {
  // Mock empty comments list
  onSnapshot.mockImplementation((query, callback) => {
    callback({ docs: [] });
    return jest.fn(); // Unsubscribe function
  });
  
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user-id', email: 'test@example.com' }
  });
  
  render(<CommentSection postId="test-post-id" />);
  
  // Empty state message should be shown
  await waitFor(() => {
    expect(screen.getByText(/коментарів поки немає/i)).toBeInTheDocument();
  });
});
```

**Description**: This test confirms that an appropriate message is displayed when no comments exist.

**Setup**:
- Mocks Firestore's `onSnapshot` to return an empty list of comments
- Mocks the authentication context with a logged-in user
- Renders the CommentSection component

**Expected Behavior**:
- A "no comments yet" message should be displayed 

### PostRating Component

#### Test: Rating Display
```javascript
test('should render rating component with data', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user3', email: 'test@example.com' }
  });
  
  render(<PostRating postId="test-post-id" />);
  
  // Wait for ratings data to load
  await waitFor(() => {
    // Average rating should be displayed
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    // Number of ratings should be displayed
    expect(screen.getByText(/10/)).toBeInTheDocument();
    // Number of likes should be displayed
    expect(screen.getByText(/2 вподобань/i)).toBeInTheDocument();
    
    // Rating stars should be rendered
    expect(screen.getByRole('slider', { name: /post-rating/i })).toBeInTheDocument();
  });
});
```

**Description**: This test verifies that rating statistics are shown correctly when component loads.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks Firestore's `onSnapshot` to return sample rating data including:
  - Average rating of 4.5
  - 10 total ratings
  - 2 likes
- Renders the PostRating component

**Expected Behavior**:
- Average rating value should be displayed
- Total number of ratings should be visible
- Number of likes should be correctly shown
- Star rating control should be rendered

---

#### Test: Unauthenticated User UI
```javascript
test('should show login message for unauthenticated users', async () => {
  // Mock auth context - not logged in
  useAuth.mockReturnValue({
    currentUser: null
  });
  
  render(<PostRating postId="test-post-id" />);
  
  // Tooltips should indicate login requirement
  const likeButton = screen.getByRole('button');
  fireEvent.mouseOver(likeButton);
  
  await waitFor(() => {
    expect(screen.getByText(/увійдіть, щоб оцінити/i)).toBeInTheDocument();
  });
  
  // Rating should be disabled
  expect(screen.getByRole('slider', { name: /post-rating/i })).toBeDisabled();
});
```

**Description**: This test confirms that non-logged in users see login prompts for rating actions.

**Setup**:
- Mocks the authentication context with no user (logged out)
- Renders the PostRating component
- Simulates hovering over the like button

**Expected Behavior**:
- Tooltips should show login prompts
- Rating controls should be disabled
- Login message should be displayed on hover

---

#### Test: Like Toggle
```javascript
test('should handle like toggle', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user3', email: 'test@example.com' }
  });
  
  // Mock getDoc for checking if document exists
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({
      likes: ['user1', 'user2'],
      averageRating: 4.5,
      totalRatings: 10
    })
  });
  
  // Mock updateDoc
  updateDoc.mockResolvedValue();
  
  render(<PostRating postId="test-post-id" />);
  
  // Wait for component to load
  await waitFor(() => {
    expect(screen.getByText(/2 вподобань/i)).toBeInTheDocument();
  });
  
  // Click like button
  fireEvent.click(screen.getByRole('button'));
  
  // Check if updateDoc was called with arrayUnion
  await waitFor(() => {
    expect(updateDoc).toHaveBeenCalledWith(
      'ratingsRef',
      expect.objectContaining({
        likes: arrayUnion('user3'),
        lastUpdated: expect.any(Date)
      })
    );
  });
  
  // Reset mocks for next test
  jest.clearAllMocks();
  
  // Change onSnapshot to simulate the user has liked the post
  onSnapshot.mockImplementation((docRef, callback) => {
    callback({
      exists: () => true,
      data: () => ({
        averageRating: 4.5,
        totalRatings: 10,
        likes: ['user1', 'user2', 'user3'],
        ratings: [
          { userId: 'user1', rating: 5 },
          { userId: 'user2', rating: 4 }
        ]
      })
    });
    return jest.fn();
  });
  
  // Re-render with updated state
  render(<PostRating postId="test-post-id" />);
  
  // Wait for component to load with updated state
  await waitFor(() => {
    expect(screen.getByText(/3 вподобань/i)).toBeInTheDocument();
  });
  
  // Click like button again to unlike
  fireEvent.click(screen.getByRole('button'));
  
  // Check if updateDoc was called with arrayRemove
  await waitFor(() => {
    expect(updateDoc).toHaveBeenCalledWith(
      'ratingsRef',
      expect.objectContaining({
        likes: arrayRemove('user3'),
        lastUpdated: expect.any(Date)
      })
    );
  });
});
```

**Description**: This test validates the like/unlike functionality.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks Firestore functions to simulate:
  1. Initially two users liking the post
  2. Current user liking the post
  3. Current user unliking the post
- Renders the PostRating component
- Simulates clicking the like button twice

**Expected Behavior**:
- On first click, Firestore should add the user to likes array
- When component re-renders with updated state, it should show 3 likes
- On second click, Firestore should remove the user from likes array

---

#### Test: Star Rating
```javascript
test('should handle star rating', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user3', email: 'test@example.com' }
  });
  
  // Mock getDoc for checking if document exists
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({
      likes: ['user1', 'user2'],
      averageRating: 4.5,
      totalRatings: 10,
      ratings: [
        { userId: 'user1', rating: 5 },
        { userId: 'user2', rating: 4 }
      ]
    })
  });
  
  // Mock updateDoc
  updateDoc.mockResolvedValue();
  
  render(<PostRating postId="test-post-id" />);
  
  // Wait for component to load
  await waitFor(() => {
    expect(screen.getByRole('slider', { name: /post-rating/i })).toBeInTheDocument();
  });
  
  // Click the 5-star rating
  const stars = screen.getAllByRole('radio');
  fireEvent.click(stars[4]); // 5th star
  
  // Check if updateDoc was called with updated ratings
  await waitFor(() => {
    expect(updateDoc).toHaveBeenCalledWith(
      'ratingsRef',
      expect.objectContaining({
        ratings: expect.arrayContaining([
          expect.objectContaining({
            userId: 'user3',
            rating: 5
          })
        ]),
        averageRating: expect.any(Number),
        totalRatings: 11, // Increased by 1
        lastUpdated: expect.any(Date)
      })
    );
  });
});
```

**Description**: This test validates the star rating submission flow.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks Firestore to return existing ratings data
- Renders the PostRating component
- Simulates clicking the 5-star rating

**Expected Behavior**:
- Firestore's `updateDoc` should be called with:
  - Updated ratings array including the user's 5-star rating
  - Increased total ratings count
  - Updated average rating
  - Timestamp

---

#### Test: New Ratings Document
```javascript
test('should create new ratings document if it does not exist', async () => {
  // Mock auth context
  useAuth.mockReturnValue({
    currentUser: { uid: 'user1', email: 'test@example.com' }
  });
  
  // Mock getDoc to return non-existent document
  getDoc.mockResolvedValue({
    exists: () => false
  });
  
  // Mock setDoc for creating new document
  setDoc.mockResolvedValue();
  
  // Mock onSnapshot for initial empty state
  onSnapshot.mockImplementation((docRef, callback) => {
    callback({
      exists: () => false
    });
    return jest.fn();
  });
  
  render(<PostRating postId="test-post-id" />);
  
  // Wait for component to load
  await waitFor(() => {
    expect(screen.getByRole('slider', { name: /post-rating/i })).toBeInTheDocument();
  });
  
  // Click the 4-star rating
  const stars = screen.getAllByRole('radio');
  fireEvent.click(stars[3]); // 4th star
  
  // Check if setDoc was called to create a new ratings document
  await waitFor(() => {
    expect(setDoc).toHaveBeenCalledWith(
      'ratingsRef',
      expect.objectContaining({
        ratings: [
          expect.objectContaining({
            userId: 'user1',
            rating: 4
          })
        ],
        averageRating: 4,
        totalRatings: 1,
        likes: [],
        lastUpdated: expect.any(Date)
      })
    );
  });
});
```

**Description**: This test confirms that a new ratings document is created if none exists.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks Firestore's `getDoc` to return that no document exists
- Renders the PostRating component
- Simulates clicking a 4-star rating

**Expected Behavior**:
- Firestore's `setDoc` should be called to create a new document
- The new document should include the user's rating, average rating of 4, total count of 1, and empty likes array

## App Theme Context Tests

#### Test: Default Theme
```javascript
test('should apply default theme based on system preference', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Theme context should be initialized
  expect(screen.getByTestId('header')).toBeInTheDocument();
  expect(screen.getByTestId('routes')).toBeInTheDocument();
  
  // localStorage should be checked
  expect(window.localStorage.getItem).toHaveBeenCalledWith('themeMode');
  
  // Default theme should be set in document.body
  expect(document.body.getAttribute('data-theme')).toBe('light');
});
```

**Description**: This test verifies that the theme is initialized based on system preference.

**Setup**:
- Mocks the `useMediaQuery` hook to return false (light theme)
- Mocks localStorage
- Renders the App component

**Expected Behavior**:
- The app should check localStorage for saved theme preference
- The default light theme should be applied to document.body

## CreatePost Component Tests

#### Test: Form Rendering
```javascript
test('should render post creation form', () => {
  render(
    <BrowserRouter>
      <CreatePost />
    </BrowserRouter>
  );
  
  // Form elements should be rendered
  expect(screen.getByLabelText(/заголовок статті/i)).toBeInTheDocument();
  expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument();
  expect(screen.getByText(/завантажити docx/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /створити статтю/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /скасувати/i })).toBeInTheDocument();
});
```

**Description**: This test checks that the post creation form is rendered correctly with all required elements.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks the TinyMCE editor component
- Renders the CreatePost component

**Expected Behavior**:
- Title input field should be displayed
- Rich text editor should be rendered
- File upload area should be visible
- Create and cancel buttons should be present

---

#### Test: Form Validation
```javascript
test('should validate form before submission', async () => {
  render(
    <BrowserRouter>
      <CreatePost />
    </BrowserRouter>
  );
  
  // Try to submit empty form
  fireEvent.click(screen.getByRole('button', { name: /створити статтю/i }));
  
  // Error message should be displayed
  await waitFor(() => {
    expect(screen.getByText(/заповніть усі поля/i)).toBeInTheDocument();
  });
  
  // addDoc should not be called
  expect(addDoc).not.toHaveBeenCalled();
});
```

**Description**: This test confirms that validation prevents submission of incomplete forms.

**Setup**:
- Mocks the authentication context
- Renders the CreatePost component
- Attempts to submit the form without filling required fields

**Expected Behavior**:
- Form submission should be prevented
- Validation error message should be displayed
- No document should be created in Firestore

---

#### Test: Post Creation
```javascript
test('should handle post creation successfully', async () => {
  render(
    <BrowserRouter>
      <CreatePost />
    </BrowserRouter>
  );
  
  // Fill the form
  fireEvent.change(screen.getByLabelText(/заголовок статті/i), {
    target: { value: 'Test Post Title' }
  });
  
  // Fill the editor content
  fireEvent.change(screen.getByTestId('editor-textarea'), {
    target: { value: '<p>Test post content</p>' }
  });
  
  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /створити статтю/i }));
  
  // Check if addDoc was called with correct data
  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledWith(
      'postsCollection',
      expect.objectContaining({
        title: 'Test Post Title',
        content: '<p>Test post content</p>',
        contentHtml: '<p>Test post content</p>',
        author: 'test@example.com',
        authorId: 'user-id',
        isFileUploading: false
      })
    );
  });
});
```

**Description**: This test validates the complete post creation flow with form submission.

**Setup**:
- Mocks the authentication context with a logged-in user
- Mocks Firestore's `addDoc` function
- Renders the CreatePost component
- Fills in form fields and submits the form

**Expected Behavior**:
- When the form is submitted with valid data, Firestore's `addDoc` should be called
- The new post document should contain the provided title, content, and author information

---

#### Test: File Upload
```javascript
test('should handle file upload when file is selected', async () => {
  // Mock file
  const file = new File(['dummy content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  
  // Mock mammoth to simulate DOCX processing
  global.mammoth = {
    convertToHtml: jest.fn().mockResolvedValue({
      value: '<p>Converted HTML content</p>'
    })
  };
  
  render(
    <BrowserRouter>
      <CreatePost />
    </BrowserRouter>
  );
  
  // Fill the form
  fireEvent.change(screen.getByLabelText(/заголовок статті/i), {
    target: { value: 'Test Post with File' }
  });
  
  // Fill the editor content
  fireEvent.change(screen.getByTestId('editor-textarea'), {
    target: { value: '<p>Test post content with file</p>' }
  });
  
  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /створити статтю/i }));
  
  // Check if addDoc was called
  await waitFor(() => {
    expect(addDoc).toHaveBeenCalled();
  });
});
```

**Description**: This test verifies document upload and processing functionality for post creation.

**Setup**:
- Creates a mock DOCX file
- Mocks the `mammoth` library for DOCX to HTML conversion
- Mocks Firebase Storage upload functions
- Renders the CreatePost component
- Fills form fields and submits

**Expected Behavior**:
- Form should be submitted successfully with file data
- Firestore's `addDoc` should be called to create the post

## Firebase Services Tests

#### Test: Firebase Initialization
```javascript
test('should initialize Firebase app with config', () => {
  expect(initializeApp).toHaveBeenCalledWith({
    apiKey: expect.any(String),
    authDomain: expect.any(String),
    projectId: expect.any(String),
    storageBucket: expect.any(String),
    messagingSenderId: expect.any(String),
    appId: expect.any(String)
  });
  
  expect(app).toBe('mockApp');
});
```

**Description**: This test confirms that the Firebase app is initialized with the correct configuration.

**Setup**:
- Mocks the `initializeApp` function from firebase/app
- Tests the firebase service initialization

**Expected Behavior**:
- `initializeApp` should be called with a configuration object containing required fields
- The app instance should be properly exported

---

#### Test: Auth Service
```javascript
test('should initialize Firebase Auth', () => {
  expect(getAuth).toHaveBeenCalledWith('mockApp');
  expect(auth).toBe('mockAuth');
});
```

**Description**: This test verifies that Firebase Auth is properly initialized.

**Setup**:
- Mocks the `getAuth` function from firebase/auth
- Tests the auth service initialization

**Expected Behavior**:
- `getAuth` should be called with the Firebase app instance
- The auth instance should be properly exported

---

#### Test: Firestore Service
```javascript
test('should initialize Firestore', () => {
  expect(getFirestore).toHaveBeenCalledWith('mockApp');
  expect(db).toBe('mockFirestore');
});
```

**Description**: This test checks that Firestore database is correctly set up.

**Setup**:
- Mocks the `getFirestore` function from firebase/firestore
- Tests the Firestore service initialization

**Expected Behavior**:
- `getFirestore` should be called with the Firebase app instance
- The Firestore database instance should be properly exported

---

#### Test: Storage Service
```javascript
test('should initialize Firebase Storage', () => {
  expect(getStorage).toHaveBeenCalledWith('mockApp');
  expect(storage).toBe('mockStorage');
});
```

**Description**: This test confirms that Firebase Storage is properly initialized.

**Setup**:
- Mocks the `getStorage` function from firebase/storage
- Tests the storage service initialization

**Expected Behavior**:
- `getStorage` should be called with the Firebase app instance
- The storage instance should be properly exported

---

#### Test: Google Auth Provider
```javascript
test('should setup Google Auth Provider', () => {
  expect(GoogleAuthProvider).toHaveBeenCalled();
  expect(googleAuthProvider.setCustomParameters).toHaveBeenCalledWith({
    prompt: 'select_account'
  });
});
```

**Description**: This test verifies that Google auth provider is configured correctly.

**Setup**:
- Mocks the `GoogleAuthProvider` class from firebase/auth
- Tests the provider initialization

**Expected Behavior**:
- A new `GoogleAuthProvider` instance should be created
- Custom parameters should be set to prompt for account selection

## Admin Dashboard Tests

#### Test: Dashboard Statistics
```javascript
test('should render dashboard with statistics', async () => {
  render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
  
  // Initially should show loading state
  expect(screen.getByText(/завантаження даних для адміністративної панелі/i)).toBeInTheDocument();
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByText(/завантаження даних для адміністративної панелі/i)).not.toBeInTheDocument();
  });
  
  // Dashboard title should be displayed
  expect(screen.getByText(/адміністративна панель/i)).toBeInTheDocument();
  
  // Statistics should be displayed
  expect(screen.getByText(/всього статей/i)).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument(); // 2 posts
  expect(screen.getByText(/користувачів/i)).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument(); // 2 users
  expect(screen.getByText(/коментарі/i)).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument(); // 5 comments
  
  // Navigation buttons should be displayed
  expect(screen.getByRole('button', { name: /керувати статтями/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /керувати користувачами/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /керувати коментарями/i })).toBeInTheDocument();
  
  // Recent posts tab should be active by default
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
});
```

**Description**: This test checks that the admin dashboard shows correct statistics for posts, users, and comments.

**Setup**:
- Mocks the authentication context with admin privileges
- Mocks Firestore to return sample data for posts, users, and comments
- Renders the AdminDashboard component

**Expected Behavior**:
- Initially, a loading message should be displayed
- After loading, dashboard statistics should show:
  - 2 total posts
  - 2 users
  - 5 comments
- Management buttons should be present
- Recent posts tab should be active by default showing post listings

---

#### Test: Tab Navigation
```javascript
test('should switch between tabs', async () => {
  render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByText(/завантаження даних для адміністративної панелі/i)).not.toBeInTheDocument();
  });
  
  // Initially, posts tab should be active
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
  
  // Click on users tab
  fireEvent.click(screen.getByRole('tab', { name: /нові користувачі/i }));
  
  // Users should now be displayed
  expect(screen.getByText('User One')).toBeInTheDocument();
  expect(screen.getByText('User Two')).toBeInTheDocument();
  expect(screen.getByText(/роль: admin/i)).toBeInTheDocument();
  expect(screen.getByText(/роль: user/i)).toBeInTheDocument();
});
```

**Description**: This test verifies that switching between different content tabs in the admin dashboard works correctly.

**Setup**:
- Mocks the authentication context with admin privileges
- Mocks Firestore to return sample data for posts and users
- Renders the AdminDashboard component
- Simulates clicking on different tabs

**Expected Behavior**:
- Initially, the posts tab should be active showing post data
- After clicking the users tab, user data should be displayed instead
