/**
 * Firebase services configuration
 *
 * @format
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Mock implementation for tests
const auth = {
  onAuthStateChanged: (callback) => callback(null),
  signInWithEmailAndPassword: (email, password) =>
    Promise.resolve({ user: { uid: "test-uid" } }),
  createUserWithEmailAndPassword: (email, password) =>
    Promise.resolve({ user: { uid: "test-uid" } }),
  signOut: () => Promise.resolve(),
  currentUser: null,
};

const db = {
  collection: (name) => ({
    doc: (id) => ({
      get: () => Promise.resolve({ exists: false, data: () => ({}) }),
      set: (data) => Promise.resolve(data),
      update: (data) => Promise.resolve(data),
      delete: () => Promise.resolve(),
    }),
    where: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
    add: (data) => Promise.resolve({ id: "test-id", ...data }),
  }),
};

const storage = {
  ref: (path) => ({
    put: (file) => ({
      on: (event, onProgress, onError, onComplete) => onComplete(),
      snapshot: {
        ref: {
          getDownloadURL: () => Promise.resolve("https://example.com/test.jpg"),
        },
      },
    }),
    getDownloadURL: () => Promise.resolve("https://example.com/test.jpg"),
  }),
};

export { auth, db, storage, firebaseConfig };
