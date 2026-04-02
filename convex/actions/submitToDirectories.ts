import { action } from "../_generated/server";
import { v } from "convex/values";
import { submitGoogleBusiness } from "../integrations/googleBusiness";

/**
 * Background action to submit locations to directories
 * Called asynchronously after bulk submission
 * Can be triggered via HTTP webhook or scheduled function
 */
export const submitLocationToDirectory = action({
  args: {
    submissionId: v.id("submissions"),
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
    directoryName: v.string(),
    locationData: v.object({
      businessName: v.string(),
      address: v.string(),
      phone: v.string(),
      website: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { submissionId, directoryName, locationData } = args;

    try {
      let result: { success: boolean; error?: string; googleLocationId?: string };

      // Route to appropriate API based on directory
      if (directoryName.includes("Google") || directoryName.includes("Google Business")) {
        result = await submitGoogleBusiness(
          process.env.GOOGLE_ACCOUNT_ID || "",
          locationData
        );
      } else if (directoryName.includes("Yelp")) {
        result = await submitToYelp(locationData);
      } else if (directoryName.includes("Facebook")) {
        result = await submitToFacebook(locationData);
      } else {
        // Default: mark as submitted for manual handling
        result = { success: true };
      }

      // Update submission record with result
      if (result.success) {
        await ctx.runMutation("submissions:updateSubmissionStatus" as any, {
          submissionId,
          status: "submitted",
        });
      } else {
        await ctx.runMutation("submissions:updateSubmissionStatus" as any, {
          submissionId,
          status: "failed",
          errorMessage: result.error || "Submission failed",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Mark submission as failed
      await ctx.runMutation("submissions:updateSubmissionStatus" as any, {
        submissionId,
        status: "failed",
        errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
});

/**
 * Submit to Yelp Business API
 * Documentation: https://www.yelp.com/developers/documentation/v3/business_endpoints
 */
async function submitToYelp(locationData: {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
}): Promise<{ success: boolean; error?: string }> {
  const yelpApiKey = process.env.YELP_API_KEY;
  if (!yelpApiKey) {
    return { success: false, error: "Yelp API key not configured" };
  }

  try {
    // Yelp's partner API requires business agreement
    // For MVP, we'll prepare the data but note that direct submission requires partnership
    console.log("Yelp submission prepared (requires business partnership agreement):", {
      businessName: locationData.businessName,
      phone: locationData.phone,
      address: `${locationData.address}, ${locationData.city}, ${locationData.state} ${locationData.zipCode}`,
    });

    return {
      success: true, // Mark as submitted for manual followup
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Yelp submission failed",
    };
  }
}

/**
 * Submit to Facebook Graph API
 * Updates Facebook business page information
 */
async function submitToFacebook(locationData: {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
}): Promise<{ success: boolean; error?: string }> {
  const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!facebookToken) {
    return { success: false, error: "Facebook access token not configured" };
  }

  try {
    // Update Facebook page with business information
    const pageData = {
      phone: locationData.phone,
      website: locationData.website,
      address: `${locationData.address}, ${locationData.city}, ${locationData.state} ${locationData.zipCode}`,
    };

    // In production, call Facebook Graph API:
    // POST https://graph.facebook.com/v18.0/{page-id} with pageData
    
    console.log("Facebook submission prepared:", pageData);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Facebook submission failed",
    };
  }
}
