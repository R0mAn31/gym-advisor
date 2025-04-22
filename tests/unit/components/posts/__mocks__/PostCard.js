/**
 * Mock for PostCard component
 */

import React from 'react';

const PostCard = ({ post, onDelete }) => {
  return (
    <div data-testid={`post-card-${post.id}`} className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      {onDelete && (
        <button 
          onClick={() => onDelete(post.id)} 
          data-testid={`delete-post-${post.id}`}
        >
          Delete
        </button>
      )}
      <a href={`/posts/${post.id}`} data-testid={`view-post-${post.id}`}>View Post</a>
    </div>
  );
};

export default PostCard; 