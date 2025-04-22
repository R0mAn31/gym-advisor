/**
 * Mock implementation for Firebase services
 */

// Auth mock
const auth = {
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  currentUser: null,
};

// Firestore mock
const db = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  add: jest.fn(),
  onSnapshot: jest.fn(),
};

// Storage mock
const storage = {
  ref: jest.fn().mockReturnValue({
    put: jest.fn().mockReturnValue({
      on: jest.fn(),
      snapshot: {
        ref: {
          getDownloadURL: jest.fn(),
        },
      },
    }),
    getDownloadURL: jest.fn(),
  }),
};

export { auth, db, storage }; 