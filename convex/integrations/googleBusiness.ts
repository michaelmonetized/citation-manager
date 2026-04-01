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
 * Generate JWT token from Google service account
 * Uses service account JSON stored in GOOGLE_SERVICE_ACCOUNT_JSON env var
 */
const generateGoogleJWT = (): string => {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON environment variable not set. " +
      "See .env.example for setup instructions."
    );
  }

  try {
    // Note: In production, use a proper JWT library like 'jsonwebtoken'
    // This is a placeholder - actual implementation would need:
    // import jwt from 'jsonwebtoken';
    // const account = JSON.parse(serviceAccountJson);
    // return jwt.sign({ scope: 'https://www.googleapis.com/auth/business.manage' }, account.private_key, { algorithm: 'RS256' });
    
    // For now, return a placeholder that would be replaced
    const account = JSON.parse(serviceAccountJson);
    return `Bearer ${account.type}:${account.project_id}`;
  } catch (error) {
    throw new Error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: " + String(error));
  }
};

/**
 * Get pre-configured Google access token from env
 * Falls back to JWT generation if direct token not provided
 */
const getGoogleAccessToken = (): string => {
  const token = process.env.GOOGLE_ACCESS_TOKEN;
  if (token) {
    return token;
  }

  // Try JWT generation as fallback
  try {
    return generateGoogleJWT();
  } catch {
    throw new Error(
      "GOOGLE_ACCESS_TOKEN environment variable not set, and GOOGLE_SERVICE_ACCOUNT_JSON invalid. " +
      "Provide either a valid access token or service account JSON. See .env.example."
    );
  }
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
 * Retry logic with exponential backoff
 */
const retryWithBackoff = async <T,>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on auth errors
      if (lastError.message.includes("401") || lastError.message.includes("403")) {
        throw lastError;
      }

      if (attempt < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
};

/**
 * Submit location to Google Business Profile
 * Includes retry logic and rate limiting
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
): Promise<{ googleLocationId: string; success: boolean; error?: string }> => {
  try {
    const accessToken = getGoogleAccessToken();
    const formattedData = mapLocationToGoogleFormat(locationData);

    const result = await retryWithBackoff(async () => {
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
        const message = `Google Business submission failed (${response.status}): ${error}`;
        
        // Return structured error for user display
        if (response.status === 400) {
          throw new Error(`Invalid location data: ${error}`);
        } else if (response.status === 429) {
          throw new Error("Rate limited by Google - please try again later");
        } else if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed - check API credentials");
        }
        
        throw new Error(message);
      }

      return (await response.json()) as { name: string };
    });

    const googleLocationId = result.name.split("/").pop() || "";

    return { googleLocationId, success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      googleLocationId: "",
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Verify submission via Google Business Profile API
 * Checks that the location exists and returns verification status
 */
export const verifyGoogleBusinessSubmission = async (
  accountId: string,
  googleLocationId: string
): Promise<{
  verified: boolean;
  status?: string;
  error?: string;
}> => {
  try {
    const accessToken = getGoogleAccessToken();
    
    const response = await retryWithBackoff(async () => {
      return await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${googleLocationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    });

    if (!response.ok) {
      return {
        verified: false,
        error: `Failed to fetch verification status (${response.status})`,
      };
    }

    const location = (await response.json()) as {
      name?: string;
      state?: string;
      verificationStatus?: {
        status: string;
        canReVerify?: boolean;
      };
    };

    // Verify location exists
    if (!location.name) {
      return {
        verified: false,
        error: "Location not found",
      };
    }

    const verificationStatus = location.verificationStatus?.status || "UNVERIFIED";
    const isVerified = verificationStatus === "VERIFIED";

    return {
      verified: isVerified,
      status: verificationStatus,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      verified: false,
      error: errorMessage,
    };
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
