import { mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  submitFacebookPage,
  verifyFacebookSubmission,
  searchFacebookPage,
  getInstagramBusiness,
  mapLocationToFacebookFormat,
} from "./integrations/facebook";

/**
 * Submit location to Facebook Graph API
 * Searches for or creates a Facebook Page and updates it with location data
 */
export const submitFacebook = mutation({
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

    // Get Facebook access token from env
    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    if (!facebookAccessToken) {
      // Record failed submission
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId,
        directoryId: args.directoryId,
        status: "failed",
        errorMessage: "FACEBOOK_ACCESS_TOKEN not configured in environment",
        createdAt: Date.now(),
      });

      return {
        status: "failed",
        submissionId,
        error: "FACEBOOK_ACCESS_TOKEN not configured",
      };
    }

    try {
      // Search for existing Facebook Page
      const existingPageId = await searchFacebookPage(
        location.businessName,
        location.city,
        facebookAccessToken
      );

      if (!existingPageId) {
        // Note: Creating pages requires additional permissions and business account setup
        // For now, we return an error and guide the user
        const submissionId = await ctx.db.insert("submissions", {
          locationId: args.locationId,
          directoryId: args.directoryId,
          status: "failed",
          errorMessage: "Facebook page not found. Create one at https://www.facebook.com/pages/",
          createdAt: Date.now(),
        });

        return {
          status: "failed",
          submissionId,
          error: "Facebook page not found. Please create one first.",
          createUrl: "https://www.facebook.com/pages/",
        };
      }

      // Update existing Facebook Page with location data
      const facebookPageData = mapLocationToFacebookFormat({
        businessName: location.businessName,
        address: location.address,
        phone: location.phone,
        website: location.website,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
      });

      const result = await submitFacebookPage(
        existingPageId,
        facebookPageData,
        facebookAccessToken
      );

      if (!result.success) {
        // Record failed submission
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

      // Get linked Instagram Business Account (if any)
      const instagramResult = await getInstagramBusiness(
        existingPageId,
        facebookAccessToken
      );

      // Record successful submission
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId,
        directoryId: args.directoryId,
        status: "submitted",
        createdAt: Date.now(),
        submittedAt: Date.now(),
      });

      // Store Facebook and Instagram IDs for verification
      await ctx.db.insert("verifications", {
        submissionId,
        apiResponse: {
          facebookPageId: existingPageId,
          instagramBusinessId: instagramResult.instagramId,
          submittedAt: Date.now(),
        },
        verifiedAt: Date.now(),
      });

      return {
        status: "submitted",
        submissionId,
        facebookPageId: existingPageId,
        instagramId: instagramResult.instagramId || null,
        message: "Successfully updated Facebook page with business information",
        pageUrl: `https://www.facebook.com/${existingPageId}`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Record failed submission
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId,
        directoryId: args.directoryId,
        status: "failed",
        errorMessage: errorMessage,
        createdAt: Date.now(),
      });

      return {
        status: "failed",
        submissionId,
        error: errorMessage,
      };
    }
  },
});

/**
 * Poll Facebook Graph API for verification status
 * Called periodically to update submission status
 */
export const verifyFacebook = mutation({
  args: {
    submissionId: v.id("submissions"),
    facebookPageId: v.string(),
  },
  async handler(ctx, args) {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    if (!facebookAccessToken) {
      return {
        status: "pending",
        message: "Facebook API not configured - manual verification required",
      };
    }

    // Verify with Facebook API
    const result = await verifyFacebookSubmission(args.facebookPageId, facebookAccessToken);

    if (result.verified) {
      // Update submission status to verified
      await ctx.db.patch(args.submissionId, {
        status: "verified",
        verifiedAt: Date.now(),
      });

      const contactInfo = result.hasContactInfo
        ? "with complete contact information"
        : "but contact information is incomplete";

      return {
        status: "verified",
        hasContactInfo: result.hasContactInfo,
        message: `Successfully verified on Facebook ${contactInfo}`,
        pageUrl: `https://www.facebook.com/${args.facebookPageId}`,
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
