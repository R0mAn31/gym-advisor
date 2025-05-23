/**
 * Mock for firebase/auth module
 */

export const onAuthStateChanged = jest.fn();
export const GoogleAuthProvider = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const updateProfile = jest.fn();
export const getAuth = jest.fn(() => ({
  currentUser: null
})); 