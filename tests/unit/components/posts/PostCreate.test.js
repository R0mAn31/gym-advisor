/**
 * Tests for PostCreate component
 * 
 * Tests post creation functionality with mocked database
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PostCreate from '../../../../frontend/src/components/posts/PostCreate';
import { db, storage } from '../../../../frontend/src/services/firebase';
import { useAuth } from '../../../../frontend/src/contexts/AuthContext';

// Mock Firebase services
jest.mock('../../../../frontend/src/services/firebase', () => {
  return {
    db: {
      collection: jest.fn().mockReturnThis(),
      add: jest.fn(),
      doc: jest.fn().mockReturnThis(),
      get: jest.fn(),
      update: jest.fn()
    },
    storage: {
      ref: jest.fn().mockReturnThis(),
      child: jest.fn().mockReturnThis(),
      put: jest.fn().mockReturnValue({
        on: jest.fn((event, progress, error, complete) => {
          // Immediately call the complete callback to simulate upload
          complete();
        }),
        snapshot: {
          ref: {
            getDownloadURL: jest.fn().mockResolvedValue('https://example.com/uploaded-image.jpg')
          }
        }
      })
    }
  };
});

// Mock the auth context
jest.mock('../../../../frontend/src/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('PostCreate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: {
        uid: 'user123',
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://example.com/user-photo.jpg'
      }
    });
    
    // Mock db.collection('posts').add to resolve with an id
    db.collection.mockReturnValue({
      add: jest.fn().mockResolvedValue({ id: 'new-post-123' })
    });
  });

  // Helper function to render component
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PostCreate />
      </BrowserRouter>
    );
  };

  // Basic rendering tests
  it('renders the post creation form', () => {
    renderComponent();
    
    expect(screen.getByText(/create new post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
  });

  it('requires user to be logged in', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValueOnce({ currentUser: null });
    
    renderComponent();
    
    expect(screen.getByText(/you must be logged in to create a post/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
  });

  // Form interaction tests
  it('allows filling out the post form', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'My Test Post Title' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This is the content of my test post.' }
    });
    
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'fitness' }
    });
    
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'test, example, fitness' }
    });
    
    // Verify form values
    expect(screen.getByLabelText(/title/i)).toHaveValue('My Test Post Title');
    expect(screen.getByLabelText(/content/i)).toHaveValue('This is the content of my test post.');
    expect(screen.getByLabelText(/category/i)).toHaveValue('fitness');
    expect(screen.getByLabelText(/tags/i)).toHaveValue('test, example, fitness');
  });

  it('validates required fields', async () => {
    renderComponent();
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });
  });

  // Image upload tests
  it('allows uploading an image', async () => {
    renderComponent();
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate upload
    const fileInput = screen.getByLabelText(/upload image/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Check if the file name is displayed
    await waitFor(() => {
      expect(screen.getByText(/test-image.png/i)).toBeInTheDocument();
    });
  });

  it('shows progress during image upload', async () => {
    // Mock storage.ref().put to simulate progress
    storage.ref.mockReturnValueOnce({
      child: jest.fn().mockReturnThis(),
      put: jest.fn().mockReturnValue({
        on: jest.fn((event, progress, error, complete) => {
          // Call progress with 50% upload
          progress({ bytesTransferred: 50, totalBytes: 100 });
          // Then complete
          setTimeout(complete, 100);
        }),
        snapshot: {
          ref: {
            getDownloadURL: jest.fn().mockResolvedValue('https://example.com/uploaded-image.jpg')
          }
        }
      })
    });
    
    renderComponent();
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate upload
    const fileInput = screen.getByLabelText(/upload image/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Check if progress is displayed
    await waitFor(() => {
      expect(screen.getByText(/uploading: 50%/i)).toBeInTheDocument();
    });
  });

  // Form submission tests
  it('creates a new post when form is submitted', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'My Test Post Title' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This is the content of my test post.' }
    });
    
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'fitness' }
    });
    
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'test, example, fitness' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    
    // Check if the post was created
    await waitFor(() => {
      expect(db.collection().add).toHaveBeenCalledWith(expect.objectContaining({
        title: 'My Test Post Title',
        content: 'This is the content of my test post.',
        category: 'fitness',
        tags: ['test', 'example', 'fitness'],
        author: {
          id: 'user123',
          name: 'Test User',
          photoURL: 'https://example.com/user-photo.jpg'
        }
      }));
    });
    
    // Check if navigation occurred after post creation
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/posts/new-post-123'));
  });

  it('uploads image before creating post if provided', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Post With Image' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This post has an image.' }
    });
    
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'fitness' }
    });
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate upload
    const fileInput = screen.getByLabelText(/upload image/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    
    // Check if the image was uploaded and post created with image URL
    await waitFor(() => {
      expect(storage.ref().child).toHaveBeenCalled();
      expect(storage.ref().child().put).toHaveBeenCalled();
      expect(db.collection().add).toHaveBeenCalledWith(expect.objectContaining({
        imageURL: 'https://example.com/uploaded-image.jpg'
      }));
    });
  });

  // Error handling tests
  it('handles errors during post creation', async () => {
    // Mock db.collection('posts').add to reject with an error
    db.collection.mockReturnValueOnce({
      add: jest.fn().mockRejectedValue(new Error('Database error'))
    });
    
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Error Test Post' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This post will cause an error.' }
    });
    
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'test' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/error creating post: database error/i)).toBeInTheDocument();
    });
    
    // Check that navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles errors during image upload', async () => {
    // Mock storage.ref().put to reject with an error
    storage.ref.mockReturnValueOnce({
      child: jest.fn().mockReturnThis(),
      put: jest.fn().mockReturnValue({
        on: jest.fn((event, progress, error, complete) => {
          // Call error with upload error
          error(new Error('Upload failed'));
        })
      })
    });
    
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Image Error Post' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This post has an image upload error.' }
    });
    
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'test' }
    });
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate upload
    const fileInput = screen.getByLabelText(/upload image/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/error uploading image: upload failed/i)).toBeInTheDocument();
    });
  });

  // Preview functionality tests
  it('shows post preview when preview button is clicked', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Preview Test Post' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This is a post preview test.' }
    });
    
    // Click preview button
    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    
    // Check if preview is displayed
    await waitFor(() => {
      expect(screen.getByText(/post preview/i)).toBeInTheDocument();
      expect(screen.getByText(/preview test post/i)).toBeInTheDocument();
      expect(screen.getByText(/this is a post preview test/i)).toBeInTheDocument();
    });
  });

  it('returns to edit mode from preview', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Preview Test Post' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This is a post preview test.' }
    });
    
    // Click preview button
    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    
    // Wait for preview to be displayed
    await waitFor(() => {
      expect(screen.getByText(/post preview/i)).toBeInTheDocument();
    });
    
    // Click back to edit button
    fireEvent.click(screen.getByRole('button', { name: /back to edit/i }));
    
    // Check if edit form is displayed again
    await waitFor(() => {
      expect(screen.getByText(/create new post/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toHaveValue('Preview Test Post');
    });
  });

  // Save draft functionality tests
  it('saves post as draft', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Draft Post' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This is a draft post.' }
    });
    
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'draft' }
    });
    
    // Click save draft button
    fireEvent.click(screen.getByRole('button', { name: /save draft/i }));
    
    // Check if draft was saved
    await waitFor(() => {
      expect(db.collection().add).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Draft Post',
        content: 'This is a draft post.',
        category: 'draft',
        status: 'draft'
      }));
    });
    
    // Check for success message
    expect(screen.getByText(/draft saved successfully/i)).toBeInTheDocument();
  });
}); 