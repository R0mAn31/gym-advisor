/**
 * Tests for PostList component
 * 
 * Tests the post listing with mocked database
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PostList from '../../../../frontend/src/components/posts/PostList';
import { mockUser } from '../../__mocks__/firebaseMocks';

// Mock Firebase services
jest.mock('firebase/auth', () => {
  const { onAuthStateChanged, GoogleAuthProvider } = require('../../__mocks__/firebaseMocks');
  return {
    onAuthStateChanged,
    GoogleAuthProvider
  };
});

// Mock Firebase firestore
jest.mock('firebase/firestore', () => {
  const { 
    getDoc, setDoc, doc, collection, query, where, 
    orderBy, limit, startAfter, getDocs
  } = require('../../__mocks__/firebaseMocks');
  return {
    getDoc,
    setDoc,
    doc,
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs
  };
});

// Mock the services/firebase module
jest.mock('../../../../frontend/src/services/firebase', () => {
  const { auth, db } = require('../../__mocks__/firebaseMocks');
  return {
    auth,
    db
  };
});

// Mock the auth context directly
jest.mock('../../../../frontend/src/contexts/AuthContext', () => ({
  useAuth: () => {
    return {
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com'
      },
      userLoggedIn: true,
      loading: false
    };
  }
}));

describe('PostList Component', () => {
  // Sample post data
  const mockPosts = [
    {
      id: 'post1',
      title: 'Best Workout Routines',
      content: 'Here are some effective workout routines for building muscle...',
      author: {
        id: 'user1',
        name: 'John Doe',
        photoURL: 'https://example.com/john.jpg'
      },
      category: 'workouts',
      tags: ['fitness', 'muscle', 'routine'],
      createdAt: { toDate: () => new Date('2023-06-01') },
      likes: 15,
      comments: 5,
      imageURL: 'https://example.com/workout.jpg'
    },
    {
      id: 'post2',
      title: 'Nutrition Tips for Athletes',
      content: 'Proper nutrition is essential for athletic performance...',
      author: {
        id: 'user2',
        name: 'Jane Smith',
        photoURL: 'https://example.com/jane.jpg'
      },
      category: 'nutrition',
      tags: ['diet', 'protein', 'athletes'],
      createdAt: { toDate: () => new Date('2023-06-10') },
      likes: 23,
      comments: 8,
      imageURL: 'https://example.com/nutrition.jpg'
    },
    {
      id: 'post3',
      title: 'Recovery Methods After Intense Training',
      content: 'Effective recovery is just as important as training itself...',
      author: {
        id: 'user3',
        name: 'Alex Johnson',
        photoURL: 'https://example.com/alex.jpg'
      },
      category: 'recovery',
      tags: ['rest', 'massage', 'stretching'],
      createdAt: { toDate: () => new Date('2023-06-15') },
      likes: 19,
      comments: 7,
      imageURL: 'https://example.com/recovery.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock data for Firestore queries
    const mockQuerySnapshot = {
      docs: mockPosts.map(post => ({
        id: post.id,
        data: () => post
      })),
      empty: false
    };
    
    // Configure the mock query implementation
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValue(mockQuerySnapshot);
  });

  // Helper function to render the component
  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <PostList {...props} />
      </MemoryRouter>
    );
  };

  // Basic rendering tests
  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('renders post list after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Best Workout Routines')).toBeInTheDocument();
      expect(screen.getByText('Nutrition Tips for Athletes')).toBeInTheDocument();
      expect(screen.getByText('Recovery Methods After Intense Training')).toBeInTheDocument();
    });
  });

  // Category filter tests
  it('filters posts by category when category is provided', async () => {
    // Override mock to simulate filtered results
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValueOnce({
      docs: mockPosts
        .filter(post => post.category === 'nutrition')
        .map(post => ({
          id: post.id,
          data: () => post
        })),
      empty: false
    });
    
    renderComponent({ category: 'nutrition' });
    
    await waitFor(() => {
      expect(screen.getByText('Nutrition Tips for Athletes')).toBeInTheDocument();
      expect(screen.queryByText('Best Workout Routines')).not.toBeInTheDocument();
      expect(screen.queryByText('Recovery Methods After Intense Training')).not.toBeInTheDocument();
    });
  });

  // Tag filter tests
  it('filters posts by tag when tag is provided', async () => {
    // Override mock to simulate filtered results
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValueOnce({
      docs: mockPosts
        .filter(post => post.tags.includes('protein'))
        .map(post => ({
          id: post.id,
          data: () => post
        })),
      empty: false
    });
    
    renderComponent({ tag: 'protein' });
    
    await waitFor(() => {
      expect(screen.getByText('Nutrition Tips for Athletes')).toBeInTheDocument();
      expect(screen.queryByText('Best Workout Routines')).not.toBeInTheDocument();
      expect(screen.queryByText('Recovery Methods After Intense Training')).not.toBeInTheDocument();
    });
  });

  // Author filter tests
  it('filters posts by author when userId is provided', async () => {
    // Override mock to simulate filtered results
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValueOnce({
      docs: mockPosts
        .filter(post => post.author.id === 'user2')
        .map(post => ({
          id: post.id,
          data: () => post
        })),
      empty: false
    });
    
    renderComponent({ userId: 'user2' });
    
    await waitFor(() => {
      expect(screen.getByText('Nutrition Tips for Athletes')).toBeInTheDocument();
      expect(screen.queryByText('Best Workout Routines')).not.toBeInTheDocument();
      expect(screen.queryByText('Recovery Methods After Intense Training')).not.toBeInTheDocument();
    });
  });

  // Sort order tests
  it('sorts posts by recent date by default', async () => {
    renderComponent();
    
    await waitFor(() => {
      const postElements = screen.getAllByTestId('post-item');
      expect(postElements[0]).toHaveTextContent('Best Workout Routines');
      expect(postElements[1]).toHaveTextContent('Nutrition Tips for Athletes');
      expect(postElements[2]).toHaveTextContent('Recovery Methods After Intense Training');
    });
  });

  it('sorts posts by popularity when requested', async () => {
    // Override mock to simulate sorted results
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValueOnce({
      docs: [...mockPosts]
        .sort((a, b) => b.likes - a.likes)
        .map(post => ({
          id: post.id,
          data: () => post
        })),
      empty: false
    });
    
    renderComponent({ sortBy: 'popularity' });
    
    await waitFor(() => {
      const postElements = screen.getAllByTestId('post-item');
      expect(postElements[0]).toHaveTextContent('Nutrition Tips for Athletes'); // 23 likes
      expect(postElements[1]).toHaveTextContent('Recovery Methods After Intense Training'); // 19 likes
      expect(postElements[2]).toHaveTextContent('Best Workout Routines'); // 15 likes
    });
  });

  // Pagination tests
  it('loads more posts when load more button is clicked', async () => {
    // Additional mock posts for second page
    const additionalPosts = [
      {
        id: 'post4',
        title: 'Best Gym Equipment for Home',
        content: 'Setting up a home gym can be challenging...',
        author: {
          id: 'user2',
          name: 'Jane Smith',
          photoURL: 'https://example.com/jane.jpg'
        },
        category: 'equipment',
        tags: ['home gym', 'equipment'],
        createdAt: { toDate: () => new Date('2023-05-25') },
        likes: 12,
        comments: 3,
        imageURL: 'https://example.com/equipment.jpg'
      },
      {
        id: 'post5',
        title: 'Pre-Workout Supplements Guide',
        content: 'Are pre-workout supplements worth it?...',
        author: {
          id: 'user3',
          name: 'Alex Johnson',
          photoURL: 'https://example.com/alex.jpg'
        },
        category: 'supplements',
        tags: ['pre-workout', 'supplements', 'caffeine'],
        createdAt: { toDate: () => new Date('2023-05-20') },
        likes: 17,
        comments: 9,
        imageURL: 'https://example.com/supplements.jpg'
      }
    ];

    // Override mocks for pagination
    const { getDocs } = require('firebase/firestore');
    
    // First query returns first page
    getDocs.mockResolvedValueOnce({
      docs: mockPosts.map(post => ({
        id: post.id,
        data: () => post
      })),
      empty: false
    });
    
    // Second query returns second page
    getDocs.mockResolvedValueOnce({
      docs: additionalPosts.map(post => ({
        id: post.id,
        data: () => post
      })),
      empty: false
    });
    
    renderComponent();
    
    // Wait for first page to load
    await waitFor(() => {
      expect(screen.getByText('Best Workout Routines')).toBeInTheDocument();
    });
    
    // Click load more button
    fireEvent.click(screen.getByText(/load more/i));
    
    // Wait for second page to load
    await waitFor(() => {
      expect(screen.getByText('Best Gym Equipment for Home')).toBeInTheDocument();
      expect(screen.getByText('Pre-Workout Supplements Guide')).toBeInTheDocument();
    });
  });

  it('hides load more button when no more posts', async () => {
    // Override mocks for pagination
    const { getDocs } = require('firebase/firestore');
    
    // First query returns posts
    getDocs.mockResolvedValueOnce({
      docs: mockPosts.map(post => ({
        id: post.id,
        data: () => post
      })),
      empty: false
    });
    
    // Second query returns empty result
    getDocs.mockResolvedValueOnce({
      docs: [],
      empty: true
    });
    
    renderComponent();
    
    // Wait for first page to load
    await waitFor(() => {
      expect(screen.getByText('Best Workout Routines')).toBeInTheDocument();
    });
    
    // Click load more button
    fireEvent.click(screen.getByText(/load more/i));
    
    // Wait for load more button to disappear
    await waitFor(() => {
      expect(screen.queryByText(/load more/i)).not.toBeInTheDocument();
    });
  });

  // Display tests
  it('displays post author information', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    });
  });

  it('displays post date in the correct format', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('June 1, 2023')).toBeInTheDocument();
      expect(screen.getByText('June 10, 2023')).toBeInTheDocument();
      expect(screen.getByText('June 15, 2023')).toBeInTheDocument();
    });
  });

  it('displays post tags', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('fitness')).toBeInTheDocument();
      expect(screen.getByText('muscle')).toBeInTheDocument();
      expect(screen.getByText('diet')).toBeInTheDocument();
      expect(screen.getByText('protein')).toBeInTheDocument();
      expect(screen.getByText('rest')).toBeInTheDocument();
    });
  });

  it('displays like and comment counts', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument(); // Like count for post1
      expect(screen.getByText(/Comments: 5/)).toBeInTheDocument(); // Comment count for post1
      expect(screen.getByText('23')).toBeInTheDocument(); // Like count for post2
    });
  });

  // Error handling tests
  it('displays an error message when posts fail to load', async () => {
    // Mock a fetch error
    const { getDocs } = require('firebase/firestore');
    getDocs.mockRejectedValueOnce(new Error('Failed to fetch posts'));
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
    });
  });

  it('displays a message when no posts match filters', async () => {
    // Mock empty results
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValueOnce({
      docs: [],
      empty: true
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    });
  });
}); 