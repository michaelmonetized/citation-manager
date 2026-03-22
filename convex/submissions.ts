import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

/**
 * Create a bulk submission job
 * User selects a location and directories to submit to
 * System enqueues submission tasks for each directory
 */
export const bulkSubmit = mutation({
  args: {
    locationId: v.id("locations"),
    directoryIds: v.array(v.id("directories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this location
    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userId !== userId) throw new Error("Unauthorized");

    // Create submission records for each directory
    const submissionIds: string[] = [];
    for (const directoryId of args.directoryIds) {
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId,
        directoryId,
        status: "pending",
        createdAt: Date.now(),
      });
      submissionIds.push(submissionId);
    }

    return { submissionIds, count: submissionIds.length };
  },
});

/**
 * Get all submissions for a location
 */
export const getLocationSubmissions = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this location
    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userId !== userId) throw new Error("Unauthorized");

    return await ctx.db
      .query("submissions")
      .withIndex("by_locationId", (q) => q.eq("locationId", args.locationId))
      .collect();
  },
});

/**
 * Get submission status summary
 */
export const getSubmissionStatus = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this location
    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userId !== userId) throw new Error("Unauthorized");

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_locationId", (q) => q.eq("locationId", args.locationId))
      .collect();

    const statusCounts = {
      pending: 0,
      submitted: 0,
      verified: 0,
      failed: 0,
    };

    submissions.forEach((sub) => {
      statusCounts[sub.status]++;
    });

    return {
      total: submissions.length,
      ...statusCounts,
      completionPercentage: Math.round(
        ((statusCounts.submitted + statusCounts.verified) / submissions.length) *
          100
      ),
    };
  },
});

/**
 * Update submission status (called by background jobs)
 * In production, this would be called by Fly.io workers after API calls
 */
export const updateSubmissionStatus = mutation({
  args: {
    submissionId: v.id("submissions"),
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("verified"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    const updateData: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.status === "submitted") {
      updateData.submittedAt = Date.now();
    }
    if (args.status === "verified") {
      updateData.verifiedAt = Date.now();
    }
    if (args.errorMessage) {
      updateData.errorMessage = args.errorMessage;
    }

    await ctx.db.patch(args.submissionId, updateData);
    return { success: true };
  },
});

/**
 * Get submission details (for UI to show what was submitted)
 */
export const getSubmissionDetail = query({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    const location = await ctx.db.get(submission.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userId !== userId) throw new Error("Unauthorized");

    const directory = await ctx.db.get(submission.directoryId);

    return {
      submission,
      location,
      directory,
    };
  },
});
