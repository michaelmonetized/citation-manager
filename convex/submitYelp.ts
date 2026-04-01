import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { submitYelpBusiness, verifyYelpSubmission } from "./integrations/yelp";

/**
 * Submit location to Yelp Business API
 * Searches for existing listing and returns submission info
 */
export const submitYelp = mutation({
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

    // Get Yelp API key from env
    const yelpApiKey = process.env.YELP_API_KEY;
    if (!yelpApiKey) {
      // Record failed submission
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId,
        directoryId: args.directoryId,
        status: "failed",
        errorMessage: "YELP_API_KEY not configured in environment",
        createdAt: Date.now(),
      });

      return {
        status: "failed",
        submissionId,
        error: "YELP_API_KEY not configured",
      };
    }

    // Submit to Yelp Business API
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
      yelpApiKey
    );

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

    // Store Yelp ID for verification polling
    await ctx.db.insert("verifications", {
      submissionId,
      apiResponse: {
        yelpBusinessId: result.yelpId,
        submittedAt: Date.now(),
      },
      verifiedAt: Date.now(),
    });

    return {
      status: "submitted",
      submissionId,
      yelpId: result.yelpId,
      message: "Successfully found Yelp listing. Claim it via Yelp Business Manager or contact Yelp Support.",
      claimUrl: `https://business.yelp.com/claim/${result.yelpId}`,
    };
  },
});

/**
 * Poll Yelp Business API for verification status
 * Called periodically to update submission status
 */
export const verifyYelp = mutation({
  args: {
    submissionId: v.id("submissions"),
    yelpId: v.string(),
  },
  async handler(ctx, args) {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    const yelpApiKey = process.env.YELP_API_KEY;
    if (!yelpApiKey) {
      return {
        status: "pending",
        message: "Yelp API not configured - manual verification required",
      };
    }

    // Verify with Yelp API
    const result = await verifyYelpSubmission(args.yelpId, yelpApiKey);

    if (result.verified) {
      // Update submission status
      const newStatus = result.claimed ? "verified" : "submitted";
      await ctx.db.patch(args.submissionId, {
        status: newStatus,
        verifiedAt: newStatus === "verified" ? Date.now() : undefined,
      });

      return {
        status: newStatus,
        claimed: result.claimed,
        message: result.claimed
          ? "Business claim verified on Yelp"
          : "Business found on Yelp but not yet claimed",
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
