import '@testing-library/jest-dom';

// Mock Firebase and other global dependencies
jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
  firestore: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    userProfile: {
      uid: 'test-user',
      email: 'test@example.com',
    },
  }),
}));

// Suppress specific warnings or errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update inside a test was not wrapped in act') ||
     args[0].includes('Warning: Can\'t perform a React state update on an unmounted component'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Add any global test setup or mocks here
