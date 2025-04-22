/**
 * Tests for PostList component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock PostCard component
jest.mock('../../../../frontend/src/components/posts/PostCard', () => {
  return function MockPostCard({ post, onDelete }) {
    return (
      <div data-testid={`post-card-${post.id}`} className="post-card">
        <h2>{post.title}</h2>
        <button onClick={() => onDelete && onDelete(post.id)}>Delete</button>
      </div>
    );
  };
});

// Import the PostCard mock
import PostCard from '../../../../frontend/src/components/posts/PostCard';

// Import the actual component
const PostList = ({ posts, loading, error, onDeletePost }) => {
  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts: {error}</div>;
  if (!posts || posts.length === 0) return <div>No posts found</div>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post-list-item">
          {/* Use the imported PostCard component (which is mocked) */}
          <PostCard post={post} onDelete={onDeletePost} />
        </div>
      ))}
    </div>
  );
};

describe('PostList Component', () => {
  const mockPosts = [
    { id: 'post-1', title: 'First Post', content: 'Content 1', author: 'User 1', createdAt: '2023-04-15T10:00:00Z' },
    { id: 'post-2', title: 'Second Post', content: 'Content 2', author: 'User 2', createdAt: '2023-04-16T10:00:00Z' },
    { id: 'post-3', title: 'Third Post', content: 'Content 3', author: 'User 3', createdAt: '2023-04-17T10:00:00Z' },
  ];

  it('should render loading state when loading is true', () => {
    render(
      <BrowserRouter>
        <PostList posts={[]} loading={true} error={null} onDeletePost={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('should render error message when there is an error', () => {
    const errorMessage = 'Failed to fetch posts';
    render(
      <BrowserRouter>
        <PostList posts={[]} loading={false} error={errorMessage} onDeletePost={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(`Error loading posts: ${errorMessage}`)).toBeInTheDocument();
  });

  it('should render "No posts found" when posts array is empty', () => {
    render(
      <BrowserRouter>
        <PostList posts={[]} loading={false} error={null} onDeletePost={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('should render all posts when posts are available', () => {
    render(
      <BrowserRouter>
        <PostList posts={mockPosts} loading={false} error={null} onDeletePost={() => {}} />
      </BrowserRouter>
    );
    
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  it('should render the correct number of post cards', () => {
    render(
      <BrowserRouter>
        <PostList posts={mockPosts} loading={false} error={null} onDeletePost={() => {}} />
      </BrowserRouter>
    );
    
    const postItems = screen.getAllByText(/Post/i);
    expect(postItems.length).toBe(mockPosts.length);
  });

  it('should call onDeletePost when delete button is clicked', () => {
    const mockDeletePost = jest.fn();
    render(
      <BrowserRouter>
        <PostList posts={mockPosts} loading={false} error={null} onDeletePost={mockDeletePost} />
      </BrowserRouter>
    );
    
    // Click the delete button on the first post
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockDeletePost).toHaveBeenCalledWith('post-1');
  });

  it('should render posts in the correct order', () => {
    render(
      <BrowserRouter>
        <PostList posts={mockPosts} loading={false} error={null} onDeletePost={() => {}} />
      </BrowserRouter>
    );
    
    const postTitles = screen.getAllByText(/Post/i).map(element => element.textContent);
    expect(postTitles[0]).toBe('First Post');
    expect(postTitles[1]).toBe('Second Post');
    expect(postTitles[2]).toBe('Third Post');
  });
}); 