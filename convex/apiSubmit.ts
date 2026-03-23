import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { submitGoogleBusiness, verifyGoogleBusinessSubmission } from "./integrations/googleBusiness";
import { submitYelpBusiness, verifyYelpSubmission } from "./integrations/yelp";
import { searchFacebookPage, submitFacebookPage, verifyFacebookSubmission } from "./integrations/facebook";

/**
 * Internal action to submit a location to a specific directory API
 * Called asynchronously from submissions.bulkSubmit
 */
export const submitToDirectory = internalAction({
  args: {
    submissionId: v.id("submissions"),
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
  handler: async (_ctx, args) => {
    try {
      let result = { success: false, directoryId: "", apiId: "" };

      if (args.directoryName === "Google Business Profile") {
        // Google Business Profile submission
        const googleAccountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID || "";

        if (!googleAccountId) {
          throw new Error(
            "GOOGLE_BUSINESS_ACCOUNT_ID not configured. Set in env vars."
          );
        }

        const submission = await submitGoogleBusiness(
          googleAccountId,
          args.locationData
        );

        result = {
          success: true,
          directoryId: "google",
          apiId: submission.googleLocationId,
        };
      } else if (args.directoryName === "Yelp") {
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
          directoryId: "yelp",
          apiId: submission.yelpId,
        };
      } else if (args.directoryName === "Facebook Business") {
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
          directoryId: "facebook",
          apiId: submission.facebookPageId,
        };
      } else {
        // For non-API directories, mark as submitted manually
        result = {
          success: true,
          directoryId: args.directoryName.toLowerCase(),
          apiId: "",
        };
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
 */
export const verifySubmissionStatus = internalAction({
  args: {
    submissionId: v.id("submissions"),
    directoryName: v.string(),
    apiId: v.string(),
  },
  handler: async (_ctx, args) => {
    try {
      let verified = false;

      if (args.directoryName === "Google Business Profile") {
        const googleAccountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID || "";
        verified = await verifyGoogleBusinessSubmission(
          googleAccountId,
          args.apiId
        );
      } else if (args.directoryName === "Yelp") {
        const yelpApiKey = process.env.YELP_API_KEY;
        if (!yelpApiKey) {
          throw new Error("YELP_API_KEY not configured");
        }
        verified = await verifyYelpSubmission(args.apiId, yelpApiKey);
      } else if (args.directoryName === "Facebook Business") {
        const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN;
        if (!facebookToken) {
          throw new Error("FACEBOOK_ACCESS_TOKEN not configured");
        }
        verified = await verifyFacebookSubmission(
          args.apiId,
          facebookToken
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
