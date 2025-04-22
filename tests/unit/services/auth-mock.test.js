/**
 * Authentication service tests with mocked database
 * 
 * These tests simulate user authentication operations with mock implementations
 */

import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser,
  updateProfile,
  resetPassword 
} from '../../../frontend/src/services/auth';

// Mock database for user authentication
const mockUsers = [
  { 
    uid: 'user1', 
    email: 'user1@example.com', 
    password: 'password123',
    displayName: 'Test User 1',
    photoURL: 'https://example.com/user1.jpg',
    emailVerified: true,
    createdAt: '2023-01-01T12:00:00Z'
  },
  { 
    uid: 'user2', 
    email: 'user2@example.com', 
    password: 'securepass456',
    displayName: 'Test User 2',
    photoURL: null,
    emailVerified: false,
    createdAt: '2023-02-15T09:30:00Z'
  }
];

// Current authenticated user
let currentUser = null;

// Mock the firebase module with our simulated database
jest.mock('../../../frontend/src/services/firebase', () => {
  return {
    auth: {
      // Sign in with email and password
      signInWithEmailAndPassword: jest.fn((email, password) => {
        return new Promise((resolve, reject) => {
          // Find user with matching email and password
          const user = mockUsers.find(
            u => u.email === email && u.password === password
          );
          
          if (user) {
            // Set as current user
            currentUser = { ...user };
            
            // Return user data without password
            const { password, ...userData } = user;
            resolve({ user: userData });
          } else {
            reject(new Error('Invalid email or password'));
          }
        });
      }),
      
      // Create user with email and password
      createUserWithEmailAndPassword: jest.fn((email, password) => {
        return new Promise((resolve, reject) => {
          // Check if email already exists
          const existingUser = mockUsers.find(u => u.email === email);
          
          if (existingUser) {
            reject(new Error('Email already in use'));
          } else {
            // Create new user
            const newUser = {
              uid: `user${mockUsers.length + 1}`,
              email,
              password,
              displayName: null,
              photoURL: null,
              emailVerified: false,
              createdAt: new Date().toISOString()
            };
            
            // Add to mock database
            mockUsers.push(newUser);
            
            // Set as current user
            currentUser = { ...newUser };
            
            // Return user data without password
            const { password: pwd, ...userData } = newUser;
            resolve({ user: userData });
          }
        });
      }),
      
      // Sign out
      signOut: jest.fn(() => {
        return new Promise((resolve) => {
          currentUser = null;
          resolve();
        });
      }),
      
      // Get current user
      currentUser: null,
      
      // Auth state change handler
      onAuthStateChanged: jest.fn((callback) => {
        callback(currentUser);
        return () => {}; // Return unsubscribe function
      }),
      
      // Update user profile
      updateProfile: jest.fn((user, profileData) => {
        return new Promise((resolve, reject) => {
          if (!user) {
            reject(new Error('No user provided'));
            return;
          }
          
          // Find user in database
          const userIndex = mockUsers.findIndex(u => u.uid === user.uid);
          
          if (userIndex !== -1) {
            // Update user data
            mockUsers[userIndex] = {
              ...mockUsers[userIndex],
              ...profileData
            };
            
            // Update current user if it's the same user
            if (currentUser && currentUser.uid === user.uid) {
              currentUser = {
                ...currentUser,
                ...profileData
              };
            }
            
            resolve();
          } else {
            reject(new Error('User not found'));
          }
        });
      }),
      
      // Send password reset email
      sendPasswordResetEmail: jest.fn((email) => {
        return new Promise((resolve, reject) => {
          const user = mockUsers.find(u => u.email === email);
          
          if (user) {
            resolve();
          } else {
            reject(new Error('User not found'));
          }
        });
      })
    }
  };
});

describe('Authentication Service', () => {
  beforeEach(() => {
    // Reset current user before each test
    currentUser = null;
    jest.clearAllMocks();
  });
  
  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const email = 'user1@example.com';
      const password = 'password123';
      
      const result = await signIn(email, password);
      
      expect(result.user).toHaveProperty('uid', 'user1');
      expect(result.user).toHaveProperty('email', email);
      expect(result.user).not.toHaveProperty('password');
    });
    
    it('should throw an error with invalid credentials', async () => {
      const email = 'user1@example.com';
      const password = 'wrongpassword';
      
      await expect(signIn(email, password)).rejects.toThrow('Invalid email or password');
    });
  });
  
  describe('signUp', () => {
    it('should create a new user account', async () => {
      const email = 'newuser@example.com';
      const password = 'newpassword123';
      
      const result = await signUp(email, password);
      
      expect(result.user).toHaveProperty('uid');
      expect(result.user).toHaveProperty('email', email);
      expect(result.user).toHaveProperty('displayName', null);
      expect(result.user).toHaveProperty('emailVerified', false);
    });
    
    it('should throw an error if email is already in use', async () => {
      const email = 'user1@example.com';
      const password = 'somepassword';
      
      await expect(signUp(email, password)).rejects.toThrow('Email already in use');
    });
  });
  
  describe('signOut', () => {
    it('should sign out the current user', async () => {
      // First sign in
      await signIn('user1@example.com', 'password123');
      expect(currentUser).not.toBeNull();
      
      // Then sign out
      await signOut();
      expect(currentUser).toBeNull();
    });
  });
  
  describe('getCurrentUser', () => {
    it('should return the current authenticated user', async () => {
      // First sign in
      await signIn('user1@example.com', 'password123');
      
      const user = getCurrentUser();
      
      expect(user).toHaveProperty('uid', 'user1');
      expect(user).toHaveProperty('email', 'user1@example.com');
    });
    
    it('should return null when no user is authenticated', () => {
      const user = getCurrentUser();
      expect(user).toBeNull();
    });
  });
  
  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      // First sign in
      await signIn('user1@example.com', 'password123');
      
      const profileData = {
        displayName: 'Updated Name',
        photoURL: 'https://example.com/newphoto.jpg'
      };
      
      await updateProfile(currentUser, profileData);
      
      expect(currentUser).toHaveProperty('displayName', 'Updated Name');
      expect(currentUser).toHaveProperty('photoURL', 'https://example.com/newphoto.jpg');
    });
    
    it('should throw an error if no user is provided', async () => {
      const profileData = { displayName: 'Test' };
      
      await expect(updateProfile(null, profileData)).rejects.toThrow('No user provided');
    });
  });
  
  describe('resetPassword', () => {
    it('should send a password reset email to existing user', async () => {
      const email = 'user1@example.com';
      
      await resetPassword(email);
      
      expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith(email);
    });
    
    it('should throw an error for non-existent user', async () => {
      const email = 'nonexistent@example.com';
      
      await expect(resetPassword(email)).rejects.toThrow('User not found');
    });
  });
}); 