import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { submitGoogleBusiness, verifyGoogleBusinessSubmission } from "./integrations/googleBusiness";
import { submitYelpBusiness, verifyYelpSubmission } from "./integrations/yelp";
import { searchFacebookPage, submitFacebookPage, verifyFacebookSubmission } from "./integrations/facebook";

/**
 * Internal action to submit a location to a specific directory API
 * Called asynchronously from submissions.bulkSubmit
 *
 * Uses stable directoryKey (not display name) to route to correct API.
 * Supported keys: "google", "yelp", "facebook"
 */
export const submitToDirectory = internalAction({
  args: {
    submissionId: v.id("submissions"),
    directoryKey: v.string(), // Stable key: "google", "yelp", "facebook"
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
  handler: async (_ctx, args) => {
    try {
      let result = { success: false, directoryKey: "", apiId: "" };

      if (args.directoryKey === "google") {
        // Google Business Profile submission
        const googleAccountId =
          process.env.GOOGLE_ACCOUNT_ID ||
          process.env.GOOGLE_BUSINESS_ACCOUNT_ID ||
          "";

        if (!googleAccountId) {
          throw new Error(
            "GOOGLE_ACCOUNT_ID or GOOGLE_BUSINESS_ACCOUNT_ID not configured"
          );
        }

        const submission = await submitGoogleBusiness(
          googleAccountId,
          args.locationData
        );

        result = {
          success: true,
          directoryKey: "google",
          apiId: submission.googleLocationId,
        };
      } else if (args.directoryKey === "yelp") {
        // Yelp submission
        const yelpApiKey = process.env.YELP_API_KEY;
        if (!yelpApiKey) {
          throw new Error("YELP_API_KEY not configured");
        }

        const submission = await submitYelpBusiness(
          {
            name: args.locationData.businessName,
            phone: args.locationData.phone,
            address1: args.locationData.address,
            city: args.locationData.city,
            state: args.locationData.state,
            zip: args.locationData.zipCode,
            country: "US",
            website: args.locationData.website,
            categories: [{ alias: "local_services" }],
          },
          yelpApiKey
        );

        result = {
          success: true,
          directoryKey: "yelp",
          apiId: submission.yelpId,
        };
      } else if (args.directoryKey === "facebook") {
        // Facebook submission
        const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN;
        if (!facebookToken) {
          throw new Error("FACEBOOK_ACCESS_TOKEN not configured");
        }

        const pageId = await searchFacebookPage(
          args.locationData.businessName,
          args.locationData.city,
          facebookToken
        );

        if (!pageId) {
          throw new Error(
            "Facebook page not found. Must create page manually first."
          );
        }

        const submission = await submitFacebookPage(
          pageId,
          {
            name: args.locationData.businessName,
            phone: args.locationData.phone,
            website: args.locationData.website,
            street: args.locationData.address,
            city: args.locationData.city,
            state: args.locationData.state,
            zip: args.locationData.zipCode,
            country: "US",
          },
          facebookToken
        );

        result = {
          success: true,
          directoryKey: "facebook",
          apiId: submission.facebookPageId,
        };
      } else {
        // Unknown directory key - skip (caller should validate)
        throw new Error(
          `Unknown directory key: ${args.directoryKey}. Must be "google", "yelp", or "facebook".`
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: errorMessage,
        submissionId: args.submissionId,
      };
    }
  },
});

/**
 * Internal action to verify submission status via API
 * Uses stable directoryKey to route verification requests
 */
export const verifySubmissionStatus = internalAction({
  args: {
    submissionId: v.id("submissions"),
    directoryKey: v.string(), // Stable key: "google", "yelp", "facebook"
    apiId: v.string(),
  },
  handler: async (_ctx, args) => {
    try {
      let verified = false;

      if (args.directoryKey === "google") {
        const googleAccountId =
          process.env.GOOGLE_ACCOUNT_ID ||
          process.env.GOOGLE_BUSINESS_ACCOUNT_ID ||
          "";

        if (!googleAccountId) {
          throw new Error(
            "GOOGLE_ACCOUNT_ID or GOOGLE_BUSINESS_ACCOUNT_ID not configured"
          );
        }

        verified = await verifyGoogleBusinessSubmission(
          googleAccountId,
          args.apiId
        );
      } else if (args.directoryKey === "yelp") {
        const yelpApiKey = process.env.YELP_API_KEY;
        if (!yelpApiKey) {
          throw new Error("YELP_API_KEY not configured");
        }
        verified = await verifyYelpSubmission(args.apiId, yelpApiKey);
      } else if (args.directoryKey === "facebook") {
        const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN;
        if (!facebookToken) {
          throw new Error("FACEBOOK_ACCESS_TOKEN not configured");
        }
        verified = await verifyFacebookSubmission(
          args.apiId,
          facebookToken
        );
      } else {
        throw new Error(
          `Unknown directory key: ${args.directoryKey}. Must be "google", "yelp", or "facebook".`
        );
      }

      return { verified, submissionId: args.submissionId };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { verified: false, error: errorMessage };
    }
  },
});
