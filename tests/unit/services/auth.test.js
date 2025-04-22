/**
 * Tests for auth service
 */

import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  onAuthStateChanged 
} from '../../../frontend/src/services/auth';
import { auth } from '../../../frontend/src/services/firebase';

// Mock the firebase module
jest.mock('../../../frontend/src/services/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    currentUser: null
  }
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call firebase signInWithEmailAndPassword with correct parameters', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { uid: 'test-uid' };

      auth.signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const result = await signIn(email, password);

      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
      expect(result.user).toEqual(mockUser);
    });

    it('should throw an error when sign in fails', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const mockError = new Error('Invalid credentials');

      auth.signInWithEmailAndPassword.mockRejectedValueOnce(mockError);

      await expect(signIn(email, password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should call firebase createUserWithEmailAndPassword with correct parameters', async () => {
      const email = 'newuser@example.com';
      const password = 'newpassword123';
      const mockUser = { uid: 'new-test-uid' };

      auth.createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const result = await signUp(email, password);

      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
      expect(result.user).toEqual(mockUser);
    });

    it('should throw an error when sign up fails', async () => {
      const email = 'existing@example.com';
      const password = 'password123';
      const mockError = new Error('Email already in use');

      auth.createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);

      await expect(signUp(email, password)).rejects.toThrow('Email already in use');
    });
  });

  describe('signOut', () => {
    it('should call firebase signOut method', async () => {
      auth.signOut.mockResolvedValueOnce();

      await signOut();

      expect(auth.signOut).toHaveBeenCalled();
    });

    it('should throw an error when sign out fails', async () => {
      const mockError = new Error('Network error');
      auth.signOut.mockRejectedValueOnce(mockError);

      await expect(signOut()).rejects.toThrow('Network error');
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is authenticated', () => {
      auth.currentUser = null;
      
      const user = getCurrentUser();
      
      expect(user).toBeNull();
    });

    it('should return the current user when authenticated', () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      auth.currentUser = mockUser;
      
      const user = getCurrentUser();
      
      expect(user).toEqual(mockUser);
    });
  });

  describe('onAuthStateChanged', () => {
    it('should set up an auth state listener with the provided callback', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      auth.onAuthStateChanged.mockReturnValueOnce(mockUnsubscribe);
      
      const unsubscribe = onAuthStateChanged(mockCallback);
      
      expect(auth.onAuthStateChanged).toHaveBeenCalledWith(mockCallback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
}); 