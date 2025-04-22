import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

/**
 * PostList component for displaying posts with filtering and sorting options
 */
const PostList = ({ category, tag, userId, sortBy }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add defensive check for useAuth - handle case when it might be undefined in tests
  const auth = useAuth() || {};
  const { currentUser } = auth;
  
  const postsPerPage = 10;
  
  // Function to fetch posts with filters
  const fetchPosts = async (isLoadMore = false) => {
    try {
      let postsQuery = collection(db, 'posts');
      let constraints = [];
      
      // Apply filters
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      if (tag) {
        constraints.push(where('tags', 'array-contains', tag));
      }
      
      if (userId) {
        constraints.push(where('author.id', '==', userId));
      }
      
      // Sort by date (default) or popularity
      if (sortBy === 'popularity') {
        constraints.push(orderBy('likes', 'desc'));
      } else {
        constraints.push(orderBy('createdAt', 'desc'));
      }
      
      // Pagination
      constraints.push(limit(postsPerPage));
      
      // Load more using last document as starting point
      if (isLoadMore && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }
      
      // Execute query
      const q = query(postsQuery, ...constraints);
      const querySnapshot = await getDocs(q);
      
      // Check if we have more posts to load
      if (querySnapshot.empty) {
        setHasMore(false);
        if (!isLoadMore) {
          setPosts([]);
        }
        setLoading(false);
        return;
      }
      
      // Get the last visible document for pagination
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      
      // Map documents to posts objects
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Update state based on whether we're loading more or initial load
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...postsData]);
      } else {
        setPosts(postsData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Error loading posts. Please try again later.');
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    setLoading(true);
    setHasMore(true);
    setLastVisible(null);
    fetchPosts();
  }, [category, tag, userId, sortBy]);
  
  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      // In a real app, we would implement search functionality here
      // For now, we'll just filter the posts by title
      const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPosts(filteredPosts);
      setLoading(false);
    }
  };
  
  // Load more posts
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(true);
    }
  };
  
  // Handle liking a post
  const handleLike = async (postId) => {
    if (!currentUser) return;
    
    try {
      const postToUpdate = posts.find(post => post.id === postId);
      if (!postToUpdate) return;
      
      const postRef = db.doc(`posts/${postId}`);
      await postRef.update({
        likes: postToUpdate.likes + 1
      });
      
      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 } 
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };
  
  // Handle sharing a post
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.origin + '/posts/' + post.id
      }).catch(err => console.error('Error sharing:', err));
    }
  };
  
  if (loading && posts.length === 0) {
    return <div>Loading posts...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  if (posts.length === 0) {
    return <div>No posts found matching your criteria.</div>;
  }
  
  return (
    <div className="post-list">
      <div className="post-filters">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
        
        <select 
          aria-label="Category"
          onChange={e => {
            // In a real app, we would update the URL or trigger a state change
            console.log('Category filter:', e.target.value);
          }}
        >
          <option value="">All Categories</option>
          <option value="workouts">Workouts</option>
          <option value="nutrition">Nutrition</option>
          <option value="recovery">Recovery</option>
        </select>
        
        <select 
          aria-label="Sort by"
          onChange={e => {
            // In a real app, we would update the URL or trigger a state change
            console.log('Sort by:', e.target.value);
          }}
        >
          <option value="recent">Most Recent</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>
      
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-item" data-testid="post-item">
            <Link to={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
              <img src={post.imageURL} alt={post.title} />
            </Link>
            
            <div className="post-meta">
              <div className="post-author">
                <img src={post.author.photoURL} alt={post.author.name} />
                <span>{post.author.name}</span>
              </div>
              
              <div className="post-date">
                {new Date(post.createdAt.toDate()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <div className="post-excerpt">
              {post.content.substring(0, 150)}...
            </div>
            
            <div className="post-tags">
              {post.tags.map(tag => (
                <Link key={tag} to={`/posts?tag=${tag}`}>
                  {tag}
                </Link>
              ))}
            </div>
            
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>
                Like <span>{post.likes}</span>
              </button>
              
              <span>Comments: {post.comments}</span>
              
              <button onClick={() => handleShare(post)}>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="load-more">
          <button onClick={handleLoadMore}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList; 