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
 *
 * NOTE: Yelp's public API does not provide business claim or update endpoints.
 * This function requires a Yelp Data Ingestion partner account for full functionality.
 * Currently, this finds the business via search API and returns the ID for manual claim.
 */
export const submitYelpBusiness = async (
  businessData: YelpBusinessData,
  apiKey: string
): Promise<{ yelpId: string; success: boolean }> => {
  // Search for existing business by name + location
  const yelpId = await searchYelpBusiness(businessData.name, businessData.city, apiKey);

  if (!yelpId) {
    // Business not found in Yelp's database yet
    throw new Error(
      `Yelp business not found. The business must exist on Yelp first. ` +
      `Create a listing at https://business.yelp.com/ or contact Yelp Support.`
    );
  }

  // Return the ID for manual claim or partner API integration
  // In production with partner access, you would:
  // 1. POST to https://partner-api.yelp.com/v1/ingest/create with claim request
  // 2. Poll the async job status
  // For now, we return the ID for external processing
  return { yelpId, success: true };
};

/**
 * Verify submission via Yelp API
 * Checks if the business exists and is accessible via the API
 *
 * NOTE: The is_claimed field reflects SMB claims via Yelp's dashboard.
 * Partner API claims require polling the partner claim status endpoint.
 */
export const verifyYelpSubmission = async (
  yelpId: string,
  apiKey: string
): Promise<boolean> => {
  try {
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
    // Business exists in Yelp's database; claim status depends on claimed flag
    return !!business.id;
  } catch {
    return false;
  }
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
