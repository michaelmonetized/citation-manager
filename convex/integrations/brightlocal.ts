import { v } from "convex/values";

/**
 * BrightLocal API Integration
 * Documentation: https://www.brightlocal.com/api-documentation
 *
 * BrightLocal provides a centralized platform to manage citations across 958+ directories.
 * This integration submits business locations to their API, which then distributes to partner directories.
 *
 * Prerequisites:
 * 1. BrightLocal account created at https://www.brightlocal.com
 * 2. API key obtained from account settings
 * 3. Set BRIGHTLOCAL_API_KEY environment variable
 */

interface BrightLocalLocation {
  business_name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country_code: string;
  phone: string;
  website?: string;
  business_hours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

interface BrightLocalCampaignResponse {
  success: boolean;
  campaign_id?: number;
  message?: string;
}

/**
 * Get BrightLocal API key from environment
 */
const getBrightLocalApiKey = (): string => {
  const key = process.env.BRIGHTLOCAL_API_KEY;
  if (!key) {
    throw new Error(
      "BRIGHTLOCAL_API_KEY environment variable not set. " +
      "Get your API key from https://www.brightlocal.com/account/api"
    );
  }
  return key;
};

/**
 * Convert internal location data to BrightLocal format
 */
export const mapLocationToBrightLocalFormat = (locationData: {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
  businessHours?: Record<string, string>;
}): BrightLocalLocation => {
  return {
    business_name: locationData.businessName,
    address: locationData.address,
    city: locationData.city,
    state: locationData.state,
    postcode: locationData.zipCode,
    country_code: "US",
    phone: locationData.phone,
    website: locationData.website,
    business_hours: locationData.businessHours as BrightLocalLocation["business_hours"],
  };
};

/**
 * Create a citation campaign in BrightLocal
 * This submits the location to 958+ directories in one call
 */
export const submitBrightLocalCampaign = async (
  accountId: string,
  locationData: {
    businessName: string;
    address: string;
    phone: string;
    website?: string;
    city: string;
    state: string;
    zipCode: string;
    businessHours?: Record<string, string>;
  }
): Promise<{ campaignId: number; success: boolean }> => {
  const apiKey = getBrightLocalApiKey();
  const formattedData = mapLocationToBrightLocalFormat(locationData);

  const response = await fetch("https://api.brightlocal.com/rest/v4/campaigns/create", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formattedData,
      account_id: accountId,
      // Submit to all available directories
      submission_method: "all",
      // Auto-publish once created (ready for submission)
      publish_immediately: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BrightLocal campaign creation failed: ${error}`);
  }

  const result = (await response.json()) as BrightLocalCampaignResponse;

  if (!result.success || !result.campaign_id) {
    throw new Error(`BrightLocal API error: ${result.message || "Unknown error"}`);
  }

  return { campaignId: result.campaign_id, success: true };
};

/**
 * Publish a campaign (submit to all partner directories)
 * Call this after campaign is created and verified
 */
export const publishBrightLocalCampaign = async (
  campaignId: number
): Promise<{ success: boolean; publishedAt: number }> => {
  const apiKey = getBrightLocalApiKey();

  const response = await fetch(
    `https://api.brightlocal.com/rest/v4/campaigns/${campaignId}/publish`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BrightLocal campaign publish failed: ${error}`);
  }

  const result = (await response.json()) as { success: boolean };

  return {
    success: result.success,
    publishedAt: Date.now(),
  };
};

/**
 * Get campaign status (check submission progress)
 */
export const getBrightLocalCampaignStatus = async (
  campaignId: number
): Promise<{
  status: "created" | "published" | "in_progress" | "completed" | "failed";
  directoriesSubmitted: number;
  directoriesVerified: number;
  directoriesPending: number;
  lastUpdated: number;
}> => {
  const apiKey = getBrightLocalApiKey();

  const response = await fetch(
    `https://api.brightlocal.com/rest/v4/campaigns/${campaignId}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("BrightLocal campaign status fetch failed");
  }

  const data = (await response.json()) as {
    campaign: {
      status?: string;
      submitted?: number;
      verified?: number;
      pending?: number;
    };
  };

  const status = (data.campaign.status || "created") as
    | "created"
    | "published"
    | "in_progress"
    | "completed"
    | "failed";

  return {
    status,
    directoriesSubmitted: data.campaign.submitted || 0,
    directoriesVerified: data.campaign.verified || 0,
    directoriesPending: data.campaign.pending || 0,
    lastUpdated: Date.now(),
  };
};

/**
 * Get directory submissions from a campaign
 * Returns which directories the location was submitted to and their status
 */
export const getBrightLocalDirectorySubmissions = async (
  campaignId: number,
  limit: number = 50
): Promise<Array<{
  directoryName: string;
  directoryId: number;
  status: "submitted" | "verified" | "failed" | "pending";
  submittedAt?: number;
  verifiedAt?: number;
  url?: string;
}>> => {
  const apiKey = getBrightLocalApiKey();

  const response = await fetch(
    `https://api.brightlocal.com/rest/v4/campaigns/${campaignId}/listings?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("BrightLocal listings fetch failed");
  }

  const data = (await response.json()) as {
    listings: Array<{
      directory_name?: string;
      directory_id?: number;
      status?: string;
      submitted_date?: number;
      verified_date?: number;
      listing_url?: string;
    }>;
  };

  return (data.listings || []).map((listing) => ({
    directoryName: listing.directory_name || "Unknown",
    directoryId: listing.directory_id || 0,
    status: (listing.status || "pending") as
      | "submitted"
      | "verified"
      | "failed"
      | "pending",
    submittedAt: listing.submitted_date,
    verifiedAt: listing.verified_date,
    url: listing.listing_url,
  }));
};

/**
 * Types for Convex schema integration
 */
export const BrightLocalSubmissionSchema = {
  brightlocalCampaignId: v.number(),
  status: v.union(
    v.literal("created"),
    v.literal("published"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("failed")
  ),
  directoriesSubmitted: v.number(),
  directoriesVerified: v.number(),
  directoriesPending: v.number(),
  lastSyncAt: v.number(),
};
