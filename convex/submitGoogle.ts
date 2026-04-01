import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { submitGoogleBusiness, verifyGoogleBusinessSubmission } from "./integrations/googleBusiness";

/**
 * Submit location to Google Business Profile API
 * Stores submission record and handles API communication
 */
export const submitGoogle = mutation({
  args: {
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
  },
  async handler(ctx, args) {
    // Fetch location data
    const location = await ctx.db.get(args.locationId);
    if (!location) {
      throw new Error("Location not found");
    }

    // Get Google account ID from env
    const googleAccountId = process.env.GOOGLE_ACCOUNT_ID;
    if (!googleAccountId) {
      throw new Error("GOOGLE_ACCOUNT_ID not configured in environment");
    }

    // Submit to Google Business Profile API
    const result = await submitGoogleBusiness(googleAccountId, {
      businessName: location.businessName,
      address: location.address,
      phone: location.phone,
      website: location.website,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
    });

    if (!result.success) {
      // Record failed submission with error message
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId,
        directoryId: args.directoryId,
        status: "failed",
        errorMessage: result.error,
        createdAt: Date.now(),
      });

      return {
        status: "failed",
        submissionId,
        error: result.error,
      };
    }

    // Record successful submission
    const submissionId = await ctx.db.insert("submissions", {
      locationId: args.locationId,
      directoryId: args.directoryId,
      status: "submitted",
      createdAt: Date.now(),
      submittedAt: Date.now(),
    });

    // Optionally create verification record for later polling
    await ctx.db.insert("verifications", {
      submissionId,
      apiResponse: {
        googleLocationId: result.googleLocationId,
        submittedAt: Date.now(),
      },
      verifiedAt: Date.now(),
    });

    return {
      status: "submitted",
      submissionId,
      googleLocationId: result.googleLocationId,
      message: "Successfully submitted to Google Business Profile. Verification may take 1-3 business days.",
    };
  },
});

/**
 * Poll Google Business Profile API for verification status
 * Called periodically to update submission status
 */
export const verifyGoogle = mutation({
  args: {
    submissionId: v.id("submissions"),
    googleAccountId: v.string(),
    googleLocationId: v.string(),
  },
  async handler(ctx, args) {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // Verify with Google API
    const result = await verifyGoogleBusinessSubmission(
      args.googleAccountId,
      args.googleLocationId
    );

    if (result.verified) {
      // Update submission status to verified
      await ctx.db.patch(args.submissionId, {
        status: "verified",
        verifiedAt: Date.now(),
      });

      return {
        status: "verified",
        message: "Successfully verified on Google Business Profile",
      };
    }

    // Still pending - update with status info
    if (result.status) {
      return {
        status: "pending",
        verificationStatus: result.status,
        message: `Verification in progress. Status: ${result.status}`,
      };
    }

    // Verification failed
    await ctx.db.patch(args.submissionId, {
      status: "failed",
      errorMessage: result.error || "Verification failed",
    });

    return {
      status: "failed",
      error: result.error,
    };
  },
});
