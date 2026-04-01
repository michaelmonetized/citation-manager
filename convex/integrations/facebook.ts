import { v } from "convex/values";

/**
 * Facebook Graph API Integration (Pages + Instagram Business)
 * Documentation: https://developers.facebook.com/docs/graph-api
 *
 * Prerequisites:
 * 1. Facebook Business Account
 * 2. App ID + App Secret
 * 3. Graph API token with pages_manage_metadata permission
 * Environment variables: FACEBOOK_ACCESS_TOKEN, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
 */

interface FacebookPageData {
  name: string;
  about?: string;
  phone?: string;
  website?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface FacebookPage {
  id: string;
  name: string;
  access_token?: string;
}

interface FacebookSearchResult {
  data: Array<{ id: string; name: string }>;
}

/**
 * Convert internal location data to Facebook Page format
 */
export const mapLocationToFacebookFormat = (locationData: {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
}): FacebookPageData => {
  const addressParts = locationData.address.split(",");
  const street = addressParts[0];

  return {
    name: locationData.businessName,
    phone: locationData.phone,
    website: locationData.website,
    street: street?.trim(),
    city: locationData.city,
    state: locationData.state,
    zip: locationData.zipCode,
    country: "US",
  };
};

/**
 * Rate limiting helper with exponential backoff
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
 * Search for existing Facebook Page
 */
export const searchFacebookPage = async (
  businessName: string,
  city: string,
  accessToken: string
): Promise<string | null> => {
  if (!accessToken) {
    throw new Error("FACEBOOK_ACCESS_TOKEN environment variable not set");
  }

  const params = new URLSearchParams({
    q: `${businessName} ${city}`,
    type: "page",
    fields: "id,name",
    access_token: accessToken,
  });

  try {
    const data = await retryWithBackoff(async () => {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/search?${params}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limited by Facebook - please try again later");
        } else if (response.status === 401) {
          throw new Error("Invalid Facebook access token");
        }
        throw new Error(`Facebook search failed: ${response.statusText}`);
      }

      return (await response.json()) as FacebookSearchResult;
    });

    return data.data.length > 0 ? data.data[0].id : null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Facebook search error:", errorMessage);
    throw new Error(`Failed to search Facebook: ${errorMessage}`);
  }
};

/**
 * Update Facebook Page information
 */
export const submitFacebookPage = async (
  pageId: string,
  pageData: FacebookPageData,
  accessToken: string
): Promise<{ facebookPageId: string; success: boolean; error?: string }> => {
  try {
    if (!accessToken) {
      return {
        facebookPageId: "",
        success: false,
        error: "FACEBOOK_ACCESS_TOKEN not configured",
      };
    }

    const params = new URLSearchParams({
      access_token: accessToken,
    });

    await retryWithBackoff(async () => {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?${params}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pageData),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        if (response.status === 429) {
          throw new Error("Rate limited by Facebook - please try again later");
        } else if (response.status === 401) {
          throw new Error("Invalid Facebook access token");
        } else if (response.status === 400) {
          throw new Error(`Invalid page data: ${error}`);
        }
        throw new Error(`Facebook submission failed: ${error}`);
      }

      return response;
    });

    return { facebookPageId: pageId, success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      facebookPageId: "",
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Verify submission via Facebook API
 * Checks that the page exists and verify at least one metadata field was updated
 */
export const verifyFacebookSubmission = async (
  facebookPageId: string,
  accessToken: string
): Promise<{
  verified: boolean;
  hasContactInfo?: boolean;
  error?: string;
}> => {
  try {
    if (!accessToken) {
      return {
        verified: false,
        error: "FACEBOOK_ACCESS_TOKEN not configured",
      };
    }

    const params = new URLSearchParams({
      fields: "id,name,phone,website,about,email",
      access_token: accessToken,
    });

    const page = await retryWithBackoff(async () => {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${facebookPageId}?${params}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Page not found");
        } else if (response.status === 429) {
          throw new Error("Rate limited - please try again later");
        }
        throw new Error(`Failed to verify (${response.status})`);
      }

      return (await response.json()) as FacebookPage & {
        phone?: string;
        website?: string;
        about?: string;
        email?: string;
      };
    });

    // Page must exist
    if (!page.id) {
      return {
        verified: false,
        error: "Page not found",
      };
    }

    // Verify at least one business data field is present
    const hasContactInfo =
      !!page.phone || !!page.website || !!page.about || !!page.email;

    return {
      verified: true,
      hasContactInfo,
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
 * Get Instagram Business Account linked to Facebook Page
 */
export const getInstagramBusiness = async (
  facebookPageId: string,
  accessToken: string
): Promise<{ instagramId: string | null; error?: string }> => {
  try {
    if (!accessToken) {
      return {
        instagramId: null,
        error: "FACEBOOK_ACCESS_TOKEN not configured",
      };
    }

    const params = new URLSearchParams({
      fields: "instagram_business_account",
      access_token: accessToken,
    });

    const result = await retryWithBackoff(async () => {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${facebookPageId}?${params}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Page not found");
        } else if (response.status === 429) {
          throw new Error("Rate limited - please try again later");
        }
        throw new Error(`Failed to get Instagram business (${response.status})`);
      }

      return (await response.json()) as { instagram_business_account?: { id: string } };
    });

    return {
      instagramId: result.instagram_business_account?.id ?? null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      instagramId: null,
      error: errorMessage,
    };
  }
};

/**
 * Types for Convex schema integration
 */
export const FacebookSubmissionSchema = {
  facebookPageId: v.optional(v.string()),
  instagramBusinessId: v.optional(v.string()),
  verificationStatus: v.union(
    v.literal("pending"),
    v.literal("verified"),
    v.literal("failed")
  ),
  lastSyncAt: v.number(),
  apiResponse: v.optional(v.object({})),
};
