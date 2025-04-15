/** @format */

import { auth } from "./firebase";

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Authentication result
 */
export const signIn = async (email, password) => {
  try {
    return await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Authentication result
 */
export const signUp = async (email, password) => {
  try {
    return await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise} - Void promise
 */
export const signOut = async () => {
  try {
    return await auth.signOut();
  } catch (error) {
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns {Object|null} - Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Set up an auth state change listener
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
