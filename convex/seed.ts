import { mutation } from "./_generated/server";
import { v } from "convex/values";
import directories from "../data/directories.json";

/**
 * Seed directories into the database
 * Call once during initial setup
 */
export const seedDirectories = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if directories already exist
    const existingDirs = await ctx.db.query("directories").collect();
    if (existingDirs.length > 0) {
      return {
        success: false,
        message: `Directories already seeded (${existingDirs.length} found)`,
        skipped: true,
      };
    }

    // Insert all directories
    let inserted = 0;
    for (const dir of directories) {
      await ctx.db.insert("directories", {
        name: dir.name,
        url: dir.url,
        rank: dir.rank,
        category: dir.category,
        submissionMethod: dir.submissionMethod as
          | "api"
          | "form"
          | "manual"
          | "email"
          | "phone",
        apiAvailable: dir.apiAvailable,
        apiDocsUrl: dir.apiDocsUrl,
        isFree: dir.isFree,
        estimatedMonthlyViews: dir.estimatedMonthlyViews,
      });
      inserted++;
    }

    return {
      success: true,
      message: `Seeded ${inserted} directories`,
      count: inserted,
    };
  },
});

/**
 * Clear all directories (for testing)
 */
export const clearDirectories = mutation({
  args: {},
  handler: async (ctx) => {
    const allDirs = await ctx.db.query("directories").collect();
    for (const dir of allDirs) {
      await ctx.db.delete(dir._id);
    }
    return { success: true, deletedCount: allDirs.length };
  },
});
