/**
 * Tests for NewPostForm component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock implementation of the component to test
const NewPostForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState('');

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

describe('NewPostForm Component', () => {
  it('should render the form with all fields', () => {
    render(<NewPostForm onSubmit={() => {}} loading={false} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    render(<NewPostForm onSubmit={() => {}} loading={false} />);
    
    const titleInput = screen.getByTestId('title-input');
    const contentInput = screen.getByTestId('content-input');
    
    await act(async () => {
      await userEvent.type(titleInput, 'Test Title');
    });

    await act(async () => {
      await userEvent.type(contentInput, 'Test Content');
    });
    
    expect(titleInput.value).toBe('Test Title');
    expect(contentInput.value).toBe('Test Content');
  });

  it('should display an error message when form is submitted with empty fields', async () => {
    render(<NewPostForm onSubmit={() => {}} loading={false} />);
    
    // Submit the form without filling in the fields
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });
    
    // Check if error message is displayed
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('should call onSubmit with form data when valid form is submitted', async () => {
    const mockSubmit = jest.fn();
    render(<NewPostForm onSubmit={mockSubmit} loading={false} />);
    
    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByTestId('title-input'), 'Test Title');
    });

    await act(async () => {
      await userEvent.type(screen.getByTestId('content-input'), 'Test Content');
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });
    
    // Check if onSubmit was called with correct data
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content'
    });
  });

  it('should clear form fields after successful submission', async () => {
    render(<NewPostForm onSubmit={() => {}} loading={false} />);
    
    // Fill in the form
    const titleInput = screen.getByTestId('title-input');
    const contentInput = screen.getByTestId('content-input');
    
    await act(async () => {
      await userEvent.type(titleInput, 'Test Title');
    });

    await act(async () => {
      await userEvent.type(contentInput, 'Test Content');
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });
    
    // Check if form fields are cleared
    expect(titleInput.value).toBe('');
    expect(contentInput.value).toBe('');
  });

  it('should disable form elements when loading is true', () => {
    render(<NewPostForm onSubmit={() => {}} loading={true} />);
    
    expect(screen.getByTestId('title-input')).toBeDisabled();
    expect(screen.getByTestId('content-input')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('should not call onSubmit if validation fails', async () => {
    const mockSubmit = jest.fn();
    render(<NewPostForm onSubmit={mockSubmit} loading={false} />);
    
    // Submit with empty fields
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });
    
    // Check that onSubmit was not called
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should clear error message once valid form is submitted', async () => {
    const mockSubmit = jest.fn();
    render(<NewPostForm onSubmit={mockSubmit} loading={false} />);
    
    // Submit with empty fields to trigger error
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });
    
    // Error should be displayed
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    
    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByTestId('title-input'), 'Test Title');
    });

    await act(async () => {
      await userEvent.type(screen.getByTestId('content-input'), 'Test Content');
    });
    
    // Submit again
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });
    
    // Error should be gone
    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });
}); 