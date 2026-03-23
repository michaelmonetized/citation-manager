import { v } from "convex/values";

/**
 * Yelp Business API Integration
 * Documentation: https://www.yelp.com/developers
 *
 * Prerequisites:
 * 1. Yelp API key from developer account (YELP_API_KEY env var)
 * 2. Yelp Business ID (obtainable via Yelp Search API)
 */

interface YelpBusinessData {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  website?: string;
  categories?: Array<{ alias: string }>;
}

interface YelpSearchResult {
  businesses: Array<{ id: string; name: string }>;
}

interface YelpBusiness {
  id: string;
  name: string;
  is_claimed: boolean;
}

/**
 * Convert internal location data to Yelp Business format
 */
export const mapLocationToYelpFormat = (locationData: {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
}): YelpBusinessData => {
  return {
    name: locationData.businessName,
    phone: locationData.phone,
    address1: locationData.address,
    city: locationData.city,
    state: locationData.state,
    zip: locationData.zipCode,
    country: "US",
    website: locationData.website,
    categories: [{ alias: "local_services" }],
  };
};

/**
 * Search for existing Yelp business to link/update
 */
export const searchYelpBusiness = async (
  businessName: string,
  city: string,
  apiKey: string
): Promise<string | null> => {
  const params = new URLSearchParams({
    term: businessName,
    location: city,
    limit: "5",
  });

  const response = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Yelp search failed: ${response.statusText}`);
  }

  const data = (await response.json()) as YelpSearchResult;
  return data.businesses.length > 0 ? data.businesses[0].id : null;
};

/**
 * Claim or update Yelp business listing
 */
export const submitYelpBusiness = async (
  businessData: YelpBusinessData,
  apiKey: string
): Promise<{ yelpId: string; success: boolean }> => {
  // First, search for existing business
  const yelpId = await searchYelpBusiness(businessData.name, businessData.city, apiKey);

  if (!yelpId) {
    throw new Error("Yelp business not found. Create via Yelp website first.");
  }

  // Update business info
  const response = await fetch(`https://api.yelp.com/v3/businesses/${yelpId}/update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(businessData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yelp submission failed: ${error}`);
  }

  return { yelpId, success: true };
};

/**
 * Verify submission via Yelp API
 */
export const verifyYelpSubmission = async (
  yelpId: string,
  apiKey: string
): Promise<boolean> => {
  const response = await fetch(`https://api.yelp.com/v3/businesses/${yelpId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const business = (await response.json()) as YelpBusiness;
  return business.is_claimed;
};

/**
 * Types for Convex schema integration
 */
export const YelpSubmissionSchema = {
  yelpBusinessId: v.optional(v.string()),
  verificationStatus: v.union(
    v.literal("pending"),
    v.literal("verified"),
    v.literal("failed")
  ),
  lastSyncAt: v.number(),
  apiResponse: v.optional(v.object({})),
};
