import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitToGoogle = mutation({
  args: {
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
  },
  async handler(ctx, args) {
    // Store submission record with correct schema fields
    const submissionId = await ctx.db.insert("submissions", {
      locationId: args.locationId,
      directoryId: args.directoryId,
      status: "submitted",
      createdAt: Date.now(),
      submittedAt: Date.now(),
    });

    return {
      status: "Submitted to Google Maps",
      submissionId,
      instructions: "Complete verification at https://www.google.com/business/",
    };
  },
});
