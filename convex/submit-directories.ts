import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  submitGoogleBusiness,
  verifyGoogleBusinessSubmission,
} from "./integrations/google-business";
import {
  submitYelpBusiness,
  searchYelpBusiness,
  verifyYelpSubmission,
} from "./integrations/yelp";
import {
  searchFacebookPage,
  submitFacebookPage,
  verifyFacebookSubmission,
  getInstagramBusiness,
} from "./integrations/facebook";

/**
 * Submit location to Google Business Profile
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY env vars
 */
export const submitToGoogle = action({
  args: {
    submissionId: v.id("submissions"),
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
  },
  handler: async (ctx, args) => {
    try {
      // Get location data directly from DB
      const location = await ctx.runQuery(internal.locations.getLocation, {
        locationId: args.locationId,
      });
      const directory = await ctx.runQuery(internal.directories.getDirectory, {
        directoryId: args.directoryId,
      });

      if (!location || !directory) {
        throw new Error("Location or directory not found");
      }

      // Submit to Google
      const accountId = process.env.GOOGLE_ACCOUNT_ID || "default";
      const result = await submitGoogleBusiness(
        accountId,
        {
          businessName: location.businessName,
          address: location.address,
          phone: location.phone,
          website: location.website,
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
        },
        process.env.GOOGLE_ACCESS_TOKEN || ""
      );

      // Update submission status
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "submitted",
      });

      return { success: true, directoryId: args.directoryId, ...result };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "failed",
        errorMessage: errorMsg,
      });

      return { success: false, error: errorMsg };
    }
  },
});

/**
 * Submit location to Yelp
 * Requires YELP_API_KEY env var
 */
export const submitToYelp = action({
  args: {
    submissionId: v.id("submissions"),
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
  },
  handler: async (ctx, args) => {
    try {
      // Get location and directory data
      const location = await ctx.runQuery(internal.locations.getLocation, {
        locationId: args.locationId,
      });
      const directory = await ctx.runQuery(internal.directories.getDirectory, {
        directoryId: args.directoryId,
      });

      if (!location || !directory) {
        throw new Error("Location or directory not found");
      }

      const apiKey = process.env.YELP_API_KEY || "";
      if (!apiKey) {
        throw new Error("YELP_API_KEY not configured");
      }

      // Search for existing business first
      const yelpId = await searchYelpBusiness(
        location.businessName,
        location.city,
        apiKey
      );

      if (!yelpId) {
        throw new Error("Business not found on Yelp. Please create it first.");
      }

      // Submit to Yelp
      const result = await submitYelpBusiness(
        {
          name: location.businessName,
          phone: location.phone,
          address1: location.address,
          city: location.city,
          state: location.state,
          zip: location.zipCode,
          country: "US",
          website: location.website,
        },
        apiKey
      );

      // Update submission status
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "submitted",
      });

      return { success: true, directoryId: args.directoryId, ...result };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "failed",
        errorMessage: errorMsg,
      });

      return { success: false, error: errorMsg };
    }
  },
});

/**
 * Submit location to Facebook
 * Requires FACEBOOK_ACCESS_TOKEN env var
 */
export const submitToFacebook = action({
  args: {
    submissionId: v.id("submissions"),
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
  },
  handler: async (ctx, args) => {
    try {
      // Get location and directory data
      const location = await ctx.runQuery(internal.locations.getLocation, {
        locationId: args.locationId,
      });
      const directory = await ctx.runQuery(internal.directories.getDirectory, {
        directoryId: args.directoryId,
      });

      if (!location || !directory) {
        throw new Error("Location or directory not found");
      }

      const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || "";
      if (!accessToken) {
        throw new Error("FACEBOOK_ACCESS_TOKEN not configured");
      }

      // Search for existing Facebook page
      const pageId = await searchFacebookPage(
        location.businessName,
        location.city,
        accessToken
      );

      if (!pageId) {
        throw new Error("Business page not found on Facebook. Please create it first.");
      }

      // Submit to Facebook
      const result = await submitFacebookPage(
        pageId,
        {
          name: location.businessName,
          phone: location.phone,
          website: location.website,
          street: location.address,
          city: location.city,
          state: location.state,
          zip: location.zipCode,
          country: "US",
        },
        accessToken
      );

      // Try to get Instagram account
      const instagramId = await getInstagramBusiness(pageId, accessToken);

      // Update submission status
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "submitted",
      });

      return {
        success: true,
        directoryId: args.directoryId,
        facebookPageId: pageId,
        instagramBusinessId: instagramId,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "failed",
        errorMessage: errorMsg,
      });

      return { success: false, error: errorMsg };
    }
  },
});

/**
 * Batch submit to all three platforms
 */
export const batchSubmitToAPIs = action({
  args: {
    locationId: v.id("locations"),
    directoryIds: v.array(v.id("directories")),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const directoryId of args.directoryIds) {
      // Get directory to determine which API to call
      const directory = await ctx.runQuery(internal.directories.getDirectory, {
        directoryId,
      });

      if (!directory) continue;

      // Create submission record
      const submissionResult = await ctx.runMutation(
        internal.submissions.bulkSubmit,
        {
          locationId: args.locationId,
          directoryIds: [directoryId],
        }
      );

      let result = { success: false, directoryId };

      // Route to appropriate API based on directory
      if (directory.name.includes("Google")) {
        result = await ctx.runAction(submitToGoogle, {
          submissionId: submissionResult.submissionIds[0],
          locationId: args.locationId,
          directoryId,
        });
      } else if (directory.name.includes("Yelp")) {
        result = await ctx.runAction(submitToYelp, {
          submissionId: submissionResult.submissionIds[0],
          locationId: args.locationId,
          directoryId,
        });
      } else if (directory.name.includes("Facebook")) {
        result = await ctx.runAction(submitToFacebook, {
          submissionId: submissionResult.submissionIds[0],
          locationId: args.locationId,
          directoryId,
        });
      }

      results.push(result);
    }

    return { totalSubmitted: results.length, results };
  },
});

/**
 * Verify all submissions for a location
 */
export const verifyAllSubmissions = action({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const submissions = await ctx.runQuery(
      internal.submissions.getLocationSubmissions,
      {
        locationId: args.locationId,
      }
    );

    const verificationResults = [];

    for (const submission of submissions) {
      let verified = false;

      // Get directory to determine which API to verify
      const directory = await ctx.runQuery(internal.directories.getDirectory, {
        directoryId: submission.directoryId,
      });

      if (!directory) continue;

      try {
        if (directory.name.includes("Google")) {
          verified = await verifyGoogleBusinessSubmission(
            process.env.GOOGLE_ACCOUNT_ID || "default",
            submission.id,
            process.env.GOOGLE_ACCESS_TOKEN || ""
          );
        } else if (directory.name.includes("Yelp")) {
          verified = await verifyYelpSubmission(
            submission.id,
            process.env.YELP_API_KEY || ""
          );
        } else if (directory.name.includes("Facebook")) {
          verified = await verifyFacebookSubmission(
            submission.id,
            process.env.FACEBOOK_ACCESS_TOKEN || ""
          );
        }

        if (verified) {
          await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
            submissionId: submission.id,
            status: "verified",
          });
        }
      } catch (error) {
        // Verification failed, keep status as submitted
      }

      verificationResults.push({
        submissionId: submission.id,
        directoryId: submission.directoryId,
        verified,
      });
    }

    return verificationResults;
  },
});
