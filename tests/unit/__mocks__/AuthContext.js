import React from 'react';

// Create a mock AuthContext
const AuthContext = React.createContext();

// Default mock values
const defaultAuthState = {
  currentUser: null,
  loading: false,
  error: null,
  isAdmin: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  updateProfile: jest.fn(),
  googleSignIn: jest.fn()
};

// Provider component for tests
export const AuthProvider = ({ children, value = defaultAuthState }) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for tests
export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthContext; 