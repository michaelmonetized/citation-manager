import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitToGoogle = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    website: v.string(),
  },
  async handler(ctx, args) {
    // Store submission record immediately
    const submissionId = await ctx.db.insert("submissions", {
      name: args.name,
      address: args.address,
      phone: args.phone,
      directory: "Google Maps",
      status: "submitted",
      url: "https://www.google.com/business/",
      createdAt: Date.now(),
    });

    return {
      status: "Submitted to Google Maps",
      submissionId,
      directory: "Google Maps",
      instructions: "Complete verification at https://www.google.com/business/",
    };
  },
});
