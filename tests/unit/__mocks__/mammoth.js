/**
 * Mock for mammoth library
 */

const mammothMock = {
  convertToHtml: jest.fn().mockResolvedValue({
    value: '<p>Mock converted HTML content</p>',
    messages: []
  })
};

module.exports = mammothMock; 