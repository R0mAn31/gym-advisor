/**
 * Mock for react-dropzone
 */

const useDropzone = jest.fn().mockReturnValue({
  getRootProps: jest.fn().mockReturnValue({}),
  getInputProps: jest.fn().mockReturnValue({}),
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  acceptedFiles: []
});

module.exports = {
  useDropzone
}; 