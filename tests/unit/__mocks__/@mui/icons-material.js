/**
 * Mock for @mui/icons-material
 */

// Create a proxy that returns a mock component for any icon
const iconsMock = new Proxy(
  {},
  {
    get: function(obj, prop) {
      // Return a mock component for any icon requested
      return () => 'MockIcon';
    }
  }
);

module.exports = iconsMock; 