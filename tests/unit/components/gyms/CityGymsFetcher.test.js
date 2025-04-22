/**
 * Tests for CityGymsFetcher component
 * 
 * Tests the component that fetches gym data from the database
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CityGymsFetcher from '../../../../frontend/src/components/gyms/CityGymsFetcher';
import { db } from '../../../../frontend/src/services/firebase';
import { collection, getDocs, addDoc, serverTimestamp, writeBatch, doc } from "firebase/firestore";

// Mock Firebase Firestore modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
  writeBatch: jest.fn(),
  doc: jest.fn()
}));

// Mock Firestore database
jest.mock('../../../../frontend/src/services/firebase', () => {
  return {
    db: {
      collection: jest.fn(),
      doc: jest.fn(),
      batch: jest.fn(),
      add: jest.fn()
    }
  };
});

// Mock the fetch API
global.fetch = jest.fn();

describe('CityGymsFetcher Component', () => {
  // Setup mock data and responses
  const mockGyms = [
    {
      id: 'gym1',
      name: 'Fitness Club',
      address: '123 Main St',
      phone: '+380123456789',
      website: 'https://example.com',
      type: 'gym',
      location: { lat: 49.84, lng: 24.03 },
      rating: 4.5,
      openingHours: 'Mon-Fri: 8AM-10PM'
    },
    {
      id: 'gym2',
      name: 'CrossFit Zone',
      address: '456 Market St',
      phone: '+380987654321',
      website: 'https://crossfit.example.com',
      type: 'crossfit',
      location: { lat: 49.83, lng: 24.02 },
      rating: 4.7,
      openingHours: 'Mon-Sun: 7AM-9PM'
    }
  ];

  // Mock Firestore batch operations
  const mockBatch = {
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue('success')
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock for Google Places API
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: mockGyms.map(gym => ({
          place_id: gym.id,
          name: gym.name,
          vicinity: gym.address,
          geometry: {
            location: gym.location
          },
          rating: gym.rating,
          types: [gym.type],
          formatted_phone_number: gym.phone,
          website: gym.website,
          opening_hours: {
            weekday_text: [gym.openingHours]
          }
        }))
      })
    });

    // Mock Firestore batch operations
    writeBatch.mockReturnValue(mockBatch);
    
    // Mock collection references
    collection.mockReturnValue('mock-collection-ref');
    doc.mockReturnValue('mock-doc-ref');
  });

  it('renders correctly with initial state', () => {
    render(<CityGymsFetcher />);
    
    expect(screen.getByText(/отримання даних про спортзали/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отримати дані/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /зберегти у firebase/i })).toBeInTheDocument();
  });

  it('fetches gyms when fetch button is clicked', async () => {
    render(<CityGymsFetcher />);
    
    // Click the fetch button
    fireEvent.click(screen.getByRole('button', { name: /отримати дані/i }));
    
    // Check loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Verify fetched gyms are displayed
    expect(screen.getByText('Fitness Club')).toBeInTheDocument();
    expect(screen.getByText('CrossFit Zone')).toBeInTheDocument();
  });

  it('saves gyms to Firebase when save button is clicked', async () => {
    render(<CityGymsFetcher />);
    
    // First fetch the gyms
    fireEvent.click(screen.getByRole('button', { name: /отримати дані/i }));
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    // Click save to Firebase button
    fireEvent.click(screen.getByRole('button', { name: /зберегти у firebase/i }));
    
    // Wait for batch operations to complete
    await waitFor(() => {
      expect(writeBatch).toHaveBeenCalled();
      expect(mockBatch.set).toHaveBeenCalledTimes(mockGyms.length);
      expect(mockBatch.commit).toHaveBeenCalled();
    });
    
    // Verify success notification
    expect(screen.getByText(/успішно збережено/i)).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    // Mock fetch error
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<CityGymsFetcher />);
    
    // Click the fetch button
    fireEvent.click(screen.getByRole('button', { name: /отримати дані/i }));
    
    // Wait for error to be handled
    await waitFor(() => {
      expect(screen.getByText(/помилка отримання даних/i)).toBeInTheDocument();
    });
  });

  it('handles database save error gracefully', async () => {
    // Mock batch commit error
    mockBatch.commit.mockRejectedValueOnce(new Error('Database Error'));
    
    render(<CityGymsFetcher />);
    
    // First fetch the gyms
    fireEvent.click(screen.getByRole('button', { name: /отримати дані/i }));
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    // Click save to Firebase button
    fireEvent.click(screen.getByRole('button', { name: /зберегти у firebase/i }));
    
    // Wait for batch operations to complete
    await waitFor(() => {
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(screen.getByText(/помилка збереження даних/i)).toBeInTheDocument();
    });
  });

  it('allows changing the city for gym search', async () => {
    render(<CityGymsFetcher />);
    
    // Change city selection
    fireEvent.change(screen.getByLabelText(/місто/i), { target: { value: 'Київ' } });
    
    // Click the fetch button
    fireEvent.click(screen.getByRole('button', { name: /отримати дані/i }));
    
    // Wait for fetch to complete
    await waitFor(() => {
      // Check that the API was called with the new city coordinates
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('location=50.45,30.52'));
    });
  });
}); 