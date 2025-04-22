import React, { useState } from 'react';
import PropTypes from 'prop-types';

const NewPostForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Reset error if any
    setError('');
    
    // Call parent component's onSubmit function
    onSubmit({ title, content });
    
    // Reset form fields after submission
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} data-testid="new-post-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          data-testid="title-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          data-testid="content-input"
        />
      </div>
      
      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? 'Submitting...' : 'Create Post'}
      </button>
    </form>
  );
};

NewPostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

NewPostForm.defaultProps = {
  loading: false
};

export default NewPostForm; 