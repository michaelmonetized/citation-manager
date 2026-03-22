import { v } from "convex/values";

/**
 * Google Business Profile API Integration
 * Documentation: https://developers.google.com/my-business/
 *
 * Prerequisites:
 * 1. Google Cloud Project with My Business API enabled
 * 2. Service account credentials (JSON key file)
 * 3. Grant service account access to Google Business locations
 */

interface GoogleBusinessLocation {
  name: string;
  displayName: string;
  businessType: string;
  primaryPhone: string;
  primaryWebsite?: string;
  businessProfile?: {
    description?: string;
    categories?: string[];
  };
  openingHours?: {
    periods?: Array<{
      openDay: string;
      openTime?: string;
      closeDay: string;
      closeTime?: string;
    }>;
  };
  address: {
    postalCode?: string;
    countryCode: string;
    administrativeArea?: string;
    locality?: string;
    addressLines?: string[];
  };
}

interface GoogleAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Authenticate with Google using service account credentials
 * In production, store credentials in environment variables
 */
export const authenticateGoogle = async (): Promise<GoogleAuthToken> => {
  // TODO: Implement JWT generation from service account
  // For now, this is a placeholder showing the expected interface
  throw new Error("Not implemented: Google authentication");
};

/**
 * Convert internal location data to Google Business Profile format
 */
export const mapLocationToGoogleFormat = (locationData: {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
}): GoogleBusinessLocation => {
  return {
    displayName: locationData.businessName,
    name: "", // Set by Google API
    businessType: "LOCAL_BUSINESS",
    primaryPhone: locationData.phone,
    primaryWebsite: locationData.website,
    address: {
      addressLines: [locationData.address],
      locality: locationData.city,
      administrativeArea: locationData.state,
      postalCode: locationData.zipCode,
      countryCode: "US",
    },
  };
};

/**
 * Verify submission via Google Business Profile API
 * Poll to check if location is verified
 */
export const verifyGoogleBusinessSubmission = async (
  locationId: string,
  accessToken: string
): Promise<boolean> => {
  // TODO: Call Google API to check verification status
  // GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}
  throw new Error("Not implemented: Google verification");
};

/**
 * Types for Convex schema integration
 */
export const GoogleSubmissionSchema = {
  googleAccountId: v.string(),
  googleLocationId: v.optional(v.string()),
  verificationStatus: v.union(
    v.literal("pending"),
    v.literal("verified"),
    v.literal("failed")
  ),
  lastSyncAt: v.number(),
  apiResponse: v.optional(v.object({})),
};
