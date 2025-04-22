/**
 * This file defines the test groups that are currently passing
 * and can be used to selectively run tests.
 */

// The passing test groups
const PASSING_TESTS = [
  // Basic tests
  './basic.test.js',
  
  // Services tests
  'services/auth.test.js',
  
  // Context tests
  'contexts/AuthContext.test.js',
  
  // Component tests - passing
  'components/posts/NewPostForm.test.js',
  'components/posts/PostCard.test.js',
  'components/posts/PostDetail.test.js',
  'components/posts/PostList.test.js',
  'components/SimpleComponentTest.test.js'
];

module.exports = {
  PASSING_TESTS
}; 