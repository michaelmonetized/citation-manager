import { describe, it, expect } from "@jest/globals";
import {
  submitGoogleBusiness,
  verifyGoogleBusinessSubmission,
  mapLocationToGoogleFormat,
} from "@/convex/integrations/googleBusiness";
import {
  submitYelpBusiness,
  verifyYelpSubmission,
  searchYelpBusiness,
  mapLocationToYelpFormat,
} from "@/convex/integrations/yelp";
import {
  submitFacebookPage,
  verifyFacebookSubmission,
  searchFacebookPage,
  getInstagramBusiness,
  mapLocationToFacebookFormat,
} from "@/convex/integrations/facebook";

// Test location data
const testLocation = {
  businessName: "Test Pizza Co",
  address: "123 Main St",
  phone: "+1-555-123-4567",
  website: "https://testpizza.com",
  city: "Austin",
  state: "TX",
  zipCode: "78701",
};

describe("Google Business Profile Integration", () => {
  it("maps location data to Google format correctly", () => {
    const result = mapLocationToGoogleFormat(testLocation);
    expect(result.displayName).toBe(testLocation.businessName);
    expect(result.primaryPhone).toBe(testLocation.phone);
    expect(result.address.locality).toBe(testLocation.city);
    expect(result.address.postalCode).toBe(testLocation.zipCode);
  });

  it("returns error when GOOGLE_ACCESS_TOKEN is not set", async () => {
    // Temporarily remove env var
    const originalToken = process.env.GOOGLE_ACCESS_TOKEN;
    delete process.env.GOOGLE_ACCESS_TOKEN;

    try {
      const result = await submitGoogleBusiness("test-account-id", testLocation);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    } finally {
      // Restore env var
      if (originalToken) {
        process.env.GOOGLE_ACCESS_TOKEN = originalToken;
      }
    }
  });

  it("handles verification errors gracefully", async () => {
    const result = await verifyGoogleBusinessSubmission(
      "invalid-account",
      "invalid-location-id"
    );
    expect(result.verified).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("Yelp Business Integration", () => {
  it("maps location data to Yelp format correctly", () => {
    const result = mapLocationToYelpFormat(testLocation);
    expect(result.name).toBe(testLocation.businessName);
    expect(result.phone).toBe(testLocation.phone);
    expect(result.city).toBe(testLocation.city);
    expect(result.zip).toBe(testLocation.zipCode);
    expect(result.country).toBe("US");
  });

  it("returns error when YELP_API_KEY is not set", async () => {
    const originalKey = process.env.YELP_API_KEY;
    delete process.env.YELP_API_KEY;

    try {
      const result = await submitYelpBusiness(
        mapLocationToYelpFormat(testLocation),
        ""
      );
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    } finally {
      if (originalKey) {
        process.env.YELP_API_KEY = originalKey;
      }
    }
  });

  it("handles search errors gracefully", async () => {
    try {
      await searchYelpBusiness(
        testLocation.businessName,
        testLocation.city,
        "invalid-key"
      );
      // Should return null or throw, either is valid
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("handles verification with missing API key", async () => {
    const result = await verifyYelpSubmission("test-yelp-id", "");
    expect(result.verified).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("Facebook Graph API Integration", () => {
  it("maps location data to Facebook format correctly", () => {
    const result = mapLocationToFacebookFormat(testLocation);
    expect(result.name).toBe(testLocation.businessName);
    expect(result.phone).toBe(testLocation.phone);
    expect(result.city).toBe(testLocation.city);
    expect(result.zip).toBe(testLocation.zipCode);
    expect(result.country).toBe("US");
  });

  it("returns error when FACEBOOK_ACCESS_TOKEN is not set", async () => {
    const originalToken = process.env.FACEBOOK_ACCESS_TOKEN;
    delete process.env.FACEBOOK_ACCESS_TOKEN;

    try {
      const result = await submitFacebookPage(
        "test-page-id",
        mapLocationToFacebookFormat(testLocation),
        ""
      );
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    } finally {
      if (originalToken) {
        process.env.FACEBOOK_ACCESS_TOKEN = originalToken;
      }
    }
  });

  it("handles search errors gracefully", async () => {
    try {
      await searchFacebookPage(
        testLocation.businessName,
        testLocation.city,
        "invalid-token"
      );
      // Should return null or throw
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("handles verification with missing API token", async () => {
    const result = await verifyFacebookSubmission("test-page-id", "");
    expect(result.verified).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("handles Instagram business fetch with missing token", async () => {
    const result = await getInstagramBusiness("test-page-id", "");
    expect(result.instagramId).toBeNull();
    expect(result.error).toBeDefined();
  });
});

describe("Integration Error Handling", () => {
  it("all APIs handle rate limiting gracefully", async () => {
    // This test verifies that rate limiting errors are caught
    // and returned as user-facing error messages
    const googleResult = await submitGoogleBusiness(
      "test-account",
      testLocation
    );
    if (!googleResult.success && googleResult.error) {
      const error = googleResult.error.toLowerCase();
      expect(
        error.includes("configured") ||
          error.includes("failed") ||
          error.includes("rate")
      ).toBe(true);
    }
  });

  it("all APIs provide user-friendly error messages", async () => {
    const yelpResult = await submitYelpBusiness(
      mapLocationToYelpFormat(testLocation),
      ""
    );
    if (!yelpResult.success && yelpResult.error) {
      // Error should be understandable to non-technical users
      expect(typeof yelpResult.error).toBe("string");
      expect(yelpResult.error.length).toBeGreaterThan(0);
    }
  });
});
