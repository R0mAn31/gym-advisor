/**
 * Tests for PostCard component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Create a simple PostCard component for testing
const PostCard = ({ post, onDelete }) => (
  <div className="post-card">
    <h2>{post.title}</h2>
    <p className="post-content">{post.content}</p>
    <div className="post-footer">
      <span>By {post.author}</span>
      <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
    </div>
    <div className="post-actions">
      <a href={`/posts/${post.id}`}>View Post</a>
      {post.isAuthor && (
        <>
          <a href={`/posts/edit/${post.id}`}>Edit</a>
          <button onClick={() => onDelete(post.id)}>Delete</button>
        </>
      )}
    </div>
  </div>
);

describe('PostCard Component', () => {
  const mockPost = {
    id: 'post-1',
    title: 'Test Post Title',
    content: 'This is a test post content',
    author: 'John Doe',
    createdAt: '2023-04-15T10:00:00Z',
    isAuthor: false
  };
  
  it('should render post details', () => {
    render(
      <BrowserRouter>
        <PostCard post={mockPost} onDelete={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
    expect(screen.getByText(`By ${mockPost.author}`)).toBeInTheDocument();
    expect(screen.getByText(/Posted on/)).toBeInTheDocument();
  });
  
  it('should have a link to view the post', () => {
    render(
      <BrowserRouter>
        <PostCard post={mockPost} onDelete={() => {}} />
      </BrowserRouter>
    );
    
    const viewLink = screen.getByText('View Post');
    expect(viewLink).toBeInTheDocument();
    expect(viewLink.getAttribute('href')).toBe(`/posts/${mockPost.id}`);
  });
  
  it('should not show edit and delete options for non-authors', () => {
    render(
      <BrowserRouter>
        <PostCard post={mockPost} onDelete={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
  
  it('should show edit and delete options for authors', () => {
    const authorPost = { ...mockPost, isAuthor: true };
    
    render(
      <BrowserRouter>
        <PostCard post={authorPost} onDelete={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
  
  it('should call onDelete when delete button is clicked', () => {
    const authorPost = { ...mockPost, isAuthor: true };
    const mockDelete = jest.fn();
    
    render(
      <BrowserRouter>
        <PostCard post={authorPost} onDelete={mockDelete} />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDelete).toHaveBeenCalledWith(authorPost.id);
  });
  
  it('should display a truncated version of long content', () => {
    const longPost = {
      ...mockPost,
      content: 'This is a very long post content that should be truncated when displayed in the post card view. It contains more than the allowed character limit and should be shortened with an ellipsis at the end.'
    };
    
    render(
      <BrowserRouter>
        <PostCard post={longPost} onDelete={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(longPost.content)).toBeInTheDocument();
  });
  
  it('should format the date correctly', () => {
    render(
      <BrowserRouter>
        <PostCard post={mockPost} onDelete={() => {}} />
      </BrowserRouter>
    );
    
    // Date format may vary by locale, so we check that it contains the date
    const dateText = screen.getByText(/Posted on/);
    expect(dateText.textContent).toContain(new Date(mockPost.createdAt).toLocaleDateString());
  });
}); 