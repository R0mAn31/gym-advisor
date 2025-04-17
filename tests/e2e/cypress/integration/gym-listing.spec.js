/** @format */

/// <reference types="cypress" />

describe("Gym Listing Page", () => {
  beforeEach(() => {
    // Visit the gym listing page before each test
    cy.visit("/gyms");

    // Ensure the page is loaded
    cy.get('[data-testid="gym-list"]').should("be.visible");
  });

  it("should display a list of gyms", () => {
    // Check if gym cards are displayed
    cy.get('[data-testid="gym-card"]').should("have.length.at.least", 1);

    // Check if each card has the necessary information
    cy.get('[data-testid="gym-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="gym-name"]').should("be.visible");
        cy.get('[data-testid="gym-address"]').should("be.visible");
        cy.get('[data-testid="gym-rating"]').should("be.visible");
      });
  });

  it("should filter gyms by rating", () => {
    // Select 4-star rating filter
    cy.get('[data-testid="rating-filter"]').click();
    cy.get('[data-testid="rating-filter-4"]').click();
    cy.get('[data-testid="apply-filters"]').click();

    // Wait for the filter to be applied
    cy.wait(1000);

    // Check if all displayed gyms have at least 4-star rating
    cy.get('[data-testid="gym-rating"]').each(($rating) => {
      const ratingValue = parseFloat($rating.text());
      expect(ratingValue).to.be.at.least(4);
    });
  });

  it("should search gyms by name", () => {
    // Type a search term
    const searchTerm = "fitness";
    cy.get('[data-testid="search-input"]').type(searchTerm);
    cy.get('[data-testid="search-button"]').click();

    // Wait for search results
    cy.wait(1000);

    // Check if all displayed gyms contain the search term in their name
    cy.get('[data-testid="gym-name"]').each(($name) => {
      const gymName = $name.text().toLowerCase();
      expect(gymName).to.include(searchTerm.toLowerCase());
    });
  });

  it("should navigate to gym details when clicking on a gym card", () => {
    // Store the name of the first gym
    let gymName;
    cy.get('[data-testid="gym-name"]')
      .first()
      .then(($name) => {
        gymName = $name.text();
      });

    // Click on the first gym card
    cy.get('[data-testid="gym-card"]').first().click();

    // Check if we navigated to the details page
    cy.url().should("include", "/gyms/");

    // Verify the gym details page shows the correct gym
    cy.get('[data-testid="gym-detail-name"]').should("have.text", gymName);
  });

  it("should handle no search results", () => {
    // Type a search term that will not match any gyms
    const searchTerm = "xyznonexistentgym123";
    cy.get('[data-testid="search-input"]').type(searchTerm);
    cy.get('[data-testid="search-button"]').click();

    // Wait for search results
    cy.wait(1000);

    // Check if "no results" message is displayed
    cy.get('[data-testid="no-results"]').should("be.visible");
  });

  it("should clear filters when reset button is clicked", () => {
    // Apply some filters
    cy.get('[data-testid="rating-filter"]').click();
    cy.get('[data-testid="rating-filter-4"]').click();

    cy.get('[data-testid="amenities-filter"]').click();
    cy.get('[data-testid="amenity-parking"]').check();

    cy.get('[data-testid="apply-filters"]').click();

    // Wait for filters to be applied
    cy.wait(1000);

    // Click the reset filters button
    cy.get('[data-testid="reset-filters"]').click();

    // Verify filters have been reset
    cy.get('[data-testid="rating-filter"]').should("contain", "Rating: Any");
    cy.get('[data-testid="amenities-filter"]').should(
      "contain",
      "Amenities: Any"
    );
  });

  it("should persist filters in URL parameters", () => {
    // Apply rating filter
    cy.get('[data-testid="rating-filter"]').click();
    cy.get('[data-testid="rating-filter-4"]').click();
    cy.get('[data-testid="apply-filters"]').click();

    // Check if URL contains the filter parameter
    cy.url().should("include", "minRating=4");

    // Reload the page
    cy.reload();

    // Check if the filter is still applied
    cy.get('[data-testid="rating-filter"]').should("contain", "Rating: 4+");

    // Check if filtered results are displayed
    cy.get('[data-testid="gym-rating"]').each(($rating) => {
      const ratingValue = parseFloat($rating.text());
      expect(ratingValue).to.be.at.least(4);
    });
  });

  it("should handle pagination correctly", () => {
    // Check if pagination is present
    cy.get('[data-testid="pagination"]').should("be.visible");

    // Get the gyms on the first page
    let firstPageGyms = [];
    cy.get('[data-testid="gym-name"]').each(($name) => {
      firstPageGyms.push($name.text());
    });

    // Go to the next page
    cy.get('[data-testid="next-page"]').click();

    // Wait for the page to load
    cy.wait(1000);

    // Verify we're on page 2
    cy.url().should("include", "page=2");

    // Get the gyms on the second page
    let secondPageGyms = [];
    cy.get('[data-testid="gym-name"]')
      .each(($name) => {
        secondPageGyms.push($name.text());
      })
      .then(() => {
        // Verify the gyms on the second page are different from the first page
        expect(firstPageGyms).not.to.deep.equal(secondPageGyms);
      });
  });

  it("should load more gyms when scrolling to the bottom (infinite scroll)", () => {
    // Check initial number of gym cards
    cy.get('[data-testid="gym-card"]').then(($cards) => {
      const initialCount = $cards.length;

      // Scroll to the bottom to trigger loading more gyms
      cy.scrollTo("bottom");

      // Wait for more gyms to load
      cy.wait(2000);

      // Check if more gym cards have been loaded
      cy.get('[data-testid="gym-card"]').should(
        "have.length.greaterThan",
        initialCount
      );
    });
  });
});
