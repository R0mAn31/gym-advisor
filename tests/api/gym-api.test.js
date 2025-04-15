/** @format */

const request = require("supertest");
const baseUrl = "https://api.gym-advisor.com"; // Replace with your actual API base URL

// Mock authentication token
const getAuthToken = async () => {
  const response = await request(baseUrl).post("/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });

  return response.body.token;
};

describe("Gym API Tests", () => {
  let authToken;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  describe("GET /gyms", () => {
    it("should return a list of gyms", async () => {
      const response = await request(baseUrl)
        .get("/gyms")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("gyms");
      expect(Array.isArray(response.body.gyms)).toBe(true);
    });

    it("should filter gyms by rating", async () => {
      const minRating = 4;

      const response = await request(baseUrl)
        .get(`/gyms?minRating=${minRating}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("gyms");
      expect(Array.isArray(response.body.gyms)).toBe(true);

      // Verify all returned gyms have rating >= minRating
      response.body.gyms.forEach((gym) => {
        expect(gym.rating).toBeGreaterThanOrEqual(minRating);
      });
    });

    it("should search gyms by name", async () => {
      const searchQuery = "fitness";

      const response = await request(baseUrl)
        .get(`/gyms?query=${searchQuery}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("gyms");

      // Verify returned gyms contain the search term in their name
      response.body.gyms.forEach((gym) => {
        expect(gym.name.toLowerCase()).toContain(searchQuery.toLowerCase());
      });
    });
  });

  describe("GET /gyms/:id", () => {
    it("should return a specific gym by ID", async () => {
      const gymId = "123456"; // Replace with a valid gym ID

      const response = await request(baseUrl)
        .get(`/gyms/${gymId}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", gymId);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("address");
      expect(response.body).toHaveProperty("rating");
    });

    it("should return 404 for non-existent gym ID", async () => {
      const nonExistentId = "nonexistentid";

      const response = await request(baseUrl)
        .get(`/gyms/${nonExistentId}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /gyms (Admin only)", () => {
    it("should create a new gym when authenticated as admin", async () => {
      const newGym = {
        name: "Test Gym",
        address: "123 Test Street",
        description: "A test gym",
        phone: "123-456-7890",
        email: "test@testgym.com",
        amenities: ["Parking", "Showers", "Sauna"],
        workingHours: {
          monday: "06:00-22:00",
          tuesday: "06:00-22:00",
          wednesday: "06:00-22:00",
          thursday: "06:00-22:00",
          friday: "06:00-22:00",
          saturday: "08:00-20:00",
          sunday: "08:00-20:00",
        },
      };

      const response = await request(baseUrl)
        .post("/gyms")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(newGym);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name", newGym.name);
    });

    it("should return 401 when creating gym without authentication", async () => {
      const newGym = {
        name: "Test Gym",
        address: "123 Test Street",
      };

      const response = await request(baseUrl)
        .post("/gyms")
        .set("Accept", "application/json")
        .send(newGym);

      expect(response.status).toBe(401);
    });

    it("should validate required fields when creating gym", async () => {
      const incompleteGym = {
        // Missing required 'name' field
        address: "123 Test Street",
      };

      const response = await request(baseUrl)
        .post("/gyms")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(incompleteGym);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: "name",
          message: expect.stringContaining("required"),
        })
      );
    });
  });

  describe("PUT /gyms/:id (Admin only)", () => {
    it("should update an existing gym", async () => {
      const gymId = "123456"; // Replace with a valid gym ID
      const updates = {
        name: "Updated Test Gym",
        phone: "555-123-4567",
      };

      const response = await request(baseUrl)
        .put(`/gyms/${gymId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", gymId);
      expect(response.body).toHaveProperty("name", updates.name);
      expect(response.body).toHaveProperty("phone", updates.phone);
    });
  });

  describe("DELETE /gyms/:id (Admin only)", () => {
    it("should delete an existing gym", async () => {
      const gymId = "123456"; // Replace with a valid gym ID

      const response = await request(baseUrl)
        .delete(`/gyms/${gymId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(204);
    });

    it("should return 404 when deleting non-existent gym", async () => {
      const nonExistentId = "nonexistentid";

      const response = await request(baseUrl)
        .delete(`/gyms/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /gyms/:id/reviews", () => {
    it("should add a review to a gym when authenticated", async () => {
      const gymId = "123456"; // Replace with a valid gym ID
      const newReview = {
        rating: 4,
        comment: "Great facilities and friendly staff",
      };

      const response = await request(baseUrl)
        .post(`/gyms/${gymId}/reviews`)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(newReview);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("gymId", gymId);
      expect(response.body).toHaveProperty("rating", newReview.rating);
      expect(response.body).toHaveProperty("comment", newReview.comment);
    });

    it("should validate review rating is between 1-5", async () => {
      const gymId = "123456"; // Replace with a valid gym ID
      const invalidReview = {
        rating: 6, // Invalid rating (> 5)
        comment: "Great facilities",
      };

      const response = await request(baseUrl)
        .post(`/gyms/${gymId}/reviews`)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(invalidReview);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: "rating",
          message: expect.stringContaining("between 1 and 5"),
        })
      );
    });
  });
});
