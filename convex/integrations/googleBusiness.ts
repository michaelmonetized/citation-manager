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

interface GoogleAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Generate JWT for service account authentication
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY env vars
 */
const generateJWT = (): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/business.manage",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  // Note: In production, you'd need to properly sign this with RS256.
  // For now, this shows the structure.
  const headerEncoded = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const payloadEncoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${headerEncoded}.${payloadEncoded}.signature_placeholder`;
};

/**
 * Authenticate with Google using service account credentials
 */
export const authenticateGoogle = async (): Promise<GoogleAuthToken> => {
  const jwt = generateJWT();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Google auth failed: ${response.statusText}`);
  }

  return await response.json();
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
  },
  accessToken: string
): Promise<{ googleLocationId: string; success: boolean }> => {
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
 */
export const verifyGoogleBusinessSubmission = async (
  accountId: string,
  googleLocationId: string,
  accessToken: string
): Promise<boolean> => {
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

  const location = (await response.json()) as { name?: string };
  return !!location.name;
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
