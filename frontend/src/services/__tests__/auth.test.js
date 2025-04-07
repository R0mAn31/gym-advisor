import {
    doCreateUserWithEmailAndPassword,
    doSignInWithEmailAndPassword,
    doSignInWithGoogle,
    doSignOut,
    getErrorMessage
  } from '../../services/auth';
  import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    sendEmailVerification
  } from "firebase/auth";
  
  // Mock Firebase modules
  jest.mock('firebase/auth');
  
  describe('Authentication Service', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    test('should register a new user successfully', async () => {
      // Mock implementation
      const userCredential = {
        user: { uid: '123', email: 'test@example.com' }
      };
      createUserWithEmailAndPassword.mockResolvedValue(userCredential);
      updateProfile.mockResolvedValue();
      sendEmailVerification.mockResolvedValue();
  
      // Call the function
      const result = await doCreateUserWithEmailAndPassword('test@example.com', 'password123', 'Test User');
  
      // Assertions
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(updateProfile).toHaveBeenCalled();
      expect(sendEmailVerification).toHaveBeenCalled();
      expect(result.user).toEqual(userCredential.user);
      expect(result.error).toBeNull();
    });
  
    test('should handle registration error', async () => {
      // Mock implementation for error
      const errorMock = { code: 'auth/email-already-in-use' };
      createUserWithEmailAndPassword.mockRejectedValue(errorMock);
  
      // Call the function
      const result = await doCreateUserWithEmailAndPassword('test@example.com', 'password123');
  
      // Assertions
      expect(createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(result.user).toBeNull();
      expect(result.error).toBe('Користувач з таким email вже існує.');
    });
  
    test('should sign in user with email and password', async () => {
      // Mock implementation
      const userCredential = {
        user: { uid: '123', email: 'test@example.com' }
      };
      signInWithEmailAndPassword.mockResolvedValue(userCredential);
  
      // Call the function
      const result = await doSignInWithEmailAndPassword('test@example.com', 'password123');
  
      // Assertions
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(result.user).toEqual(userCredential.user);
      expect(result.error).toBeNull();
    });
  
    test('should handle sign in error', async () => {
      // Mock implementation for error
      const errorMock = { code: 'auth/wrong-password' };
      signInWithEmailAndPassword.mockRejectedValue(errorMock);
  
      // Call the function
      const result = await doSignInWithEmailAndPassword('test@example.com', 'wrong-password');
  
      // Assertions
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(result.user).toBeNull();
      expect(result.error).toBe('Невірний пароль.');
    });
  
    test('should sign in with Google', async () => {
      // Mock implementation
      const userCredential = {
        user: { uid: '123', email: 'test@gmail.com', displayName: 'Test User' }
      };
      signInWithPopup.mockResolvedValue(userCredential);
  
      // Call the function
      const result = await doSignInWithGoogle();
  
      // Assertions
      expect(signInWithPopup).toHaveBeenCalled();
      expect(result.user).toEqual(userCredential.user);
      expect(result.error).toBeNull();
    });
  
    test('should sign out user', async () => {
      // Mock implementation
      signOut.mockResolvedValue();
  
      // Call the function
      const result = await doSignOut();
  
      // Assertions
      expect(signOut).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });
  
    test('should return appropriate error messages', () => {
      // Test various error codes
      expect(getErrorMessage('auth/user-not-found')).toBe('Користувача з таким email не знайдено.');
      expect(getErrorMessage('auth/wrong-password')).toBe('Невірний пароль.');
      expect(getErrorMessage('auth/unknown-error')).toBe('Помилка: auth/unknown-error');
    });
  });
  
  // AuthContext Tests
  // File: src/contexts/__tests__/AuthContext.test.js
  
  import React from 'react';
  import { render, screen, act } from '@testing-library/react';
  import { AuthProvider, useAuth } from '../../contexts/AuthContext';
  import { onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  
  // Mock Firebase modules
  jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
    GoogleAuthProvider: {
      PROVIDER_ID: 'google.com'
    }
  }));
  
  jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn()
  }));
  
  // Test component to access auth context
  const TestComponent = () => {
    const { 
      userLoggedIn, 
      currentUser, 
      isAdmin,
      loading 
    } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    return (
      <div>
        <div data-testid="logged-in">{userLoggedIn ? 'Logged In' : 'Logged Out'}</div>
        <div data-testid="is-admin">{isAdmin ? 'Admin' : 'Not Admin'}</div>
        <div data-testid="user-email">{currentUser?.email || 'No User'}</div>
      </div>
    );
  };
  
  describe('AuthContext', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should show loading state initially', () => {
      // Mock auth state, but don't resolve yet
      onAuthStateChanged.mockImplementation(() => {
        return () => {}; // Return unsubscribe function
      });
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  
    test('should handle logged out state', async () => {
      // Mock auth state with no user
      onAuthStateChanged.mockImplementation(auth, callback => {
        // Call the callback with null for logged out
        callback(null);
        return () => {}; // Return unsubscribe function
      });
      
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });
      
      expect(screen.getByTestId('logged-in')).toHaveTextContent('Logged Out');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });
  
    test('should handle logged in state with regular user', async () => {
      // Mock user data
      const mockUser = {
        uid: '123',
        email: 'user@example.com',
        providerData: [{ providerId: 'password' }]
      };
      
      // Mock user profile data
      const mockUserProfile = {
        uid: '123',
        email: 'user@example.com',
        role: 'user',
        displayName: 'Test User'
      };
      
      // Mock auth state with user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        // Call the callback with mock user for logged in
        callback(mockUser);
        return () => {}; // Return unsubscribe function
      });
      
      // Mock Firestore getDoc
      const mockDocSnapshot = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue(mockUserProfile)
      };
      
      doc.mockReturnValue('userDocRef');
      getDoc.mockResolvedValue(mockDocSnapshot);
      
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });
      
      expect(screen.getByTestId('logged-in')).toHaveTextContent('Logged In');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com');
    });
  
    test('should handle logged in state with admin user', async () => {
      // Mock user data
      const mockUser = {
        uid: '456',
        email: 'admin@example.com',
        providerData: [{ providerId: 'password' }]
      };
      
      // Mock user profile data with admin role
      const mockUserProfile = {
        uid: '456',
        email: 'admin@example.com',
        role: 'admin',
        displayName: 'Admin User'
      };
      
      // Mock auth state with user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        // Call the callback with mock user for logged in
        callback(mockUser);
        return () => {}; // Return unsubscribe function
      });
      
      // Mock Firestore getDoc
      const mockDocSnapshot = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue(mockUserProfile)
      };
      
      doc.mockReturnValue('userDocRef');
      getDoc.mockResolvedValue(mockDocSnapshot);
      
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });
      
      expect(screen.getByTestId('logged-in')).toHaveTextContent('Logged In');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('Admin');
      expect(screen.getByTestId('user-email')).toHaveTextContent('admin@example.com');
    });
  
    test('should create new user profile if it does not exist', async () => {
      // Mock user data
      const mockUser = {
        uid: '789',
        email: 'new@example.com',
        providerData: [{ providerId: 'google.com' }]
      };
      
      // Mock auth state with user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        // Call the callback with mock user for logged in
        callback(mockUser);
        return () => {}; // Return unsubscribe function
      });
      
      // Mock Firestore getDoc - user does not exist
      const mockDocSnapshot = {
        exists: jest.fn().mockReturnValue(false)
      };
      
      // Mock auth.currentUser for the fetchUserProfile function
      Object.defineProperty(auth, 'currentUser', {
        value: mockUser,
        writable: true
      });
      
      doc.mockReturnValue('userDocRef');
      getDoc.mockResolvedValue(mockDocSnapshot);
      setDoc.mockResolvedValue();
      
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });
      
      // Verify setDoc was called to create new profile
      expect(setDoc).toHaveBeenCalledWith('userDocRef', expect.objectContaining({
        uid: '789',
        email: 'new@example.com',
        role: 'user'
      }));
      
      expect(screen.getByTestId('logged-in')).toHaveTextContent('Logged In');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
      expect(screen.getByTestId('user-email')).toHaveTextContent('new@example.com');
    });
  });
  
  // Component Tests
  // File: src/components/auth/__tests__/Login.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import Login from '../../components/auth/Login';
  import { useAuth } from '../../contexts/AuthContext';
  import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../services/auth';
  
  // Mock dependencies
  jest.mock('../../contexts/AuthContext');
  jest.mock('../../services/auth');
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(() => <div data-testid="navigate" />)
  }));
  
  describe('Login Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should render login form when user is not logged in', () => {
      // Mock auth context
      useAuth.mockReturnValue({
        userLoggedIn: false
      });
  
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      // Check if form elements are rendered
      expect(screen.getByLabelText(/електронна пошта/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /увійти/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /увійти через google/i })).toBeInTheDocument();
    });
  
    test('should redirect when user is already logged in', () => {
      // Mock auth context
      useAuth.mockReturnValue({
        userLoggedIn: true
      });
  
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      // Check if Navigate component is rendered
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
  
    test('should handle email/password login', async () => {
      // Mock auth context
      useAuth.mockReturnValue({
        userLoggedIn: false
      });
  
      // Mock auth service
      doSignInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' },
        error: null
      });
  
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      // Fill the form
      fireEvent.change(screen.getByLabelText(/електронна пошта/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/пароль/i), {
        target: { value: 'password123' }
      });
  
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /увійти/i }));
  
      // Check if auth service was called
      await waitFor(() => {
        expect(doSignInWithEmailAndPassword).toHaveBeenCalledWith(
          'test@example.com',
          'password123'
        );
      });
    });
  
    test('should display error message on login failure', async () => {
      // Mock auth context
      useAuth.mockReturnValue({
        userLoggedIn: false
      });
  
      // Mock auth service with error
      doSignInWithEmailAndPassword.mockResolvedValue({
        user: null,
        error: 'Невірний пароль'
      });
  
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      // Fill the form
      fireEvent.change(screen.getByLabelText(/електронна пошта/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/пароль/i), {
        target: { value: 'wrong-password' }
      });
  
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /увійти/i }));
  
      // Check if error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Невірний пароль')).toBeInTheDocument();
      });
    });
  
    test('should handle Google login', async () => {
      // Mock auth context
      useAuth.mockReturnValue({
        userLoggedIn: false
      });
  
      // Mock auth service
      doSignInWithGoogle.mockResolvedValue({
        user: { uid: '123', email: 'test@gmail.com' },
        error: null
      });
  
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      // Click Google login button
      fireEvent.click(screen.getByRole('button', { name: /увійти через google/i }));
  
      // Check if auth service was called
      await waitFor(() => {
        expect(doSignInWithGoogle).toHaveBeenCalled();
      });
    });
  
    test('should toggle password visibility', () => {
      // Mock auth context
      useAuth.mockReturnValue({
        userLoggedIn: false
      });
  
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      // Initially password field should be of type password (hidden)
      expect(screen.getByLabelText(/пароль/i)).toHaveAttribute('type', 'password');
  
      // Click visibility toggle button
      fireEvent.click(screen.getByRole('button', { name: /toggle password/i }));
  
      // Password should now be visible (type text)
      expect(screen.getByLabelText(/пароль/i)).toHaveAttribute('type', 'text');
  
      // Click again to hide
      fireEvent.click(screen.getByRole('button', { name: /toggle password/i }));
  
      // Password should be hidden again
      expect(screen.getByLabelText(/пароль/i)).toHaveAttribute('type', 'password');
    });
  });
  
  // Protected Route Tests
  // File: src/components/auth/__tests__/ProtectedRoute.test.js
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import ProtectedRoute from '../../components/auth/ProtectedRoute';
  import { useAuth } from '../../contexts/AuthContext';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(() => <div data-testid="navigate-to-login" />)
  }));
  
  describe('ProtectedRoute Component', () => {
    test('should render children when user is logged in', () => {
      // Mock auth context with logged in user
      useAuth.mockReturnValue({
        userLoggedIn: true
      });
  
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      );
  
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-to-login')).not.toBeInTheDocument();
    });
  
    test('should navigate to login when user is not logged in', () => {
      // Mock auth context with logged out user
      useAuth.mockReturnValue({
        userLoggedIn: false
      });
  
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      );
  
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate-to-login')).toBeInTheDocument();
    });
  });
  
  // Admin Route Tests
  // File: src/components/auth/__tests__/AdminRoute.test.js
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import AdminRoute from '../../components/auth/AdminRoute';
  import { useAuth } from '../../contexts/AuthContext';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(() => <div data-testid="navigate-to-login" />),
    Link: jest.fn(({ to, children }) => <a href={to} data-testid="link">{children}</a>)
  }));
  
  describe('AdminRoute Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should show loading while checking auth status', () => {
      // Mock auth context with loading state
      useAuth.mockReturnValue({
        userLoggedIn: true,
        isAdmin: false,
        loading: true
      });
  
      render(
        <BrowserRouter>
          <AdminRoute>
            <div data-testid="admin-content">Admin Content</div>
          </AdminRoute>
        </BrowserRouter>
      );
  
      expect(screen.getByText(/перевірка прав доступу/i)).toBeInTheDocument();
    });
  
    test('should navigate to login when user is not logged in', () => {
      // Mock auth context with logged out user
      useAuth.mockReturnValue({
        userLoggedIn: false,
        isAdmin: false,
        loading: false
      });
  
      render(
        <BrowserRouter>
          <AdminRoute>
            <div data-testid="admin-content">Admin Content</div>
          </AdminRoute>
        </BrowserRouter>
      );
  
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate-to-login')).toBeInTheDocument();
    });
  
    test('should show access denied message when user is not an admin', () => {
      // Mock auth context with regular user
      useAuth.mockReturnValue({
        userLoggedIn: true,
        isAdmin: false,
        loading: false
      });
  
      render(
        <BrowserRouter>
          <AdminRoute>
            <div data-testid="admin-content">Admin Content</div>
          </AdminRoute>
        </BrowserRouter>
      );
  
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
      expect(screen.getByText(/доступ заборонено/i)).toBeInTheDocument();
      expect(screen.getByText(/немає прав доступу/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /повернутися на головну/i })).toBeInTheDocument();
    });
  
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
  });
  
  // Header Component Tests
  // File: src/components/auth/__tests__/Header.test.js
  
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import Header from '../../components/auth/Header';
  import { useAuth } from '../../contexts/AuthContext';
  import { doSignOut } from '../../services/auth';
  import { ColorModeContext } from '../../App';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('../../services/auth');
  jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));
  
  describe('Header Component', () => {
    const toggleColorMode = jest.fn();
    const mockTheme = { palette: { mode: 'light' } };
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    const renderHeader = (userLoggedIn = false, isAdmin = false) => {
      useAuth.mockReturnValue({
        userLoggedIn,
        isAdmin,
        currentUser: userLoggedIn ? { email: 'test@example.com' } : null
      });
      
      doSignOut.mockResolvedValue({ success: true });
      
      return render(
        <BrowserRouter>
          <ColorModeContext.Provider value={{ toggleColorMode, mode: 'light' }}>
            <Header />
          </ColorModeContext.Provider>
        </BrowserRouter>
      );
    };
    
    test('should render logo and navigation links', () => {
      renderHeader();
      
      expect(screen.getByText(/блог-платформа/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /головна/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /спортзали/i })).toBeInTheDocument();
    });
    
    test('should render login and register links when user is not logged in', () => {
      renderHeader(false);
      
      expect(screen.getByRole('link', { name: /увійти/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /зареєструватися/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /вийти/i })).not.toBeInTheDocument();
    });
    
    test('should render create post and logout buttons when user is logged in', () => {
      renderHeader(true);
      
      expect(screen.queryByRole('link', { name: /увійти/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /зареєструватися/i })).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: /створити статтю/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /вийти/i })).toBeInTheDocument();
    });
    
    test('should render admin panel link when user is an admin', () => {
      renderHeader(true, true);
      
      expect(screen.getByRole('link', { name: /адмін-панель/i })).toBeInTheDocument();
    });
    
    test('should not render admin panel link for regular users', () => {
      renderHeader(true, false);
      
      expect(screen.queryByRole('link', { name: /адмін-панель/i })).not.toBeInTheDocument();
    });
    
    test('should handle logout when logout button is clicked', async () => {
      renderHeader(true);
      
      fireEvent.click(screen.getByRole('button', { name: /вийти/i }));
      
      expect(doSignOut).toHaveBeenCalled();
    });
    
    test('should handle theme toggle', () => {
      renderHeader();
      
      fireEvent.click(screen.getByRole('button', { name: /темна тема/i }));
      
      expect(toggleColorMode).toHaveBeenCalled();
    });
  });
  
  // PostDetail Component Tests
  // File: src/components/posts/__tests__/PostDetail.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import PostDetail from '../../components/posts/PostDetail';
  import { useAuth } from '../../contexts/AuthContext';
  import { doc, getDoc, deleteDoc } from 'firebase/firestore';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('firebase/firestore');
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: 'test-post-id' }),
    useNavigate: () => jest.fn()
  }));
  jest.mock('../../components/comments/CommentSection', () => () => (
    <div data-testid="comment-section">Comment Section Mock</div>
  ));
  jest.mock('../../components/posts/PostRating', () => ({ postId }) => (
    <div data-testid="post-rating">Post Rating Mock for {postId}</div>
  ));
  
  describe('PostDetail Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    const mockPost = {
      id: 'test-post-id',
      title: 'Test Post Title',
      content: '<p>Test post content</p>',
      author: 'test@example.com',
      createdAt: { toDate: () => new Date('2023-01-01') },
      fileName: 'test-document.docx',
      fileUrl: 'https://example.com/test-document.docx'
    };
    
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
  });
  
  // GymMap Component Tests
  // File: src/components/gyms/__tests__/GymMap.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import GymMap from '../../components/gyms/GymMap';
  import { collection, getDocs, query } from 'firebase/firestore';
  import { useAuth } from '../../contexts/AuthContext';
  
  // Mock dependencies
  jest.mock('firebase/firestore');
  jest.mock('../../contexts/AuthContext');
  jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children }) => <div data-testid="map-marker">{children}</div>,
    Popup: ({ children }) => <div data-testid="map-popup">{children}</div>,
    useMap: () => ({ setView: jest.fn() }),
    Circle: () => <div data-testid="map-circle" />,
  }));
  
  // Mock L from leaflet
  jest.mock('leaflet', () => ({
    Icon: {
      Default: {
        prototype: {
          _getIconUrl: {}
        },
        mergeOptions: jest.fn()
      }
    },
    icon: jest.fn().mockReturnValue({}),
    Icon: jest.fn().mockImplementation(() => ({}))
  }));
  
  describe('GymMap Component', () => {
    const mockGyms = [
      {
        id: 'gym1',
        name: 'Fitness Club',
        type: 'gym',
        address: '123 Main St, City',
        location: { lat: 49.8397, lng: 24.0297 },
        rating: '4.5',
        reviewsCount: 10
      },
      {
        id: 'gym2',
        name: 'Yoga Studio',
        type: 'yoga',
        address: '456 Oak St, City',
        location: { lat: 49.8450, lng: 24.0350 },
        rating: '4.8',
        reviewsCount: 15
      }
    ];
    
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Mock Firestore
      collection.mockReturnValue('gymsCollection');
      query.mockReturnValue('gymsQuery');
      getDocs.mockResolvedValue({
        docs: mockGyms.map(gym => ({
          id: gym.id,
          data: () => gym
        }))
      });
      
      // Mock auth context
      useAuth.mockReturnValue({
        currentUser: null
      });
    });
    
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
  });
  
  // CommentSection Integration Tests
  // File: src/components/comments/__tests__/CommentSection.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import CommentSection from '../../components/comments/CommentSection';
  import { useAuth } from '../../contexts/AuthContext';
  import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('firebase/firestore');
  
  describe('CommentSection Component', () => {
    const mockComments = [
      {
        id: 'comment1',
        content: 'This is a test comment',
        author: 'user1@example.com',
        authorName: 'User One',
        createdAt: { toDate: () => new Date('2023-01-01T10:00:00') }
      },
      {
        id: 'comment2',
        content: 'Another test comment',
        author: 'user2@example.com',
        authorName: 'User Two',
        createdAt: { toDate: () => new Date('2023-01-02T10:00:00') }
      }
    ];
    
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Mock Firestore
      collection.mockReturnValue('commentsCollection');
      query.mockReturnValue('commentsQuery');
      where.mockReturnValue('whereQuery');
      orderBy.mockReturnValue('orderByQuery');
      
      // Mock onSnapshot to return comments
      onSnapshot.mockImplementation((query, callback) => {
        callback({
          docs: mockComments.map(comment => ({
            id: comment.id,
            data: () => comment
          }))
        });
        return jest.fn(); // Unsubscribe function
      });
      
      // Mock addDoc
      addDoc.mockResolvedValue({ id: 'new-comment-id' });
    });
    
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
  });
  
  // PostRating Component Tests
  // File: src/components/posts/__tests__/PostRating.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import PostRating from '../../components/posts/PostRating';
  import { useAuth } from '../../contexts/AuthContext';
  import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, onSnapshot } from 'firebase/firestore';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('firebase/firestore');
  
  describe('PostRating Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Mock Firestore
      doc.mockReturnValue('ratingsRef');
      
      // Mock onSnapshot for real-time updates
      onSnapshot.mockImplementation((docRef, callback) => {
        // Simulate an initial state for ratings
        callback({
          exists: () => true,
          data: () => ({
            averageRating: 4.5,
            totalRatings: 10,
            likes: ['user1', 'user2'],
            ratings: [
              { userId: 'user1', rating: 5 },
              { userId: 'user2', rating: 4 }
            ]
          })
        });
        return jest.fn(); // Unsubscribe function
      });
    });
    
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
  });
  
  // Theme Context Integration Test
  // File: src/App.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, act } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import App, { ColorModeContext } from '../../App';
  
  // Mock components to simplify the test
  jest.mock('../../components/auth/Header', () => () => (
    <div data-testid="header">
      <button data-testid="theme-toggle">Toggle Theme</button>
    </div>
  ));
  
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRoutes: () => <div data-testid="routes">Routes Content</div>
  }));
  
  // Mock localStorage
  const localStorageMock = (function() {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
  
  // Mock useMediaQuery
  jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn().mockReturnValue(false) // Default to light theme
  }));
  
  describe('App Component with Theme Context', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      window.localStorage.clear();
    });
    
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
  });
  
  // CreatePost Component Tests
  // File: src/components/posts/__tests__/CreatePost.test.js
  
  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import CreatePost from '../../components/posts/CreatePost';
  import { useAuth } from '../../contexts/AuthContext';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
  
  // Mock dependencies
  jest.mock('../../contexts/AuthContext');
  jest.mock('firebase/firestore');
  jest.mock('firebase/storage');
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
  }));
  jest.mock('@tinymce/tinymce-react', () => ({
    Editor: ({ onInit, onEditorChange }) => {
      // Store the ref for tests to access
      React.useEffect(() => {
        onInit(null, { setContent: jest.fn() });
      }, [onInit]);
      
      return (
        <div data-testid="tinymce-editor">
          <textarea
            data-testid="editor-textarea"
            onChange={(e) => onEditorChange(e.target.value)}
          />
        </div>
      );
    }
  }));
  jest.mock('react-dropzone', () => ({
    useDropzone: () => ({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false
    })
  }));
  
  describe('CreatePost Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Mock auth context
      useAuth.mockReturnValue({
        currentUser: { uid: 'user-id', email: 'test@example.com' }
      });
      
      // Mock Firestore
      collection.mockReturnValue('postsCollection');
      addDoc.mockResolvedValue({ id: 'new-post-id' });
      
      // Mock Firebase Storage
      ref.mockReturnValue({ fullPath: 'documents/user-id/file.docx' });
      uploadBytesResumable.mockReturnValue({
        on: jest.fn((event, progressCallback, errorCallback, completeCallback) => {
          // Simulate upload completion
          completeCallback();
        }),
        snapshot: { ref: {} }
      });
      getDownloadURL.mockResolvedValue('https://example.com/file.docx');
    });
    
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
  });
  
  // Firebase Services Integration Tests
  // File: src/services/__tests__/firebase.test.js
  
  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";
  import { getStorage } from "firebase/storage";
  import { app, auth, db, storage, googleAuthProvider } from '../../services/firebase';
  
  // Mock Firebase libraries
  jest.mock('firebase/app', () => ({
    initializeApp: jest.fn().mockReturnValue('mockApp')
  }));
  
  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn().mockReturnValue('mockAuth'),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn()
    }))
  }));
  
  jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn().mockReturnValue('mockFirestore')
  }));
  
  jest.mock('firebase/storage', () => ({
    getStorage: jest.fn().mockReturnValue('mockStorage')
  }));
  
  describe('Firebase Services', () => {
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
    
    test('should initialize Firebase Auth', () => {
      expect(getAuth).toHaveBeenCalledWith('mockApp');
      expect(auth).toBe('mockAuth');
    });
    
    test('should initialize Firestore', () => {
      expect(getFirestore).toHaveBeenCalledWith('mockApp');
      expect(db).toBe('mockFirestore');
    });
    
    test('should initialize Firebase Storage', () => {
      expect(getStorage).toHaveBeenCalledWith('mockApp');
      expect(storage).toBe('mockStorage');
    });
    
    test('should setup Google Auth Provider', () => {
      expect(GoogleAuthProvider).toHaveBeenCalled();
      expect(googleAuthProvider.setCustomParameters).toHaveBeenCalledWith({
        prompt: 'select_account'
      });
    });
  });
  
  // AdminDashboard Integration Tests
  // File: src/components/admin/__tests__/AdminDashboard.test.js
  
  import React from 'react';
  import { render, screen, waitFor } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import AdminDashboard from '../../components/admin/AdminDashboard';
  import { useAuth } from '../../contexts/AuthContext';
  import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
  
  jest.mock('../../contexts/AuthContext');
  jest.mock('firebase/firestore');
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
  }));
  
  describe('AdminDashboard Component', () => {
    const mockPosts = [
      {
        id: 'post1',
        title: 'First Post',
        author: 'user1@example.com',
        createdAt: { toDate: () => new Date('2023-01-01') }
      },
      {
        id: 'post2',
        title: 'Second Post',
        author: 'user2@example.com',
        createdAt: { toDate: () => new Date('2023-01-02') }
      }
    ];
    
    const mockUsers = [
      {
        id: 'user1',
        email: 'user1@example.com',
        displayName: 'User One',
        role: 'admin',
        createdAt: { toDate: () => new Date('2023-01-01') }
      },
      {
        id: 'user2',
        email: 'user2@example.com',
        displayName: 'User Two',
        role: 'user',
        createdAt: { toDate: () => new Date('2023-01-02') }
      }
    ];
    
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Mock auth context
      useAuth.mockReturnValue({
        currentUser: { 
          uid: 'admin-id', 
          email: 'admin@example.com',
          displayName: 'Admin User'
        },
        isAdmin: true
      });
      
      // Mock Firestore collections
      collection.mockImplementation((db, collectionName) => {
        return { collectionName };
      });
      
      query.mockReturnValue('mockQuery');
      orderBy.mockReturnValue('mockOrderBy');
      limit.mockReturnValue('mockLimit');
      where.mockReturnValue('mockWhere');
      
      // Mock getDocs for different collections
      getDocs.mockImplementation((q) => {
        if (q.collectionName === 'posts') {
          return Promise.resolve({
            size: mockPosts.length,
            docs: mockPosts.map(post => ({
              id: post.id,
              data: () => post
            }))
          });
        } else if (q.collectionName === 'users') {
          return Promise.resolve({
            size: mockUsers.length,
            docs: mockUsers.map(user => ({
              id: user.id,
              data: () => user
            }))
          });
        } else if (q.collectionName === 'comments') {
          return Promise.resolve({
            size: 5, // 5 comments total
            docs: []
          });
        } else {
          return Promise.resolve({ size: 0, docs: [] });
        }
      });
    });
    
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
  });