import { mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  submitBrightLocalCampaign,
  publishBrightLocalCampaign,
  getBrightLocalCampaignStatus,
} from "./integrations/brightlocal";

/**
 * Create and submit a location to BrightLocal
 * This submits to 958+ directories in one call
 */
export const submitToBrightLocal = mutation({
  args: {
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
  },
  async handler(ctx, args) {
    // Fetch location details
    const location = await ctx.db.get(args.locationId);
    if (!location) {
      throw new Error(`Location ${args.locationId} not found`);
    }

    // Get current user (client)
    const userId = (ctx.auth?.getUser?.()?.id as string) || "";
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId))
      .first();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Store submission record (immediate feedback to user)
    const submissionId = await ctx.db.insert("submissions", {
      clientId: user._id,
      locationId: args.locationId,
      directoryId: args.directoryId,
      status: "submitted",
      createdAt: Date.now(),
      submittedAt: Date.now(),
    });

    try {
      // Create BrightLocal campaign
      const campaignResult = await submitBrightLocalCampaign(user._id, {
        businessName: location.businessName,
        address: location.address,
        phone: location.phone,
        website: location.website,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        businessHours: location.businessHours as Record<string, string> | undefined,
      });

      // Publish the campaign (submit to all directories)
      await publishBrightLocalCampaign(campaignResult.campaignId);

      // Get initial status
      const status = await getBrightLocalCampaignStatus(campaignResult.campaignId);

      // Update submission record with campaign details
      await ctx.db.patch(submissionId, {
        brightlocalCampaignId: campaignResult.campaignId,
        status: "in_progress",
        directoriesSubmitted: status.directoriesSubmitted,
        directoriesPending: status.directoriesPending,
      });

      return {
        success: true,
        submissionId,
        campaignId: campaignResult.campaignId,
        message: `Submitted to BrightLocal. Processing ${status.directoriesSubmitted} directories...`,
        status: "in_progress",
        directoriesSubmitted: status.directoriesSubmitted,
      };
    } catch (error) {
      // Update submission with error
      await ctx.db.patch(submissionId, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });

      return {
        success: false,
        submissionId,
        message: `BrightLocal submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        status: "failed",
      };
    }
  },
});

/**
 * Poll BrightLocal for submission status updates
 * Call periodically to check progress
 */
export const checkBrightLocalStatus = mutation({
  args: {
    submissionId: v.id("submissions"),
  },
  async handler(ctx, args) {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error(`Submission ${args.submissionId} not found`);
    }

    // Only check if we have a campaign ID
    if (!submission.brightlocalCampaignId) {
      return {
        status: submission.status,
        message: "No campaign ID available",
      };
    }

    try {
      // Get latest status from BrightLocal
      const status = await getBrightLocalCampaignStatus(
        submission.brightlocalCampaignId
      );

      // Update submission record
      await ctx.db.patch(args.submissionId, {
        status: status.status === "completed" ? "verified" : status.status,
        directoriesSubmitted: status.directoriesSubmitted,
        directoriesVerified: status.directoriesVerified,
        directoriesPending: status.directoriesPending,
        lastSyncAt: status.lastUpdated,
      });

      return {
        success: true,
        status: status.status,
        directoriesSubmitted: status.directoriesSubmitted,
        directoriesVerified: status.directoriesVerified,
        directoriesPending: status.directoriesPending,
        message: `${status.directoriesVerified} verified, ${status.directoriesPending} pending, ${status.directoriesSubmitted - status.directoriesVerified - status.directoriesPending} processing`,
      };
    } catch (error) {
      return {
        success: false,
        status: "failed",
        message: `Status check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});
