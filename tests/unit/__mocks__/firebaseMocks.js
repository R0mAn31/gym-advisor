// Mock implementation for Firebase services

// Mock Auth
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: false,
  providerData: [
    { providerId: 'password' }
  ]
};

const auth = {
  currentUser: mockUser,
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: mockUser }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: mockUser }),
  signOut: jest.fn().mockResolvedValue(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
  updateEmail: jest.fn().mockResolvedValue(),
  updatePassword: jest.fn().mockResolvedValue(),
  updateProfile: jest.fn().mockResolvedValue()
};

// Mock onAuthStateChanged - fixed to check if callback is a function
export const onAuthStateChanged = jest.fn((auth, callback) => {
  // Safely call callback only if it's a function
  if (typeof callback === 'function') {
    // Use setTimeout to make it async like the real implementation
    setTimeout(() => callback(mockUser), 0);
  }
  return jest.fn(); // Unsubscribe function
});

// Mock Google Provider
export const GoogleAuthProvider = {
  PROVIDER_ID: 'google.com'
};

// Mock Firestore
const mockDocSnapshot = {
  exists: jest.fn().mockReturnValue(true),
  data: jest.fn().mockReturnValue({
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
    role: 'user',
    createdAt: new Date()
  }),
  id: 'test-uid'
};

// Mock doc reference
const mockDocRef = {
  get: jest.fn().mockResolvedValue(mockDocSnapshot),
  set: jest.fn().mockResolvedValue(),
  update: jest.fn().mockResolvedValue(),
  delete: jest.fn().mockResolvedValue()
};

// Mock collection functions
export const getDoc = jest.fn().mockResolvedValue(mockDocSnapshot);
export const setDoc = jest.fn().mockResolvedValue();
export const doc = jest.fn().mockReturnValue(mockDocRef);
export const collection = jest.fn().mockReturnValue('mock-collection');
export const addDoc = jest.fn().mockResolvedValue({ id: 'new-doc-id' });
export const getDocs = jest.fn().mockResolvedValue({
  docs: [mockDocSnapshot],
  empty: false
});
export const query = jest.fn().mockReturnValue('mock-query');
export const where = jest.fn().mockReturnValue('mock-where-query');
export const orderBy = jest.fn().mockReturnValue('mock-order-query');
export const limit = jest.fn().mockReturnValue('mock-limit-query');
export const startAfter = jest.fn().mockReturnValue('mock-start-after-query');
export const serverTimestamp = jest.fn().mockReturnValue('mock-timestamp');

// Mock DB
const db = {
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue(mockDocRef),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      docs: [mockDocSnapshot],
      empty: false
    }),
    add: jest.fn().mockResolvedValue({ id: 'new-doc-id' })
  })
};

// Storage mock
const storage = {
  ref: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnValue({
      on: jest.fn((event, progress, error, complete) => {
        if (typeof complete === 'function') {
          complete();
        }
        return {
          snapshot: {
            ref: {
              getDownloadURL: jest.fn().mockResolvedValue('https://example.com/test.jpg')
            }
          }
        };
      }),
      snapshot: {
        ref: {
          getDownloadURL: jest.fn().mockResolvedValue('https://example.com/test.jpg')
        }
      }
    }),
    getDownloadURL: jest.fn().mockResolvedValue('https://example.com/test.jpg')
  })
};

export { auth, db, storage, mockUser }; 