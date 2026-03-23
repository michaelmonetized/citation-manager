import { query, mutation } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

export const listDirectories = query({
  args: {
    category: v.optional(v.string()),
    onlyFree: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (
    ctx: QueryCtx,
    args: {
      category?: string;
      onlyFree?: boolean;
      limit?: number;
    }
  ) => {
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
  handler: async (ctx: QueryCtx, args: { directoryId: string }) => {
    return await ctx.db.get(args.directoryId as any);
  },
});

export const listTopDirectories = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: QueryCtx, args: { limit?: number }) => {
    const limit = args.limit ?? 50;
    const allDirs = await ctx.db.query("directories").collect();
    return allDirs.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)).slice(0, limit);
  },
});

/**
 * Bulk seed directories from JSON array
 * Used to load directories.json into Convex during initialization
 * 
 * @param directories Array of directory objects from data/directories.json
 * @returns Count of directories inserted
 */
export const seedDirectories = mutation({
  args: {
    directories: v.array(
      v.object({
        rank: v.number(),
        name: v.string(),
        url: v.string(),
        submissionMethod: v.union(
          v.literal("api"),
          v.literal("form"),
          v.literal("manual"),
          v.literal("email"),
          v.literal("phone")
        ),
        apiAvailable: v.boolean(),
        apiDocsUrl: v.optional(v.string()),
        category: v.string(),
        isFree: v.boolean(),
        estimatedMonthlyViews: v.optional(v.number()),
      })
    ),
    clearExisting: v.optional(v.boolean()),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      directories: Array<{
        rank: number;
        name: string;
        url: string;
        submissionMethod: "api" | "form" | "manual" | "email" | "phone";
        apiAvailable: boolean;
        apiDocsUrl?: string;
        category: string;
        isFree: boolean;
        estimatedMonthlyViews?: number;
      }>;
      clearExisting?: boolean;
    }
  ) => {
    if (args.clearExisting) {
      const existing = await ctx.db.query("directories").collect();
      for (const dir of existing) {
        await ctx.db.delete(dir._id);
      }
    }

    let inserted = 0;
    for (const dir of args.directories) {
      await ctx.db.insert("directories", {
        rank: dir.rank,
        name: dir.name,
        url: dir.url,
        submissionMethod: dir.submissionMethod,
        apiAvailable: dir.apiAvailable,
        apiDocsUrl: dir.apiDocsUrl,
        category: dir.category,
        isFree: dir.isFree,
        estimatedMonthlyViews: dir.estimatedMonthlyViews,
      });
      inserted++;
    }

    return { inserted, total: args.directories.length };
  },
});
