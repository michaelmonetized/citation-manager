import { v } from "convex/values";

/**
 * Facebook Graph API Integration (Pages + Instagram Business)
 * Documentation: https://developers.facebook.com/docs/graph-api
 *
 * Prerequisites:
 * 1. Facebook Business Account
 * 2. App ID + App Secret
 * 3. Graph API token with pages_manage_posts permission
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
  business_hours?: Array<{
    day: number;
    open?: string;
    close?: string;
  }>;
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
  const [street, ...rest] = locationData.address.split(",");

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
  // TODO: Call Graph API to search for page
  // GET https://graph.facebook.com/v18.0/search?q=...&type=page&access_token=...
  throw new Error("Not implemented: Facebook search");
};

/**
 * Create or update Facebook Page
 */
export const submitFacebookPage = async (
  pageData: FacebookPageData,
  accessToken: string
): Promise<{ facebookPageId: string; success: boolean }> => {
  // TODO: Call Graph API to create/update page
  // POST https://graph.facebook.com/v18.0/{page-id}
  throw new Error("Not implemented: Facebook submission");
};

/**
 * Verify submission via Facebook API
 */
export const verifyFacebookSubmission = async (
  facebookPageId: string,
  accessToken: string
): Promise<boolean> => {
  // TODO: Call Graph API to check page status
  // GET https://graph.facebook.com/v18.0/{page-id}
  throw new Error("Not implemented: Facebook verification");
};

/**
 * Sync Instagram Business Account (linked to Facebook Page)
 */
export const syncInstagramBusiness = async (
  facebookPageId: string,
  accessToken: string
): Promise<string | null> => {
  // TODO: Get linked Instagram business account
  // GET https://graph.facebook.com/v18.0/{page-id}/instagram_business_account
  throw new Error("Not implemented: Instagram sync");
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
