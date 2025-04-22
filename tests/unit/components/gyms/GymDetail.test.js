/**
 * Tests for GymDetail component
 * 
 * Tests the gym detail view with mocked database
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import GymDetail from '../../../../frontend/src/components/gyms/GymDetail';
import { db } from '../../../../frontend/src/services/firebase';
import { useAuth } from '../../../../frontend/src/contexts/AuthContext';

// Mock Firebase database
jest.mock('../../../../frontend/src/services/firebase', () => {
  return {
    db: {
      collection: jest.fn(),
      doc: jest.fn(),
      getDoc: jest.fn(),
      getDocs: jest.fn(),
      addDoc: jest.fn(),
      updateDoc: jest.fn(),
      deleteDoc: jest.fn(),
      query: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      onSnapshot: jest.fn()
    }
  };
});

// Mock the auth context
jest.mock('../../../../frontend/src/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock the useParams hook for router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ gymId: 'gym123' })
}));

describe('GymDetail Component', () => {
  // Sample gym data
  const mockGym = {
    id: 'gym123',
    name: 'Fitness Studio',
    address: '123 Main St, Lviv',
    description: 'A modern fitness center with state-of-the-art equipment.',
    rating: 4.7,
    photos: ['https://example.com/gym1.jpg'],
    workingHours: {
      monday: '7:00 - 22:00',
      tuesday: '7:00 - 22:00',
      wednesday: '7:00 - 22:00',
      thursday: '7:00 - 22:00',
      friday: '7:00 - 22:00',
      saturday: '9:00 - 20:00',
      sunday: '9:00 - 18:00'
    },
    equipment: ['treadmills', 'weights', 'machines'],
    amenities: ['showers', 'lockers', 'sauna'],
    priceRange: '500-1500 UAH',
    contactPhone: '+380123456789',
    website: 'https://fitnessstudio.example.com',
    location: { lat: 49.842, lng: 24.031 }
  };

  // Sample review data
  const mockReviews = [
    {
      id: 'rev1',
      gymId: 'gym123',
      userId: 'user1',
      userName: 'John Doe',
      rating: 5,
      text: 'Great gym with excellent equipment!',
      createdAt: { toDate: () => new Date('2023-05-01') }
    },
    {
      id: 'rev2',
      gymId: 'gym123',
      userId: 'user2',
      userName: 'Jane Smith',
      rating: 4,
      text: 'Good staff, but could use more free weights.',
      createdAt: { toDate: () => new Date('2023-05-15') }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: {
        uid: 'user1',
        displayName: 'John Doe',
        email: 'john@example.com'
      }
    });

    // Mock document reference
    const mockDocRef = {
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => mockGym,
        id: 'gym123'
      })
    };

    // Mock query snapshot for reviews
    const mockQuerySnapshot = {
      docs: mockReviews.map(review => ({
        id: review.id,
        data: () => review
      }))
    };

    // Mock collection queries
    db.doc.mockReturnValue(mockDocRef);
    db.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue(mockDocRef),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue(mockQuerySnapshot)
    });
  });

  // Render helper
  const renderComponent = (gymId = 'gym123') => {
    return render(
      <MemoryRouter initialEntries={[`/gyms/${gymId}`]}>
        <Routes>
          <Route path="/gyms/:gymId" element={<GymDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  // Basic rendering tests
  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders gym details after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Fitness Studio')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, Lviv')).toBeInTheDocument();
      expect(screen.getByText('A modern fitness center with state-of-the-art equipment.')).toBeInTheDocument();
    });
  });

  it('displays gym rating', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/4.7/)).toBeInTheDocument();
    });
  });

  it('displays gym working hours', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/monday/i)).toBeInTheDocument();
      expect(screen.getByText(/7:00 - 22:00/)).toBeInTheDocument();
      expect(screen.getByText(/sunday/i)).toBeInTheDocument();
      expect(screen.getByText(/9:00 - 18:00/)).toBeInTheDocument();
    });
  });

  it('displays gym equipment and amenities', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/equipment/i)).toBeInTheDocument();
      expect(screen.getByText(/treadmills/i)).toBeInTheDocument();
      expect(screen.getByText(/weights/i)).toBeInTheDocument();
      expect(screen.getByText(/amenities/i)).toBeInTheDocument();
      expect(screen.getByText(/showers/i)).toBeInTheDocument();
      expect(screen.getByText(/sauna/i)).toBeInTheDocument();
    });
  });

  it('displays gym contact information', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/contact/i)).toBeInTheDocument();
      expect(screen.getByText('+380123456789')).toBeInTheDocument();
      expect(screen.getByText('https://fitnessstudio.example.com')).toBeInTheDocument();
    });
  });

  // Map tests
  it('displays a map with the gym location', async () => {
    renderComponent();
    
    await waitFor(() => {
      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer).toBeInTheDocument();
    });
  });

  // Reviews tests
  it('displays gym reviews', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/reviews/i)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Great gym with excellent equipment!')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Good staff, but could use more free weights.')).toBeInTheDocument();
    });
  });

  it('displays review dates in the correct format', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('May 1, 2023')).toBeInTheDocument();
      expect(screen.getByText('May 15, 2023')).toBeInTheDocument();
    });
  });

  it('displays average rating from reviews', async () => {
    renderComponent();
    
    await waitFor(() => {
      // Average of 5 and 4 = 4.5
      expect(screen.getByText('Rating: 4.5')).toBeInTheDocument();
    });
  });

  // Review form tests
  it('displays the review form for authenticated users', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/leave a review/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });

  it('hides the review form for unauthenticated users', async () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/login to leave a review/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/rating/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/comment/i)).not.toBeInTheDocument();
    });
  });

  it('submits a new review', async () => {
    // Mock addDoc function
    const addDocMock = jest.fn().mockResolvedValue({ id: 'new-review-id' });
    db.collection.mockReturnValue({
      ...db.collection(),
      add: addDocMock
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    });
    
    // Fill out the review form
    fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Excellent facilities and staff!' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Check if the review was added
    await waitFor(() => {
      expect(addDocMock).toHaveBeenCalledWith(expect.objectContaining({
        gymId: 'gym123',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        text: 'Excellent facilities and staff!'
      }));
    });
  });

  // Error handling tests
  it('handles error when gym not found', async () => {
    // Mock document not found
    db.doc.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        exists: false
      })
    });
    
    renderComponent('nonexistent');
    
    await waitFor(() => {
      expect(screen.getByText(/gym not found/i)).toBeInTheDocument();
    });
  });

  it('handles error when loading gym fails', async () => {
    // Mock document fetch error
    db.doc.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Failed to fetch gym'))
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/error loading gym data/i)).toBeInTheDocument();
    });
  });

  it('handles error when loading reviews fails', async () => {
    // Mock reviews fetch error
    db.collection.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockRejectedValue(new Error('Failed to fetch reviews'))
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/error loading reviews/i)).toBeInTheDocument();
    });
  });

  // Bookmark/favorite functionality tests
  it('displays bookmark button for authenticated users', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
    });
  });

  it('hides bookmark button for unauthenticated users', async () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /bookmark/i })).not.toBeInTheDocument();
    });
  });

  it('adds gym to bookmarks when bookmark button is clicked', async () => {
    // Mock document reference for bookmarks
    const addBookmarkMock = jest.fn().mockResolvedValue({ id: 'bookmark-id' });
    
    db.collection.mockImplementation((collection) => {
      if (collection === 'bookmarks') {
        return {
          where: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValue({
            empty: true,
            docs: []
          }),
          add: addBookmarkMock
        };
      }
      return db.collection();
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
    });
    
    // Click the bookmark button
    fireEvent.click(screen.getByRole('button', { name: /bookmark/i }));
    
    // Check if bookmark was added
    await waitFor(() => {
      expect(addBookmarkMock).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user1',
        gymId: 'gym123',
        createdAt: expect.any(Object)
      }));
    });
  });

  it('removes gym from bookmarks when already bookmarked', async () => {
    // Mock existing bookmark
    const deleteBookmarkMock = jest.fn().mockResolvedValue();
    const bookmarkDocRef = {
      delete: deleteBookmarkMock
    };
    
    db.collection.mockImplementation((collection) => {
      if (collection === 'bookmarks') {
        return {
          where: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValue({
            empty: false,
            docs: [{
              id: 'bookmark-id',
              ref: bookmarkDocRef
            }]
          })
        };
      }
      return db.collection();
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
    });
    
    // Click the remove bookmark button
    fireEvent.click(screen.getByRole('button', { name: /remove bookmark/i }));
    
    // Check if bookmark was deleted
    await waitFor(() => {
      expect(deleteBookmarkMock).toHaveBeenCalled();
    });
  });

  // Sharing functionality tests
  it('displays share buttons', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  it('shows share options when share button is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
    
    // Click the share button
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    
    // Check if share options appear
    await waitFor(() => {
      expect(screen.getByText(/share on facebook/i)).toBeInTheDocument();
      expect(screen.getByText(/share on twitter/i)).toBeInTheDocument();
      expect(screen.getByText(/copy link/i)).toBeInTheDocument();
    });
  });

  // Photo gallery tests
  it('displays gym photos', async () => {
    renderComponent();
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/gym1.jpg');
    });
  });

  it('enlarges photo when clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images[0]).toBeInTheDocument();
    });
    
    // Click on the first image
    const images = await screen.findAllByRole('img');
    fireEvent.click(images[0]);
    
    // Check if modal with enlarged image appears
    await waitFor(() => {
      expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      const modalImage = screen.getByTestId('modal-image');
      expect(modalImage).toHaveAttribute('src', 'https://example.com/gym1.jpg');
    });
  });

  // Check-in functionality tests
  it('displays check-in button for authenticated users', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
    });
  });

  it('records a check-in when button is clicked', async () => {
    // Mock check-in function
    const addCheckInMock = jest.fn().mockResolvedValue({ id: 'checkin-id' });
    
    db.collection.mockImplementation((collection) => {
      if (collection === 'checkins') {
        return {
          add: addCheckInMock
        };
      }
      return db.collection();
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
    });
    
    // Click the check-in button
    fireEvent.click(screen.getByRole('button', { name: /check in/i }));
    
    // Check if check-in was recorded
    await waitFor(() => {
      expect(addCheckInMock).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user1',
        gymId: 'gym123',
        timestamp: expect.any(Object)
      }));
    });
  });

  // Report/flag functionality tests
  it('allows users to report inappropriate content', async () => {
    // Mock report function
    const addReportMock = jest.fn().mockResolvedValue({ id: 'report-id' });
    
    db.collection.mockImplementation((collection) => {
      if (collection === 'reports') {
        return {
          add: addReportMock
        };
      }
      return db.collection();
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/report/i)).toBeInTheDocument();
    });
    
    // Click the report link
    fireEvent.click(screen.getByText(/report/i));
    
    // Modal should appear
    await waitFor(() => {
      expect(screen.getByText(/report inappropriate content/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
    });
    
    // Fill out the report form
    fireEvent.change(screen.getByLabelText(/reason/i), { 
      target: { value: 'Incorrect information' } 
    });
    
    // Submit the report
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));
    
    // Check if report was submitted
    await waitFor(() => {
      expect(addReportMock).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user1',
        gymId: 'gym123',
        reason: 'Incorrect information',
        status: 'pending'
      }));
    });
  });
}); 