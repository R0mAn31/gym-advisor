/**
 * API tests for gym endpoints
 * 
 * Using in-memory database simulation for testing API endpoints
 */

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Create a mock express app for testing
const app = express();
app.use(bodyParser.json());

// In-memory database mock
const mockDatabase = {
  gyms: [
    { 
      id: 'gym1', 
      name: 'Fitness Studio', 
      address: '123 Main St', 
      city: 'Lviv', 
      rating: 4.5,
      coordinates: { lat: 49.84, lng: 24.03 },
      equipment: ['treadmill', 'dumbbells', 'bench press'],
      amenities: ['showers', 'lockers', 'parking'],
      membership: { monthly: 500, yearly: 5000 }
    },
    { 
      id: 'gym2', 
      name: 'Power Gym', 
      address: '456 Oak St', 
      city: 'Kyiv', 
      rating: 4.7,
      coordinates: { lat: 50.45, lng: 30.52 },
      equipment: ['squat rack', 'smith machine', 'kettlebells'],
      amenities: ['sauna', 'pool', 'cafe'],
      membership: { monthly: 700, yearly: 7000 }
    },
    { 
      id: 'gym3', 
      name: 'CrossFit Box', 
      address: '789 Pine St', 
      city: 'Lviv', 
      rating: 4.8,
      coordinates: { lat: 49.83, lng: 24.02 },
      equipment: ['ropes', 'rings', 'box jumps'],
      amenities: ['open space', 'showers'],
      membership: { monthly: 600, yearly: 6000 }
    }
  ],
  reviews: [
    { id: 'rev1', gymId: 'gym1', userId: 'user1', rating: 5, comment: 'Great facilities!' },
    { id: 'rev2', gymId: 'gym1', userId: 'user2', rating: 4, comment: 'Good equipment.' },
    { id: 'rev3', gymId: 'gym2', userId: 'user1', rating: 4, comment: 'Nice staff.' }
  ],
  users: [
    { id: 'user1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
  ]
};

// Simulated database operations
const db = {
  getGyms: (filters = {}) => {
    let results = [...mockDatabase.gyms];
    
    // Apply filters if provided
    if (filters.city) {
      results = results.filter(gym => gym.city === filters.city);
    }
    
    if (filters.minRating) {
      results = results.filter(gym => gym.rating >= filters.minRating);
    }
    
    return Promise.resolve(results);
  },
  
  getGymById: (id) => {
    const gym = mockDatabase.gyms.find(gym => gym.id === id);
    return Promise.resolve(gym || null);
  },
  
  getGymReviews: (gymId) => {
    const reviews = mockDatabase.reviews.filter(review => review.gymId === gymId);
    
    // Enrich with user data
    const enrichedReviews = reviews.map(review => {
      const user = mockDatabase.users.find(user => user.id === review.userId);
      return {
        ...review,
        user: user ? { id: user.id, name: user.name } : null
      };
    });
    
    return Promise.resolve(enrichedReviews);
  },
  
  addGymReview: (gymId, review) => {
    const newReview = {
      id: `rev${mockDatabase.reviews.length + 1}`,
      gymId,
      ...review
    };
    
    mockDatabase.reviews.push(newReview);
    return Promise.resolve(newReview);
  },
  
  deleteGym: (id) => {
    const index = mockDatabase.gyms.findIndex(gym => gym.id === id);
    if (index !== -1) {
      mockDatabase.gyms.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },
  
  updateGym: (id, data) => {
    const index = mockDatabase.gyms.findIndex(gym => gym.id === id);
    if (index !== -1) {
      mockDatabase.gyms[index] = { ...mockDatabase.gyms[index], ...data };
      return Promise.resolve(mockDatabase.gyms[index]);
    }
    return Promise.resolve(null);
  },
  
  addGym: (data) => {
    const newGym = {
      id: `gym${mockDatabase.gyms.length + 1}`,
      ...data
    };
    
    mockDatabase.gyms.push(newGym);
    return Promise.resolve(newGym);
  }
};

// API routes for testing
app.get('/api/gyms', async (req, res) => {
  try {
    const filters = {
      city: req.query.city,
      minRating: req.query.minRating ? parseFloat(req.query.minRating) : null
    };
    
    const gyms = await db.getGyms(filters);
    res.json({ success: true, data: gyms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/gyms/:id', async (req, res) => {
  try {
    const gym = await db.getGymById(req.params.id);
    
    if (!gym) {
      return res.status(404).json({ success: false, error: 'Gym not found' });
    }
    
    res.json({ success: true, data: gym });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/gyms', async (req, res) => {
  try {
    // Validate required fields
    const { name, address, city } = req.body;
    
    if (!name || !address || !city) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, address and city are required fields' 
      });
    }
    
    const newGym = await db.addGym(req.body);
    res.status(201).json({ success: true, data: newGym });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/gyms/:id', async (req, res) => {
  try {
    const updatedGym = await db.updateGym(req.params.id, req.body);
    
    if (!updatedGym) {
      return res.status(404).json({ success: false, error: 'Gym not found' });
    }
    
    res.json({ success: true, data: updatedGym });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/gyms/:id', async (req, res) => {
  try {
    const success = await db.deleteGym(req.params.id);
    
    if (!success) {
      return res.status(404).json({ success: false, error: 'Gym not found' });
    }
    
    res.json({ success: true, message: 'Gym deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/gyms/:id/reviews', async (req, res) => {
  try {
    const reviews = await db.getGymReviews(req.params.id);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/gyms/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    
    if (!userId || !rating) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and rating are required fields' 
      });
    }
    
    const newReview = await db.addGymReview(req.params.id, req.body);
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API tests
describe('Gym API Endpoints', () => {
  // Test GET /api/gyms endpoint
  describe('GET /api/gyms', () => {
    it('should return all gyms when no filters are provided', async () => {
      const response = await request(app).get('/api/gyms');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });
    
    it('should filter gyms by city', async () => {
      const response = await request(app).get('/api/gyms?city=Lviv');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].city).toBe('Lviv');
      expect(response.body.data[1].city).toBe('Lviv');
    });
    
    it('should filter gyms by minimum rating', async () => {
      const response = await request(app).get('/api/gyms?minRating=4.7');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].rating).toBeGreaterThanOrEqual(4.7);
      expect(response.body.data[1].rating).toBeGreaterThanOrEqual(4.7);
    });
    
    it('should combine multiple filters', async () => {
      const response = await request(app).get('/api/gyms?city=Lviv&minRating=4.8');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].city).toBe('Lviv');
      expect(response.body.data[0].rating).toBeGreaterThanOrEqual(4.8);
    });
  });
  
  // Test GET /api/gyms/:id endpoint
  describe('GET /api/gyms/:id', () => {
    it('should return a specific gym by ID', async () => {
      const response = await request(app).get('/api/gyms/gym1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('gym1');
      expect(response.body.data.name).toBe('Fitness Studio');
    });
    
    it('should return 404 for non-existent gym ID', async () => {
      const response = await request(app).get('/api/gyms/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Gym not found');
    });
  });
  
  // Test POST /api/gyms endpoint
  describe('POST /api/gyms', () => {
    it('should create a new gym', async () => {
      const newGym = {
        name: 'Yoga Studio',
        address: '321 Zen St',
        city: 'Odesa',
        rating: 4.9,
        coordinates: { lat: 46.47, lng: 30.73 },
        equipment: ['mats', 'blocks', 'straps'],
        amenities: ['meditation room', 'tea room']
      };
      
      const response = await request(app)
        .post('/api/gyms')
        .send(newGym);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Yoga Studio');
      expect(response.body.data.id).toBeTruthy();
      
      // Verify the gym was added to the database
      const allGyms = await db.getGyms();
      expect(allGyms).toHaveLength(4);
    });
    
    it('should return 400 when required fields are missing', async () => {
      const incompleteGym = {
        name: 'Incomplete Gym'
        // Missing address and city
      };
      
      const response = await request(app)
        .post('/api/gyms')
        .send(incompleteGym);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required fields');
    });
  });
  
  // Test PUT /api/gyms/:id endpoint
  describe('PUT /api/gyms/:id', () => {
    it('should update an existing gym', async () => {
      const updateData = {
        name: 'Updated Fitness Studio',
        rating: 4.9
      };
      
      const response = await request(app)
        .put('/api/gyms/gym1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Fitness Studio');
      expect(response.body.data.rating).toBe(4.9);
      expect(response.body.data.address).toBe('123 Main St'); // Unchanged field
    });
    
    it('should return 404 for non-existent gym ID', async () => {
      const response = await request(app)
        .put('/api/gyms/nonexistent')
        .send({ name: 'Should Not Update' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Test DELETE /api/gyms/:id endpoint
  describe('DELETE /api/gyms/:id', () => {
    it('should delete an existing gym', async () => {
      const response = await request(app).delete('/api/gyms/gym1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify the gym was removed from the database
      const allGyms = await db.getGyms();
      expect(allGyms).toHaveLength(3); // We now have 4 gyms (after the POST test)
      expect(allGyms.find(gym => gym.id === 'gym1')).toBeUndefined();
    });
    
    it('should return 404 for non-existent gym ID', async () => {
      const response = await request(app).delete('/api/gyms/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Test GET /api/gyms/:id/reviews endpoint
  describe('GET /api/gyms/:id/reviews', () => {
    it('should return reviews for a specific gym', async () => {
      const response = await request(app).get('/api/gyms/gym1/reviews');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].gymId).toBe('gym1');
      expect(response.body.data[1].gymId).toBe('gym1');
    });
    
    it('should return empty array for gym with no reviews', async () => {
      const response = await request(app).get('/api/gyms/gym3/reviews');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });
  
  // Test POST /api/gyms/:id/reviews endpoint
  describe('POST /api/gyms/:id/reviews', () => {
    it('should add a new review to a gym', async () => {
      const newReview = {
        userId: 'user2',
        rating: 5,
        comment: 'Excellent trainers!'
      };
      
      const response = await request(app)
        .post('/api/gyms/gym3/reviews')
        .send(newReview);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.gymId).toBe('gym3');
      expect(response.body.data.rating).toBe(5);
      
      // Verify the review was added to the database
      const reviews = await db.getGymReviews('gym3');
      expect(reviews).toHaveLength(1);
    });
    
    it('should return 400 when required fields are missing', async () => {
      const incompleteReview = {
        userId: 'user1'
        // Missing rating
      };
      
      const response = await request(app)
        .post('/api/gyms/gym3/reviews')
        .send(incompleteReview);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
}); 