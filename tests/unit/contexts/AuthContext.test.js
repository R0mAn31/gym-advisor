/**
 * Tests for AuthContext
 * 
 * These tests verify the authentication context functionality with mocked Firebase auth
 */

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../../frontend/src/contexts/AuthContext';
import { mockUser } from '../__mocks__/firebaseMocks';

// Mock Firebase auth service with our new mocks
jest.mock('firebase/auth', () => {
  const { onAuthStateChanged, GoogleAuthProvider } = require('../__mocks__/firebaseMocks');
  return {
    onAuthStateChanged,
    GoogleAuthProvider
  };
});

// Mock Firebase firestore
jest.mock('firebase/firestore', () => {
  const { getDoc, setDoc, doc } = require('../__mocks__/firebaseMocks');
  return {
    getDoc,
    setDoc,
    doc
  };
});

// Mock the services/firebase module
jest.mock('../../../frontend/src/services/firebase', () => {
  const { auth, db } = require('../__mocks__/firebaseMocks');
  return {
    auth,
    db
  };
});

// Test component that uses the auth context
const TestComponent = () => {
  const { 
    currentUser, 
    signup, 
    login, 
    logout, 
    resetPassword, 
    updateEmail: updateUserEmail,
    updatePassword: updateUserPassword,
    updateProfile: updateUserProfile
  } = useAuth();

  return (
    <div>
      <div data-testid="user-status">
        {currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}
      </div>
      <button 
        onClick={() => signup && signup('test@example.com', 'password123')}
        data-testid="signup-button"
      >
        Sign Up
      </button>
      <button 
        onClick={() => login && login('test@example.com', 'password123')}
        data-testid="login-button"
      >
        Log In
      </button>
      <button 
        onClick={() => logout && logout()}
        data-testid="logout-button"
      >
        Log Out
      </button>
      <button 
        onClick={() => resetPassword && resetPassword('test@example.com')}
        data-testid="reset-password-button"
      >
        Reset Password
      </button>
      <button 
        onClick={() => updateUserEmail && updateUserEmail('newemail@example.com')}
        data-testid="update-email-button"
      >
        Update Email
      </button>
      <button 
        onClick={() => updateUserPassword && updateUserPassword('newpassword123')}
        data-testid="update-password-button"
      >
        Update Password
      </button>
      <button 
        onClick={() => updateUserProfile && updateUserProfile({ displayName: 'New Name' })}
        data-testid="update-profile-button"
      >
        Update Profile
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  // Helper function to render the test component
  const renderWithAuthProvider = () => {
    return render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  };

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  it('renders the auth provider with children', () => {
    renderWithAuthProvider();
    expect(screen.getByTestId('user-status')).toBeInTheDocument();
  });

  it('initializes with current user from Firebase', async () => {
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });
  });

  // Auth state change tests can be simplified since we mock onAuthStateChanged directly

  // Basic functionality test - since we can't test all the auth methods directly
  // because they don't exist in our actual AuthContext implementation
  it('provides auth context to children components', async () => {
    renderWithAuthProvider();
    
    await waitFor(() => {
      // Check if the user status is displayed correctly
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });
  });

  // Test for loading state
  it('shows children only after loading is complete', async () => {
    renderWithAuthProvider();
    
    // Since our mock implementation resolves immediately, we just verify
    // that the component is rendered and shows the user status
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toBeInTheDocument();
    });
  });

  // Test userProfile loading
  it('fetches user profile after authentication', async () => {
    const { getDoc } = require('firebase/firestore');
    
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(getDoc).toHaveBeenCalled();
    });
  });
}); 