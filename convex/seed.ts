import { internalMutation } from "./_generated/server";
import directories from "../data/directories.json";

/**
 * Seed directories into the database (idempotent)
 * Automatically deduplicates and only inserts missing directories
 * Safe to call multiple times; handles partial runs gracefully
 */
export const seedDirectories = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get existing directories by name (unique key)
    const existingDirs = await ctx.db.query("directories").collect();
    const existingNames = new Set(existingDirs.map((d) => d.name));

    // Insert only missing directories
    let inserted = 0;
    let skipped = 0;

    for (const dir of directories) {
      if (existingNames.has(dir.name)) {
        skipped++;
        continue;
      }

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
      message: `Seeded ${inserted} directories, ${skipped} already existed`,
      inserted,
      skipped,
      total: inserted + skipped,
    };
  },
});

/**
 * Clear all directories (for testing only)
 * Internal mutation - not exposed to public API
 */
export const clearDirectories = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allDirs = await ctx.db.query("directories").collect();
    let deleted = 0;
    for (const dir of allDirs) {
      await ctx.db.delete(dir._id);
      deleted++;
    }
    return { success: true, deletedCount: deleted };
  },
});
