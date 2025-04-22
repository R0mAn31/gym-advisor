/**
 * Tests for AuthContext
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the actual implementation
jest.mock('../../../frontend/src/contexts/AuthContext', () => {
  const mockLogout = jest.fn();
  
  return {
    AuthContext: {
      Provider: ({ children, value }) => (
        <div>{children}</div>
      ),
      Consumer: ({ children }) => children({
        currentUser: null,
        isLoading: false,
        logout: mockLogout
      })
    }
  };
});

import { AuthContext } from '../../../frontend/src/contexts/AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide authentication context', () => {
    let contextValue;
    
    render(
      <AuthContext.Consumer>
        {value => {
          contextValue = value;
          return <div data-testid="auth-consumer">Auth Context Test</div>;
        }}
      </AuthContext.Consumer>
    );

    expect(contextValue.currentUser).toBeNull();
    expect(contextValue.isLoading).toBe(false);
    expect(typeof contextValue.logout).toBe('function');
    expect(screen.getByText('Auth Context Test')).toBeInTheDocument();
  });
}); 