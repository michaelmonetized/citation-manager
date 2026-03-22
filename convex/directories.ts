import { query } from "./_generated/server";
import { v } from "convex/values";

export const listDirectories = query({
  args: {
    category: v.optional(v.string()),
    onlyFree: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("directories");

    if (args.category) {
      q = q.withIndex("by_category", (query) =>
        query.eq("category", args.category)
      );
    } else {
      q = q.withIndex("by_rank", (query) => query.gte("rank", 0));
    }

    const dirs = await q.collect();

    let filtered = dirs;
    if (args.onlyFree) {
      filtered = filtered.filter((d) => d.isFree);
    }

    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

export const getDirectory = query({
  args: { directoryId: v.id("directories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.directoryId);
  },
});

export const listTopDirectories = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("directories")
      .withIndex("by_rank", (q) => q.gte("rank", 0))
      .take(limit);
  },
});
