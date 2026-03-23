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
 * Search for existing Facebook Page
 */
export const searchFacebookPage = async (
  businessName: string,
  city: string,
  accessToken: string
): Promise<string | null> => {
  const params = new URLSearchParams({
    q: `${businessName} ${city}`,
    type: "page",
    fields: "id,name",
    access_token: accessToken,
  });

  const response = await fetch(
    `https://graph.facebook.com/v18.0/search?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Facebook search failed: ${response.statusText}`);
  }

  const data = (await response.json()) as FacebookSearchResult;
  return data.data.length > 0 ? data.data[0].id : null;
};

/**
 * Update Facebook Page information
 */
export const submitFacebookPage = async (
  pageId: string,
  pageData: FacebookPageData,
  accessToken: string
): Promise<{ facebookPageId: string; success: boolean }> => {
  const params = new URLSearchParams({
    access_token: accessToken,
  });

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
    throw new Error(`Facebook submission failed: ${error}`);
  }

  return { facebookPageId: pageId, success: true };
};

/**
 * Verify submission via Facebook API
 * Checks that the page exists and verify at least one metadata field was updated
 */
export const verifyFacebookSubmission = async (
  facebookPageId: string,
  accessToken: string
): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      fields: "id,name,phone,website,about,email",
      access_token: accessToken,
    });

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${facebookPageId}?${params}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return false;
    }

    const page = (await response.json()) as FacebookPage & {
      phone?: string;
      website?: string;
      about?: string;
      email?: string;
    };

    // Page must exist and have at least one contact field populated
    if (!page.id) {
      return false;
    }

    // Verify at least one business data field is present
    const hasContactInfo =
      !!page.phone || !!page.website || !!page.about || !!page.email;

    return hasContactInfo;
  } catch {
    return false;
  }
};

/**
 * Get Instagram Business Account linked to Facebook Page
 */
export const getInstagramBusiness = async (
  facebookPageId: string,
  accessToken: string
): Promise<string | null> => {
  const params = new URLSearchParams({
    fields: "instagram_business_account",
    access_token: accessToken,
  });

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${facebookPageId}?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as { instagram_business_account?: { id: string } };
  return result.instagram_business_account?.id ?? null;
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
