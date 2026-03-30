import { mutation, query } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

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
  handler: async (
    ctx: MutationCtx,
    args: {
      locationId: string;
      directoryIds: string[];
    }
  ) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify user owns this location
    const location = await ctx.db.get(args.locationId as any);
    if (!location) throw new Error("Location not found");
    if ((location as any).userEmail !== user.email) throw new Error("Unauthorized");

    // Create submission records for each directory
    const submissionIds: string[] = [];
    for (const directoryId of args.directoryIds) {
      const submissionId = await ctx.db.insert("submissions", {
        locationId: args.locationId as any,
        directoryId: directoryId as any,
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
  handler: async (ctx: QueryCtx, args: { locationId: string }) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify user owns this location
    const location = await ctx.db.get(args.locationId as any);
    if (!location) throw new Error("Location not found");
    if ((location as any).userEmail !== user.email) throw new Error("Unauthorized");

    return await ctx.db
      .query("submissions")
      .withIndex("by_locationId", (q) => q.eq("locationId", args.locationId as any))
      .collect();
  },
});

/**
 * Get submission status summary
 */
export const getSubmissionStatus = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx: QueryCtx, args: { locationId: string }) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify user owns this location
    const location = await ctx.db.get(args.locationId as any);
    if (!location) throw new Error("Location not found");
    if ((location as any).userEmail !== user.email) throw new Error("Unauthorized");

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_locationId", (q) => q.eq("locationId", args.locationId as any))
      .collect();

    const statusCounts: Record<string, number> = {
      pending: 0,
      submitted: 0,
      verified: 0,
      failed: 0,
    };

    submissions.forEach((sub: any) => {
      const status = sub.status as string;
      if (status in statusCounts) {
        statusCounts[status]++;
      }
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
  handler: async (
    ctx: MutationCtx,
    args: {
      submissionId: string;
      status: "pending" | "submitted" | "verified" | "failed";
      errorMessage?: string;
    }
  ) => {
    const submission = await ctx.db.get(args.submissionId as any);
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

    await ctx.db.patch(args.submissionId as any, updateData);
    return { success: true };
  },
});

/**
 * Get submission details (for UI to show what was submitted)
 */
export const getSubmissionDetail = query({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx: QueryCtx, args: { submissionId: string }) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    const submission = await ctx.db.get(args.submissionId as any);
    if (!submission) throw new Error("Submission not found");

    const location = await ctx.db.get((submission as any).locationId as any);
    if (!location) throw new Error("Location not found");
    if ((location as any).userEmail !== user.email) throw new Error("Unauthorized");

    const directory = await ctx.db.get((submission as any).directoryId as any);

    return {
      submission,
      location,
      directory,
    };
  },
});

/**
 * Create a new directory submission (user-submitted directories for platform review)
 * Issue #16: Citation Directory Submissions (MVP)
 */
export const createSubmission = mutation({
  args: {
    directoryName: v.string(),
    directoryUrl: v.string(),
    category: v.string(),
    isFree: v.boolean(),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      directoryName: string;
      directoryUrl: string;
      category: string;
      isFree: boolean;
    }
  ) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    const submissionId = await ctx.db.insert("directorySubmissions", {
      directoryName: args.directoryName,
      directoryUrl: args.directoryUrl,
      category: args.category,
      isFree: args.isFree,
      submittedBy: user.email,
      status: "pending",
      createdAt: Date.now(),
    });

    return { submissionId, status: "pending" };
  },
});

/**
 * List all pending directory submissions for admin review
 * Issue #16: Citation Directory Submissions (MVP)
 */
export const listPendingSubmissions = query({
  handler: async (ctx: QueryCtx) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");
    // TODO: Add admin role check here
    // if (!user.isAdmin) throw new Error("Admin access required");

    return await ctx.db
      .query("directorySubmissions")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();
  },
});

/**
 * Approve or reject a directory submission
 * Issue #16: Citation Directory Submissions (MVP)
 */
export const approveSubmission = mutation({
  args: {
    submissionId: v.id("directorySubmissions"),
    approved: v.boolean(),
    rejectionReason: v.optional(v.string()),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      submissionId: string;
      approved: boolean;
      rejectionReason?: string;
    }
  ) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");
    // TODO: Add admin role check here
    // if (!user.isAdmin) throw new Error("Admin access required");

    const submission = await ctx.db.get(args.submissionId as any);
    if (!submission) throw new Error("Submission not found");

    const updateData: Record<string, unknown> = {
      status: args.approved ? "approved" : "rejected",
      reviewedBy: user.email,
      reviewedAt: Date.now(),
    };

    if (args.rejectionReason) {
      updateData.rejectionReason = args.rejectionReason;
    }

    // If approved, create a new directory entry
    if (args.approved) {
      const directoryId = await ctx.db.insert("directories", {
        name: (submission as any).directoryName,
        url: (submission as any).directoryUrl,
        category: (submission as any).category,
        isFree: (submission as any).isFree,
        createdAt: Date.now(),
        source: "user-submission",
      });
      updateData.approvedDirectoryId = directoryId;
    }

    await ctx.db.patch(args.submissionId as any, updateData);

    // TODO: Send email notification to submitter
    // await sendEmail({
    //   to: (submission as any).submittedBy,
    //   subject: args.approved ? "Your directory was approved!" : "Your directory submission was rejected",
    //   ...
    // });

    return { success: true };
  },
});
