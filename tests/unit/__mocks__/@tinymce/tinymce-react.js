/**
 * Mock for @tinymce/tinymce-react
 */

// Mock Editor component
const Editor = ({ onEditorChange, value, init, ...props }) => {
  // Mock the editor component as a simple div
  return {
    render: () => 'MockEditor'
  };
};

module.exports = {
  Editor
}; 