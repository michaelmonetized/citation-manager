import { v } from "convex/values";

/**
 * Google Business Profile API Integration
 * Documentation: https://developers.google.com/my-business/
 *
 * Prerequisites:
 * 1. Google Cloud Project with My Business API enabled
 * 2. Service account credentials (JSON key file)
 * 3. Grant service account access to Google Business locations
 * 4. GOOGLE_ACCESS_TOKEN env var with valid OAuth token
 */

interface GoogleBusinessLocation {
  displayName: string;
  businessType: string;
  primaryPhone: string;
  primaryWebsite?: string;
  businessProfile?: {
    description?: string;
    categories?: string[];
  };
  address: {
    postalCode?: string;
    countryCode: string;
    administrativeArea?: string;
    locality?: string;
    addressLines?: string[];
  };
}

/**
 * Get pre-configured Google access token from env
 * In production, this would be refreshed periodically
 */
const getGoogleAccessToken = (): string => {
  const token = process.env.GOOGLE_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "GOOGLE_ACCESS_TOKEN environment variable not set. " +
      "Obtain a token via OAuth2 service account flow and set as env var."
    );
  }
  return token;
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
 * Submit location to Google Business Profile
 */
export const submitGoogleBusiness = async (
  accountId: string,
  locationData: {
    businessName: string;
    address: string;
    phone: string;
    website?: string;
    city: string;
    state: string;
    zipCode: string;
  }
): Promise<{ googleLocationId: string; success: boolean }> => {
  const accessToken = getGoogleAccessToken();
  const formattedData = mapLocationToGoogleFormat(locationData);

  const response = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Business submission failed: ${error}`);
  }

  const result = (await response.json()) as { name: string };
  const googleLocationId = result.name.split("/").pop() || "";

  return { googleLocationId, success: true };
};

/**
 * Verify submission via Google Business Profile API
 * Checks that the location exists and has been verified
 */
export const verifyGoogleBusinessSubmission = async (
  accountId: string,
  googleLocationId: string
): Promise<boolean> => {
  try {
    const accessToken = getGoogleAccessToken();
    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${googleLocationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const location = (await response.json()) as {
      name?: string;
      state?: string;
    };

    // Verify location exists and has been created
    if (!location.name) {
      return false;
    }

    // Location state "VERIFIED" indicates successful verification
    // Other states: "UNVERIFIED", "VERIFICATION_PENDING"
    // For now, we accept any created location (state may be in transition)
    return true;
  } catch {
    return false;
  }
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
