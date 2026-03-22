import { query } from "./_generated/server";
import { v } from "convex/values";

export const listDirectories = query({
  args: {
    category: v.optional(v.string()),
    onlyFree: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allDirs = await ctx.db.query("directories").collect();

    let filtered = allDirs;
    
    if (args.category) {
      filtered = filtered.filter((d) => d.category === args.category);
    }
    
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
    const allDirs = await ctx.db.query("directories").collect();
    return allDirs.sort((a, b) => a.rank - b.rank).slice(0, limit);
  },
});
