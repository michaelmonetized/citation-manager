import { v } from "convex/values";

/**
 * Yelp Business API Integration
 * Documentation: https://www.yelp.com/developers
 *
 * Prerequisites:
 * 1. Yelp API key from developer account
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
  hours?: Array<{
    day: number;
    start: string;
    end: string;
    is_overnight: boolean;
  }>;
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
  // TODO: Call Yelp Search API
  // GET https://api.yelp.com/v3/businesses/search
  // Returns business_id if found
  throw new Error("Not implemented: Yelp search");
};

/**
 * Update or create Yelp business listing
 */
export const submitYelpBusiness = async (
  businessData: YelpBusinessData,
  apiKey: string
): Promise<{ yelpId: string; success: boolean }> => {
  // TODO: Call Yelp Business API to create/update
  // POST https://api.yelp.com/v3/businesses/{id}/update
  throw new Error("Not implemented: Yelp submission");
};

/**
 * Verify submission via Yelp API
 */
export const verifyYelpSubmission = async (
  yelpId: string,
  apiKey: string
): Promise<boolean> => {
  // TODO: Call Yelp API to check if listing is live
  // GET https://api.yelp.com/v3/businesses/{id}
  throw new Error("Not implemented: Yelp verification");
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
